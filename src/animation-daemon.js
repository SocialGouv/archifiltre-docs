import { generateRandomString } from "util/random-gen-util";

const genId = () => generateRandomString(40);

const queue = {};

const animationLoop = () => {
  const keys = Object.keys(queue);
  const visible_array = [];

  keys.forEach((animation_id, i) => {
    const animation = queue[animation_id];
    const visible = animation.visible;
    const measure = animation.measure;

    visible_array.push(visible(animation_id));

    if (visible_array[i]) {
      measure(animation_id);
    }
  });

  keys.forEach((animation_id, i) => {
    const animation = queue[animation_id];
    const mutate = animation.mutate;

    if (visible_array[i]) {
      mutate(animation_id);
    }
  });

  requestAnimationFrame(animationLoop);
};

animationLoop();

export function animate(visible, measure, mutate) {
  const animation_id = genId();
  const animation = {
    visible,
    measure,
    mutate
  };
  queue[animation_id] = animation;
  return animation_id;
}

export function clear(animation_id) {
  delete queue[animation_id];
}
