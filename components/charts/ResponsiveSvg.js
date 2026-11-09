'use client';
import { useEffect, useId, useRef, useState } from 'react';

export default function ResponsiveSvg({ title, description, height = 260, children, testId }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(600);
  const id = useId();
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const resize = () => setWidth(Math.max(180, element.getBoundingClientRect().width));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="w-full min-w-0" data-chart={testId}>
    <svg role="img" aria-labelledby={`${id}-title ${id}-desc`} viewBox={`0 0 ${width} ${height}`} style={{ height }} className="block w-full">
      <title id={`${id}-title`}>{title}</title><desc id={`${id}-desc`}>{description}</desc>
      {children({ width, height, id })}
    </svg>
  </div>;
}
