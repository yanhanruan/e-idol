import { useTransition } from '../../contexts/TransitionContext';

const CyberTransition = () => {
  const { isAnimating } = useTransition();

  if (!isAnimating) return null;

  return <div className="fixed inset-0 z-[9999] bg-[#03030a] pointer-events-auto animate-flash-black" />;
};

export default CyberTransition;
