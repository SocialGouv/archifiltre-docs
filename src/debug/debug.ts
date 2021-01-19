type Timer = {
  start: () => void;
  stop: () => void;
  getTime: () => number;
};

export const createTimer = (): Timer => {
  let currentTimerangeStart = -1;
  let time = 0;
  return {
    start: () => {
      currentTimerangeStart = Date.now();
    },
    stop: () => {
      time += Date.now() - currentTimerangeStart;
    },
    getTime: () => time,
  };
};
