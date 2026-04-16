"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

type RevealOnScrollProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function RevealOnScroll({ children, className, delay = 0 }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    if (window.matchMedia("(max-width: 767px)").matches) {
      const mobileTimer = window.setTimeout(() => {
        setVisible(true);
      }, 0);
      return () => window.clearTimeout(mobileTimer);
    }

    // Fallback so content never stays hidden if the observer fails to fire.
    const fallbackTimer = window.setTimeout(() => {
      setVisible(true);
    }, 250 + delay);

    if (typeof IntersectionObserver === "undefined") {
      return () => window.clearTimeout(fallbackTimer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          window.clearTimeout(fallbackTimer);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(element);
    return () => {
      window.clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={clsx("reveal-block", visible && "reveal-visible", className)}
    >
      {children}
    </div>
  );
}
