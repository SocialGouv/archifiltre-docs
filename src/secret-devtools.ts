import { ipcRenderer } from "electron";

const openDevtools = () => {
    ipcRenderer.send("open-devtools");
};

const prevKey: string[] = [];
const password = "devtools";
const passwordLength = password.length;

const keyUpCallback = (event: KeyboardEvent) => {
    prevKey.push(event.key);
    if (passwordLength < prevKey.length) {
        prevKey.shift();
    }
    const seq = prevKey.join("");
    if (seq === password) {
        openDevtools();
    }
};

const enable = (): void => {
    document.addEventListener("keyup", keyUpCallback);
};

const disable = (): void => {
    document.removeEventListener("keyup", keyUpCallback);
};

export const SecretDevtools = {
    disable,
    enable,
};
