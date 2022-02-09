jest.mock("electron", () => ({
  app: {
    getPath: (name) => `path(${name})`,
  },
}));
