import * as Loop from "test/loop";
import * as Arbitrary from "test/arbitrary";
import * as M from "csv";

describe("csv", function() {
  Loop.equal("(line2List . list2Line) a", () => {
    const a = Arbitrary.immutableList(Arbitrary.string);
    return [M.line2List(M.list2Line(a)), a];
  });

  Loop.equal("(fromStr . toStr) a", () => {
    const a = M.arbitrary();
    return [M.fromStr(M.toStr(a)).toJS(), a.toJS()];
  });

  it("leftPadInt", () => {
    expect(M.leftPadInt(0, 12)).toEqual("12");
    expect(M.leftPadInt(1, 12)).toEqual("12");
    expect(M.leftPadInt(2, 12)).toEqual("12");
    expect(M.leftPadInt(3, 12)).toEqual("012");
    expect(M.leftPadInt(4, 12)).toEqual("0012");
  });

  Loop.equal("epochToFormatedUtcDateString", () => {
    // month : 1971 <-> 2071
    const random_year = 1971 + Math.floor(Math.random() * 100);
    // month : 0 <-> 11
    const zero_based_random_month = Math.round(Math.random() * 11);
    const random_month = zero_based_random_month + 1;
    // day : 1 <-> 27
    const random_day = 1 + Math.floor(Math.random() * 26);

    const random_epoch = Date.UTC(
      random_year,
      zero_based_random_month,
      random_day
    );

    return [
      M.epochToFormatedUtcDateString(random_epoch),
      M.leftPadInt(2, random_day) +
        "/" +
        M.leftPadInt(2, random_month) +
        "/" +
        M.leftPadInt(4, random_year)
    ];
  });
});
