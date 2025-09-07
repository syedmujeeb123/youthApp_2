import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = (componentName) => {
  const startTime = useRef(Date.now());
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    const endTime = Date.now();
    const renderTime = endTime - startTime.current;

    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${componentName} Performance:`, {
        renderCount: renderCount.current,
        renderTime: `${renderTime}ms`,
        timestamp: new Date().toISOString()
      });
    }

    // Reset start time for next render
    startTime.current = Date.now();
  });

  return {
    renderCount: renderCount.current
  };
};

export const useMemoryUsage = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const memory = performance.memory;
      console.log('🧠 Memory Usage:', {
        used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`
      });
    }
  }, []);
};
