module.exports = (x) =>
  // eslint-disable-next-line no-undef
  __non_webpack_require__(
    process.send
      ? `./${x}`
      : `${require("electron").remote.app.getAppPath()}/${x}`
  );
