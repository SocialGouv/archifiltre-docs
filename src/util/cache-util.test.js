import * as M from "util/cache-util";

describe("cache", function() {
  it("basic test to improve", function() {
    let a = 0;
    const f = b => {
      a++;
      return b + 1;
    };
    const cacheF = M.make(f);

    expect(a).toBe(0);
    expect(cacheF(1)).toBe(2);
    expect(a).toBe(1);
    expect(cacheF(2)).toBe(3);
    expect(a).toBe(2);
    expect(cacheF(1)).toBe(2);
    expect(a).toBe(3);
  });
});
