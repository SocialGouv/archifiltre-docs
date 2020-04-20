import { ipcRenderer } from "electron";

const openDevtools = () => {
  ipcRenderer.send("open-devtools");
};

const prevKey = [] as string[];
const password = "devtools";
const passwordLength = password.length;

const keyUpCallback = (event) => {
  prevKey.push(event.key);
  if (passwordLength < prevKey.length) {
    prevKey.shift();
  }
  const seq = prevKey.join("");
  if (seq === password) {
    openDevtools();
  }
};

const enable = () => {
  document.addEventListener("keyup", keyUpCallback);
};

const disable = () => {
  document.removeEventListener("keyup", keyUpCallback);
};

export const SecretDevtools = {
  enable,
  disable,
};
