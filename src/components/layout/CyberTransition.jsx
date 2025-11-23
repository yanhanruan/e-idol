import React from 'react';
import { useTransition } from '../../contexts/TransitionContext';

const CyberTransition = () => {
  const { isAnimating } = useTransition();

  if (!isAnimating) return null;

  return (
    /* fixed inset-0: 铺满全屏
      z-[9999]: 保证在最顶层
      bg-[#03030a]: 使用深色背景 (你可以改成 bg-black)
      pointer-events-auto: 动画期间禁止鼠标点击下层元素
    */
    <div 
      className="fixed inset-0 z-[9999] bg-[#03030a] pointer-events-auto animate-flash-black"
    />
  );
};

export default CyberTransition;