const { ipcRenderer } = require("electron");

const openDevtools = () => {
  ipcRenderer.send("open-devtools");
};

const prevKey = [];
const password = "devtools";
const password_len = password.length;

const keyUpCallback = (event) => {
  prevKey.push(event.key);
  if (password_len < prevKey.length) {
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
