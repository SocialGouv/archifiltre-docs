import type { AnyFunction } from "@common/utils/function";
import { identity } from "@common/utils/function";
import type { SimpleObject } from "@common/utils/object";
import expressions from "angular-expressions";

// All the code comes from the docx-templater doc.
// To add custom filters, check the documentation page : https://docxtemplater.readthedocs.io/en/latest/angular_parse.html#angular-parser

interface ParserContext {
  num: number;
  scopeList: SimpleObject[];
}
interface Parser {
  get: (scope: string, context: ParserContext) => unknown;
}

/**
 * This parser allows to add conditions or filters to the template
 */
export function angularParser(tag: string): Parser {
  if (tag === ".") {
    return {
      get: identity,
    };
  }
  const expr: AnyFunction = expressions.compile(tag.replace(/(’|“|”|‘)/g, "'"));
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
