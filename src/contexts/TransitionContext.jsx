import React, { createContext, useContext, useState, useCallback } from 'react';

const TransitionContext = createContext();

export const TransitionProvider = ({ children }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const startTransition = useCallback((stateUpdateCallback) => {
    // 防止重复触发
    if (isAnimating) return;

    setIsAnimating(true);

    // 1. 数据切换点：250ms
    // CSS 动画在 20% (120ms) 到 60% (360ms) 之间是纯黑的。
    // 我们选在 250ms 这个安全中间点执行数据更新/路由跳转。
    setTimeout(() => {
        if (stateUpdateCallback) stateUpdateCallback();
    }, 250);

    // 2. 动画结束清理点：650ms
    // CSS 动画总长 600ms。
    // 设置 650ms 卸载组件，给一点微小的缓冲，防止黑色层消失得太突兀。
    setTimeout(() => {
        setIsAnimating(false);
    }, 650); 
  }, [isAnimating]);

  return (
    <TransitionContext.Provider value={{ isAnimating, startTransition }}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = () => useContext(TransitionContext);