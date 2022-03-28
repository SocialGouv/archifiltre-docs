jest.mock("electron", () => ({
  app: {
    getPath: (name: string) => `path(${name})`,
  },
}));
