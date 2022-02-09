const en = require("../../src/renderer/translations/en.json");
const { at } = require("lodash");

class I18nextMock {
  t(key) {
    return at(en.translation, key)[0] ?? key;
  }
  changeLanguage() {
    return Promise.resolve(this.t);
  }

  use() {
    return this;
  }

  init() {}
}
jest.mock("i18next", () => new I18nextMock());
