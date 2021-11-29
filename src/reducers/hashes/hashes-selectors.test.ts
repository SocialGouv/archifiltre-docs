import { createEmptyStore } from "../store-test-utils";
import { initialState } from "./hashes-reducer";
import { getHashesFromStore } from "./hashes-selectors";

describe("hashes-selectors", () => {
    describe("getHashesFromStore", () => {
        it("should return the current store", () => {
            const fileId = "base-id";
            const hash = "hash";
            const emptyStore = createEmptyStore();
            const hashesMap = {
                [fileId]: hash,
            };
            const testStore = {
                ...emptyStore,
                hashes: {
                    ...initialState,
                    hashes: hashesMap,
                },
            };
            expect(getHashesFromStore(testStore)).toEqual(hashesMap);
        });
    });
});
