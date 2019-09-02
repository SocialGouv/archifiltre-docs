import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

/**
 * Loads a docx template, replaces the templated values and returns a buffer
 * @param templatePath - The path of the docx template to load
 * @param values - An object containing the values to replace
 * @returns {Source|*|String|Uint8Array|ArrayBuffer|Buffer|GeneratorResult}
 */
export const exportToDocX = (templatePath, values) => {
  const templateContent = fs.readFileSync(
    path.resolve("./static", templatePath),
    "binary"
  );

  const zip = PizZip(templateContent);
  const docx = new Docxtemplater();

  docx.loadZip(zip);
  docx.setData(values);

  docx.render();

  return docx.getZip().generate({ type: "blob" });
};
