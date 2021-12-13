const _ = require("lodash");
const path = require("path");
const fs = require("fs");
const csvStringify = require("csv-stringify/lib/sync");

const translationFolder = path.join(__dirname, "../src/translations");
const translationOutputFolder = path.join(__dirname, "../translations");

/**
 * Get the translation json object for the provided language
 * @param language
 * @returns {any}
 */
const getTranslation = (language) =>
  require(path.join(translationFolder, `${language}.json`));

const en = getTranslation("en");
const fr = getTranslation("fr");
const de = getTranslation("de");

/**
 * Generate a csv with the value path in the first column, the value of the base object in the second column
 * and the value of the diffed object in the third column
 * @param base
 * @param objects
 * @param rootKey
 * @returns {*}
 */
const computeMissingKeys = (base, objects, rootKey = []) => {
  const normalizedObjects = objects.map((object) => object || {});
  return [].concat(
    ...Object.keys(base).map((key) => {
      const newRootKeyArray = rootKey.concat(key);
      const newRootKey = newRootKeyArray.join(".");
      if (!_.isObject(base[key])) {
        return [
          [
            newRootKey,
            base[key],
            ...normalizedObjects.map(
              (normalizedObject) => normalizedObject[key]
            ),
          ],
        ];
      }
      return computeMissingKeys(
        base[key],
        normalizedObjects.map((normalizedObject) => normalizedObject[key]),
        newRootKeyArray
      );
    })
  );
};

/**
 * Generate the csv header for the provided languages
 * @param refLanguage
 * @param comparedLanguages
 * @returns {string}
 */
const makeHeader = (refLanguage, comparedLanguages) => [
  "path",
  `${refLanguage} text`,
  ...comparedLanguages.map((language) => `${language} translation`),
];

const frCsv = [makeHeader("english", ["french"])].concat(
  computeMissingKeys(en, [fr])
);

const deCsv = [makeHeader("english", ["german"])].concat(
  computeMissingKeys(en, [de])
);

const frDeCsv = [makeHeader("english", ["french", "german"])].concat(
  computeMissingKeys(en, [fr, de])
);

const stringFrCsv = csvStringify(frCsv);
const stringDeCsv = csvStringify(deCsv);
const stringFrDeCsv = csvStringify(frDeCsv);

fs.mkdirSync(translationOutputFolder, { recursive: true });
fs.writeFileSync(path.join(translationOutputFolder, "fr.csv"), stringFrCsv);
fs.writeFileSync(path.join(translationOutputFolder, "de.csv"), stringDeCsv);
fs.writeFileSync(
  path.join(translationOutputFolder, "fr-de.csv"),
  stringFrDeCsv
);
