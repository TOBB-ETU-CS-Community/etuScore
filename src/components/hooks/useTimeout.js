import { useEffect, useRef } from "react";

const useTimeout = (callback, delay) => {
    const timeoutRef = useRef(null);
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => savedCallback.current();

        if (typeof delay === 'number') {
            timeoutRef.current = window.setTimeout(tick, delay);
            return () => window.clearTimeout(timeoutRef.current);
        }
    }, [delay]);

    return timeoutRef;
};
export default useTimeout;
