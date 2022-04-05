import { at } from "lodash";

import en from "../../src/renderer/translations/en.json";

class I18nextMock {
  t(key: string) {
    return at(en.translation, key)[0] ?? key;
  }

  async changeLanguage() {
    return Promise.resolve(this.t.bind(this));
  }

  use() {
    return this;
  }

  init() {
    return;
  }
}
jest.mock("i18next", () => new I18nextMock());
