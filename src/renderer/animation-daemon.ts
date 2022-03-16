import { generateRandomString } from "@common/utils/random-gen";
import noop from "lodash/noop";

type Visible = (animationId: string) => boolean;
type Measure = (animationId: string) => void;
type Mutate = (animationId: string) => void;

interface Animation {
  visible: Visible;
  measure: Measure;
  mutate: Mutate;
}

type AnimationQueue = Record<string, Animation>;

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

export const animate = (
  visible: Visible,
  measure: Measure,
  mutate: Mutate
): string => {
  const animationId = genId();
  queue[animationId] = {
    measure,
    mutate,
    visible,
  };
  return animationId;
};

export const clear = (animationId: string): void => {
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete queue[animationId];
};

/**
 * Animate a SVG dom element in horizontalPosition, horizontalGrowth and opacity
 */
export const animateSvgDomElement = async (
  domElement: SVGGElement,
  inv: boolean,
  targetX: number,
  targetDx: number,
  x: number,
  dx: number,
  animationDuration: number
): Promise<void> =>
  new Promise((resolve) => {
    const getTime = () => Date.now();
    const initTime = getTime();

    const getAnimationProgress = () =>
      Math.min(1, (getTime() - initTime) / animationDuration);

    const init = [0, 1, 1];
    const horizontalMove = targetX - x;
    const widthGrowth = targetDx / dx;
    const normalizedHorizontalMove =
      targetX === 0 ? horizontalMove * widthGrowth : horizontalMove;

    const target = [normalizedHorizontalMove, widthGrowth, 0];

    const vector = inv
      ? target.map(
          (val, i) => (progress: number) => val + (init[i] - val) * progress
        )
      : init.map(
          (val, i) => (progress: number) => val + (target[i] - val) * progress
        );

    const visible = () => true;
    const measure = noop;
    const mutate = (animationId: string) => {
      const progress = getAnimationProgress();
      const translateX = vector[0](progress);
      const scaleX = vector[1](progress);
      const opacity = vector[2](progress);

      domElement.style.willChange = "transform, opacity";
      domElement.style.transform = `translateX(${translateX}px) scaleX(${scaleX})`;
      domElement.style.opacity = `${opacity}`;

      if (progress >= 1) {
        domElement.style.willChange = "unset";
        clear(animationId);
        resolve();
      }
    };

    animate(visible, measure, mutate);
  });
