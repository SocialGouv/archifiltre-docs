import path from "path";

import {
    isRootPath,
    isValidFolderPath,
    startPathFromOneLevelAbove,
} from "./file-sys-util";

jest.mock("path", () => {
    const actualPath = jest.requireActual("path");

    let system: "posix" | "win32" | null = null;

    const setOs = (os: "posix" | "win32" | null) => {
        system = os;
    };

    const module = {
        ...actualPath,
        __esModule: true,
        setOs,
    };

    Object.defineProperty(module, "default", {
        get() {
            switch (system) {
                case "posix":
                    return {
                        ...actualPath.posix,
                        setOs,
                    };
                case "win32":
                    return {
                        ...actualPath.win32,
                        setOs,
                    };
                case null:
                    return {
                        ...actualPath,
                        setOs,
                    };
            }
        },
    });

    return module;
});

describe("file-sys-util", () => {
    describe("isRootPath", () => {
        describe("onWindows", () => {
            beforeEach(() => {
                // @ts-ignore
                path.setOs("win32");
            });
            afterEach(() => {
                // @ts-ignore
                path.setOs(null);
            });
            it("should detect a drive as the rootPath", () => {
                expect(isRootPath("C:\\")).toBe(true);
            });

            it("shouldn't detect a folder as the rootPath", () => {
                expect(isRootPath("C:\\folder")).toBe(false);
            });
        });

        describe("onPosix", () => {
            beforeEach(() => {
                // @ts-ignore
                path.setOs("posix");
            });
            afterEach(() => {
                // @ts-ignore
                path.setOs(null);
            });
            it("should detect the root folder as the rootPath", () => {
                expect(isRootPath("/")).toBe(true);
            });

            it("shouldn't detect a folder as the rootPath", () => {
                expect(isRootPath("/folder")).toBe(false);
            });
        });
    });
    describe("isValidFolderPath", () => {
        it("should return false with a path that doesn't exist", () => {
            expect(isValidFolderPath("/invalid-path")).toBe(false);
        });
        it("should return true with a path that exists", () => {
            expect(isValidFolderPath("/")).toBe(true);
        });
    });

    describe("startPathFromOneLevelAbove", () => {
        describe("when path starts with a /", () => {
            it("should start the path from the level above", () => {
                const basePath = "/root/folder/file";
                expect(startPathFromOneLevelAbove(basePath)).toEqual(
                    "folder/file"
                );
            });
        });

        describe("when path does not start with a /", () => {
            it("should start the path from the level above", () => {
                const basePath = "root/folder/file";
                expect(startPathFromOneLevelAbove(basePath)).toEqual(
                    "folder/file"
                );
            });
        });
    });
});
