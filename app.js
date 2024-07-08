/*

https://github.com/cesargh/encriptador-de-texto
v1.0 | 2024-07-01
License: None (Public Domain)

*/

const encryptionKeys = [
    { char: 'e', word: 'enter' },
    { char: 'i', word: 'imes' },
    { char: 'a', word: 'ai' },
    { char: 'o', word: 'ober' },
    { char: 'u', word: 'ufat' }
];

const taInput = document.getElementById("textareaInput");
const taOutput = document.getElementById("textareaOutput");

const pgStatusInput = document.getElementById("paragraphStatusInput");
const pgStatusOutput = document.getElementById("paragraphStatusOutput");
const pgStatusBlank = "\u00A0";

let callbackTimeout = null;

function isEmptyText(text) {
    return (text.trim().length === 0);
}

function isValidText(text) {
    const restriction = /^[a-zñç ]+$/;
    return restriction.test(text);;
}

function replaceCharacters(sortForward, inputText) {
    const sortedKeys = sortForward ? encryptionKeys : encryptionKeys.slice().reverse();
    let outputText = inputText;
    sortedKeys.forEach(({ char, word }) => {
        const searchKey = sortForward ? char : word;
        const replaceKey = sortForward ? word : char;
        const searchRule = new RegExp(searchKey, 'g');
        outputText = outputText.replace(searchRule, replaceKey);
    });
    return outputText;
}

function delayCallback(callbackFunction) {
    clearTimeout(callbackTimeout);
    callbackTimeout = setTimeout(callbackFunction, 500);
}
  
function synchTextareaOutput(isWriting) {
    taOutput.value = "";
    taOutput.className = "textarea__default textarea__output__" + (isWriting ? "writing" : "waiting");
    pgStatusOutput.innerText = pgStatusBlank;
    if (isWriting) {
        pgStatusInput.innerText = "Sólo letras minúsculas sin acentos.";
    }
}

function onclickButtonEncrypt(sortForward) {
    let outputText = "";
    try {
        const inputText = taInput.value;
        if (isEmptyText(inputText)) {
            pgStatusInput.innerText = "No hay texto que procesar...";
        }
        else if (! isValidText(inputText)) {
            pgStatusInput.innerText = "Texto inválido. Sólo se aceptan letras minúsculas sin acentos.";
        }
        else {
            outputText = replaceCharacters(sortForward, inputText);
        }
    }
    catch(excep) {
        console.log(excep);
        pgStatusInput.innerText = `Error al ${sortForward ? "encriptar" : "desencriptar"}. Detalles en la consola.`;
    }
    if (isEmptyText(outputText)) {
        synchTextareaOutput(false);
    }
    else {
        taOutput.value = outputText;
        taOutput.className = "textarea__default";
        pgStatusOutput.innerText = pgStatusBlank;
        pgStatusInput.innerText = `Texto ${sortForward ? "encriptado" : "desencriptado"} con éxito.`;
    }
}

async function onclickButtonPaste() {
    synchTextareaOutput(false);
    try {
        const clipText = await navigator.clipboard.readText();
        if (typeof clipText === "string") {
            if (isEmptyText(clipText)) {
                pgStatusInput.innerText = "Nada que pegar...";
            }
            else {
                taInput.value = clipText;
                pgStatusInput.innerText = "Texto pegado desde el portapapeles.";
            }
        }
        else {
            pgStatusInput.innerText = "El portapapeles no contiene un texto.";
        }
    }
    catch(excep) {
        console.log(excep);
        pgStatusInput.innerText = "Error al pegar. Detalles en la consola.";
    }
}

async function onclickButtonCopy() {
    pgStatusInput.innerText = pgStatusBlank;
    try {
        const outputText = taOutput.value;
        if (isEmptyText(outputText)) {
            pgStatusOutput.innerText = "Nada que copiar...";
        } 
        else {
            await navigator.clipboard.writeText(outputText);
            pgStatusOutput.innerText = "Texto copiado al portapapeles.";  
        }
    }
    catch(excep) {
        console.log(excep);
        pgStatusOutput.innerText = "Error al copiar. Detalles en la consola.";
    }
}