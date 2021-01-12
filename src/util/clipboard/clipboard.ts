import { clipboard } from "electron";

export const copyToClipboard = (text: string) => clipboard.writeText(text);
