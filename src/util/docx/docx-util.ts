import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import { angularParser } from "./angular-parser";

export type FileReplacer = (zip: PizZip, values: DocXValuesMap) => PizZip;

export interface DocXValuesMap {
  [key: string]: any;
}

/**
 * Loads a docx template, replaces the templated values and returns a Blob
 * containing the completed docx file.
 * @param templatePath - The path of the docx template to load
 * @param values - An object containing the values to replace
 * @param replacers
 */
export const exportToDocX = (
  templatePath: string,
  values: DocXValuesMap,
  ...replacers: FileReplacer[]
): Blob => {
  const templateContent = fs.readFileSync(
    path.resolve("./static", templatePath),
    "binary"
  );

  const docxZip = new PizZip(templateContent);
  const modifiedZip = new Docxtemplater()
    .loadZip(docxZip)
    .setOptions({ parser: angularParser })
    .setData(values)
    .render()
    .getZip();

  const replacedZip = replacers.reduce(
    (zip, replacer) => replacer(zip, values),
    modifiedZip
  );

  return replacedZip.generate({ type: "blob" });
};

/**
 * Creates a function that will replace a chart file in the docx.
 * This is not the cleanest way to do it, but creating a docxtemplater module is a pain
 * and docxtemplater-chart-module only works with docxtemplater@2
 * @param chartName - The name of the chart in the docx
 * @param chartTemplate - The template used to replace to replace the chart
 */
export const createChartReplacer = (
  chartName: string,
  chartTemplate: string
): FileReplacer => (zip: PizZip, values) => {
  const chartFile = fs.readFileSync(chartTemplate, "utf-8");
  // regex that matches {myKey} or { myKey } patterns and captures myKey
  const matchInferredValuesRegex = /{\s*(\w+?)\s*}/gm;

  const replacedChartFile = chartFile.replace(
    matchInferredValuesRegex,
    (_, token) => {
      return values[token] || "";
    }
  );
  zip.file(`word/charts/${chartName}.xml`, replacedChartFile);
  return zip;
};
