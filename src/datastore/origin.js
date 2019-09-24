export const sort = a =>
  a.sort((a, b) => {
    a = a[1];
    b = b[1];
    if (a < b) {
      return -1;
    } else if (a === b) {
      return 0;
    } else {
      return 1;
    }
  });

export const empty = () => [];
