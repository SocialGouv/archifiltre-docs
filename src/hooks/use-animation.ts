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
    animationDependency: unknown
): number => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        const startTime = Date.now();
        setValue(initialValue);
        let animationFrame = Infinity;

        const handleNextFrame = () => {
            const progress = linearProgress(startTime, duration, Date.now());
            const nextValue =
                progress * (targetValue - initialValue) + initialValue;
            setValue(nextValue);
            if (progress < 1) {
                animationFrame = requestAnimationFrame(handleNextFrame);
            }
        };
        handleNextFrame();

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [initialValue, targetValue, duration, animationDependency]);

    return value;
};
