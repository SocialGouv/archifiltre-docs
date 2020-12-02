module.exports = {
  electronPackagerConfig: {
    asar: true,
    osxNotarize: {
      appleId: process.env["APPLE_ID"],
      appleIdPassword: process.env["APPLE_ID_PASSWORD"],
    },
    osxSign: true,
  },
};
