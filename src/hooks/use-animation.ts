import { useEffect, useState } from "react";

const linearProgress = (
  startTime: number,
  duration: number,
  currentTime: number
) => Math.min(1, (currentTime - startTime) / duration);

/**
 * Allow to animate a value between initialValue and targetValue.
 * The animation will reset if the animationDependency parameter changes.
 * @param initialValue
 * @param targetValue
 * @param duration
 * @param animationDependency
 */
export const useAnimatedValue = (
  initialValue: number,
  targetValue: number,
  duration: number,
  animationDependency: any
) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const startTime = Date.now();
    setValue(initialValue);

    const handleNextFrame = () => {
      const progress = linearProgress(startTime, duration, Date.now());
      const nextValue = progress * (targetValue - initialValue) + initialValue;
      setValue(nextValue);
      if (progress < 1) {
        requestAnimationFrame(handleNextFrame);
      }
    };
    handleNextFrame();
  }, [initialValue, targetValue, duration, animationDependency]);

  return value;
};
