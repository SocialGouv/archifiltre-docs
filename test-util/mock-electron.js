jest.mock("electron", () => ({
  remote: {
    app: {
      getPath: () => "",
    },
  },
}));
