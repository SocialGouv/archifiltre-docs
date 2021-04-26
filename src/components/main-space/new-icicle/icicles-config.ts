export const horizontalConfig = {
  getRectangleWidth: ({ y0, y1 }): number => y1 - y0 - 1,
  getRectangleHeight: ({ x0, x1 }): number =>
    x1 - x0 - Math.min(1, (x1 - x0) / 2),
  getRectangleX: ({ y0 }) => y0,
  getRectangleY: ({ x0 }) => x0,
  getViewboxWidth: ({ rootElementHeight, treeDepth, viewboxWidth }) =>
    (rootElementHeight * viewboxWidth) / treeDepth,
  getViewboxHeight: ({ viewboxHeight }) => viewboxHeight,
};

export const verticalConfig = {
  getRectangleWidth: ({ x0, x1 }): number =>
    x1 - x0 - Math.min(1, (x1 - x0) / 2),
  getRectangleHeight: ({ y0, y1 }): number => y1 - y0 - 1,
  getRectangleX: ({ x0 }) => x0,
  getRectangleY: ({ y0 }) => y0,
  getViewboxWidth: ({ viewboxWidth }) => viewboxWidth,
  getViewboxHeight: ({ rootElementHeight, treeDepth, viewboxHeight }) =>
    (rootElementHeight * viewboxHeight) / treeDepth,
};
