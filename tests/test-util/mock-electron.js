jest.mock("@electron/remote", () => ({
  app: {
    getPath: (name) => `path(${name})`,
  },
}));
