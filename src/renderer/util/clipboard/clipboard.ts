import { clipboard } from "electron";

export const copyToClipboard = (text: string): void => {
  clipboard.writeText(text);
};
