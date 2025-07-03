import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  duration?: number; // in ms
}

const AnimatedCounter = ({ end, suffix = '', duration = 1200 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver;
    let frame: number;
    let startTimestamp = 0;

    function animate(ts: number) {
      if (startTimestamp === 0) startTimestamp = ts;
      const progress = Math.min((ts - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    }

    if (ref.current && !hasAnimated) {
      observer = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(animate);
            setHasAnimated(true);
            observer.disconnect();
          }
        },
        { threshold: 0.01 }
      );
      observer.observe(ref.current);
    }
    return () => {
      if (observer && observer.disconnect) observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [end, duration, hasAnimated]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

export default AnimatedCounter;