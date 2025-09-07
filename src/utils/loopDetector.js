// Loop detection utility
let renderCount = 0;
let lastRenderTime = 0;

export const detectInfiniteLoop = (componentName) => {
  const currentTime = Date.now();
  renderCount++;
  
  // If renders are happening too frequently (less than 100ms apart), it might be a loop
  if (currentTime - lastRenderTime < 100) {
    console.warn(`🚨 Potential infinite loop detected in ${componentName}! Render count: ${renderCount}`);
    
    // If we've had more than 50 renders in quick succession, it's definitely a loop
    if (renderCount > 50) {
      console.error(`❌ INFINITE LOOP CONFIRMED in ${componentName}! Stopping execution.`);
      throw new Error(`Infinite loop detected in ${componentName}`);
    }
  } else {
    // Reset counter if enough time has passed
    renderCount = 0;
  }
  
  lastRenderTime = currentTime;
};

export const resetLoopDetector = () => {
  renderCount = 0;
  lastRenderTime = 0;
};

