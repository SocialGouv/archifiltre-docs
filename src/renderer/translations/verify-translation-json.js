const fr = require("./fr.json");
const en = require("./en.json");
const de = require("./de.json");

const flattenJSON = (obj = {}, res = {}, extraKey = "") => {
  for (const key in obj) {
    if (typeof obj[key] !== "object") {
      res[extraKey + key] = obj[key];
    } else {
      flattenJSON(obj[key], res, `${extraKey}${key}.`);
    }
  }
  return res;
};

const flattenFr = flattenJSON(fr);
const flattenEn = flattenJSON(en);
const flattenDe = flattenJSON(de);

function verify(obj) {
  for (const key in obj) {
    if (!flattenEn[`${key}`]) {
      console.log(`Missing key ${key} in en.json`);
    }
    if (!flattenDe[`${key}`]) {
      console.log(`Missing key ${key} in de.json`);
    }
  }
}

verify(flattenFr);
