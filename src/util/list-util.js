export const indexSort = (getter, list) =>
  list
    .map((a, i) => [getter(a), i])
    .sortBy((a) => a[0])
    .map((a) => a[1]);

export const median = (l) => {
  if (l.size % 2 === 1) {
    return l.get(Math.floor(l.size / 2));
  } else {
    const i = l.size / 2;
    return (l.get(i - 1) + l.get(i)) / 2;
  }
};

export const average = (l) => {
  const sum = l.reduce((acc, val) => acc + val, 0);
  return sum / l.size;
};
