import { generateRandomString } from "util/random-gen-util";

type Visible = (animationId: string) => boolean;
type Measure = (animationId: string) => void;
type Mutate = (animationId: string) => void;

interface Animation {
  visible: Visible;
  measure: Measure;
  mutate: Mutate;
}

interface AnimationQueue {
  [id: string]: Animation;
}

const genId = () => generateRandomString(40);

const queue: AnimationQueue = {};

const animationLoop = () => {
  const keys = Object.keys(queue);
  const visibleArray = [] as boolean[];

  keys.forEach((animationId, i) => {
    const animation = queue[animationId];
    const visible = animation.visible;
    const measure = animation.measure;

    visibleArray.push(visible(animationId));

    if (visibleArray[i]) {
      measure(animationId);
    }
  });

  keys.forEach((animationId, i) => {
    const animation = queue[animationId];
    const mutate = animation.mutate;

    if (visibleArray[i]) {
      mutate(animationId);
    }
  });

  requestAnimationFrame(animationLoop);
};

animationLoop();

export function animate(visible: Visible, measure: Measure, mutate: Mutate) {
  const animationId = genId();
  queue[animationId] = {
    visible,
    measure,
    mutate,
  };
  return animationId;
}

export function clear(animationId) {
  delete queue[animationId];
}
