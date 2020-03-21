import * as M from "util/record-util";

describe("record-util", () => {
  const testEquality = (a, b) => {
    expect(a.toObject()).toEqual(b.toObject());
    expect(a.constructor.toJs(a)).toEqual(b.constructor.toJs(b));
    const objectRecord = a.constructor.fromJs(a.constructor.toJs(a)).toObject();

    expect(objectRecord).toEqual(
      b.constructor.fromJs(b.constructor.toJs(b)).toObject()
    );
  };

  it("compose : a . empty === empty . a", () => {
    const a = M.createFactory(
      { a: 1, b: 2 },
      {
        toJs: (a) => {
          a.b *= 2;
          return a;
        },
        fromJs: (a) => {
          a.b *= 2;
          return a;
        },
      }
    )({ a: 10, b: 20 });
    const empty = M.emptyFactory();

    testEquality(M.compose(a, empty), a);
    testEquality(M.compose(empty, a), a);
  });

  it("compose : a . (b . c) === (a . b) . c", () => {
    const a = M.createFactory(
      { a: 1, b: 2 },
      {
        toJs: (a) => {
          a.b *= 2;
          return a;
        },
        fromJs: (a) => {
          a.b *= 2;
          return a;
        },
      }
    )({ a: 10, b: 20 });
    const b = M.createFactory(
      { o: "tss", em: 79, a: 9 },
      { toJs: (a) => a, fromJs: (a) => a }
    )({ o: "tsstss", em: 0, a: 1 });
    const c = M.createFactory(
      { t: 0 },
      {
        toJs: () => {
          return { t: "sautiensrautiena" };
        },
        fromJs: (a) => a,
      }
    )({ t: 3 });

    testEquality(M.compose(a, M.compose(b, c)), M.compose(M.compose(a, b), c));
  });

  it("simple test", () => {
    const a = M.createFactory(
      { a: 1, b: 2 },
      {
        toJs: (a) => {
          a.b *= 2;
          return a;
        },
        fromJs: (a) => {
          a.b *= 2;
          return a;
        },
      }
    );

    const b = M.createFactory(
      { a: 10, c: 20, d: 30 },
      {
        toJs: (a) => {
          a.d *= 2;
          return a;
        },
        fromJs: (a) => {
          a.d *= 2;
          return a;
        },
      }
    );
    const c = M.compose(b(), a().set("a", 12));

    expect(c.toObject()).toEqual({
      a: 10,
      b: 2,
      c: 20,
      d: 30,
    });

    expect(c.constructor.toJs(c)).toEqual({
      a: 10,
      b: 4,
      c: 20,
      d: 60,
    });

    expect(
      c.constructor
        .fromJs({
          a: 10,
          b: 2,
          c: 20,
          d: 30,
        })
        .toObject()
    ).toEqual({
      a: 10,
      b: 4,
      c: 20,
      d: 60,
    });

    expect(
      c.constructor
        .fromJs({
          b: 2,
          d: 40,
        })
        .toObject()
    ).toEqual({
      a: 10,
      b: 4,
      c: 20,
      d: 80,
    });
  });
});
