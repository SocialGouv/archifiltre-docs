const parseCsv = require("csv-parse/lib/sync");
const argv = require("yargs").argv;
const fs = require("fs");
const _ = require("lodash");
const path = require("path");

const inputFile = argv._[0];
const outputLanguages = argv._.slice(1);

const translationsDir = path.join(__dirname, "../src/translations");

const outputFiles = outputLanguages.map((lang) =>
  path.join(translationsDir, `${lang}.json`)
);

const inputCsv = fs.readFileSync(inputFile, "utf8");

const translationsArray = parseCsv(inputCsv);

/**
 * Insert value at pathArray inside an object with a side effect
 * @param object
 * @param pathArray - An array of props like ["prop1", "prop2", "0"]
 * @param value
 */
const insertInObject = (object, pathArray, value) => {
  const [key, ...pathRest] = pathArray;

  if (pathRest.length === 0) {
    object[key] = value;
    return;
  }

  if (object[key] === undefined) {
    object[key] = {};
  }

  insertInObject(object[key], pathRest, value);
};

const FIRST_TRANSLATION_INDEX = 2;

/**
 * Inserts the translations of the translations array into javascript objects based on the first column as a path
 * @param outputObjects
 */
const insertTranslationsToObjects = (outputObjects) => {
  translationsArray.slice(1).forEach((translationArray) => {
    outputObjects.forEach((outputObject, index) =>
      insertInObject(
        outputObject,
        _.toPath(translationArray[0]),
        translationArray[FIRST_TRANSLATION_INDEX + index]
      )
    );
  });
};

const translationsObjects = outputFiles.map(() => ({}));

insertTranslationsToObjects(translationsObjects);

translationsObjects.map((obj, index) =>
  fs.writeFileSync(outputFiles[index], JSON.stringify(obj, null, 2), "utf8")
);
