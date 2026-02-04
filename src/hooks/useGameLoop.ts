import { useEffect, useRef } from 'react';

export function useGameLoop(
    callback: (deltaTime: number) => void,
    isRunning: boolean
) {
    const requestRef = useRef<number | null>(null);
    const previousTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isRunning) {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            previousTimeRef.current = undefined;
            return;
        }

        const animate = (time: number) => {
            if (previousTimeRef.current !== null) {
                const deltaTime = time - previousTimeRef.current;
                callback(deltaTime);
            }
            previousTimeRef.current = time;
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current !== null) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [isRunning, callback]);
}
