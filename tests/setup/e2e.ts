const setupE2E = (): void => {
  console.log("E2E Global setup");
  process.env.NODE_ENV = "test";
};

export default setupE2E;
