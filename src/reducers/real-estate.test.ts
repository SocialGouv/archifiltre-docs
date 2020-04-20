import * as RealEstate from "reducers/real-estate";
import * as ObjectUtil from "util/object-util";

interface ApiProps {
  state1: any;
  state2: any;
  ho: any;
  state: any;
}

describe("real-estate", () => {
  const state1 = RealEstate.create({
    property_name: "state1",
    initialState: () => 0,
    reader: {
      isZero: () => (s) => s === 0,
      print: (blabla) => (s) => blabla + " : " + s,
    },
    writer: {
      add: (a) => (s) => s + a,
      sub: (a) => (s) => s - a,
    },
  });

  const state2 = RealEstate.create({
    property_name: "state2",
    initialState: () => {
      return { baba: "baba" };
    },
    reader: {
      read: () => (s) => s.baba,
    },
    writer: {
      write: (a) => (s) => {
        s = { ...s };
        s.baba = a;
        return s;
      },
    },
  });

  const higherOrder = RealEstate.createHigherOrder({
    initialState: (s) => {
      return { origin: s, current: s };
    },
    get: (s) => s.current,
    set: (a, s) => ObjectUtil.compose({ current: a }, s),
    reader: {
      getCurrent: () => (s) => s.current,
    },
    writer: {
      goBackToOrigin: () => (s) => {
        return { origin: s.origin, current: s.origin };
      },
    },
  });

  it("basic test", () => {
    const realEstate = RealEstate.compile(RealEstate.compose(state2, state1));

    let store = realEstate.initialState();
    const api = realEstate.api as ApiProps;

    expect(store).toEqual({
      state1: 0,
      state2: {
        baba: "baba",
      },
    });

    store = api.state2.write("ahah")(store);
    store = api.state1.add(10)(store);
    store = api.state1.sub(6)(store);

    expect(store).toEqual({
      state1: 4,
      state2: {
        baba: "ahah",
      },
    });

    expect(api.state2.read()(store)).toBe("ahah");
    expect(api.state1.isZero()(store)).toBe(false);
    expect(api.state1.print("titre")(store)).toBe("titre : 4");
  });

  it("higher order test", () => {
    const realEstate = RealEstate.compile(
      higherOrder("ho", RealEstate.compose(state2, state1))
    );

    let store = realEstate.initialState();
    const api = realEstate.api as ApiProps;

    expect(store).toEqual({
      ho: {
        origin: {
          state1: 0,
          state2: {
            baba: "baba",
          },
        },
        current: {
          state1: 0,
          state2: {
            baba: "baba",
          },
        },
      },
    });

    store = api.state2.write("ahah")(store);
    store = api.state1.add(10)(store);
    store = api.state1.sub(6)(store);

    expect(store).toEqual({
      ho: {
        origin: {
          state1: 0,
          state2: {
            baba: "baba",
          },
        },
        current: {
          state1: 4,
          state2: {
            baba: "ahah",
          },
        },
      },
    });

    expect(api.state2.read()(store)).toBe("ahah");
    expect(api.state1.isZero()(store)).toBe(false);
    expect(api.state1.print("titre")(store)).toBe("titre : 4");

    expect(api.ho.getCurrent()(store)).toEqual({
      state1: 4,
      state2: {
        baba: "ahah",
      },
    });

    store = api.ho.goBackToOrigin()(store);

    expect(api.ho.getCurrent()(store)).toEqual({
      state1: 0,
      state2: {
        baba: "baba",
      },
    });

    expect(store).toEqual({
      ho: {
        origin: {
          state1: 0,
          state2: {
            baba: "baba",
          },
        },
        current: {
          state1: 0,
          state2: {
            baba: "baba",
          },
        },
      },
    });
  });

  it("cache test", () => {
    let sideeffect = 0;
    const state = RealEstate.create({
      property_name: "state",
      initialState: () => 0,
      reader: {
        isZero: () => (s) => {
          sideeffect++;
          return s === 0;
        },
      },
      writer: {
        add: (a) => (s) => s + a,
      },
    });

    const realEstate = RealEstate.compile(state);

    let store = realEstate.initialState();
    const api = realEstate.api as ApiProps;

    expect(store).toEqual({ state: 0 });

    expect(sideeffect).toBe(0);
    api.state.isZero()(store);
    expect(sideeffect).toBe(1);
    api.state.isZero()(store);
    expect(sideeffect).toBe(1);

    store = api.state.add(10)(store);
    api.state.isZero()(store);
    expect(sideeffect).toBe(2);
    api.state.isZero()(store);
    expect(sideeffect).toBe(2);
  });
});
