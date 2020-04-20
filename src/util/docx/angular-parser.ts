import expressions from "angular-expressions";
import { identity } from "util/function/function-util";

// All the code comes from the docx-templater doc.
// To add custom filters, check the documentation page : https://docxtemplater.readthedocs.io/en/latest/angular_parse.html#angular-parser

/**
 * This parser allows to add conditions or filters to the template
 * @param tag
 */
export function angularParser(tag) {
  if (tag === ".") {
    return {
      get: identity,
    };
  }
  const expr = expressions.compile(tag.replace(/(’|“|”|‘)/g, "'"));
  return {
    get: (scope, context) => {
      let obj = {};
      const scopeList = context.scopeList;
      const num = context.num;
      for (let i = 0, len = num + 1; i < len; i++) {
        obj = { ...obj, ...scopeList[i] };
      }
      return expr(scope, obj);
    },
  };
}
