const Logo = () => {
  return (
    <div className="text-center max-w-[40rem] h-auto mx-auto select-none">
      <b
        className="
          inline-block
          font-vibur
          font-normal
          text-4xl
          text-[#fee]
          [text-shadow:0_-2rem_6rem_#fee,0_0_0.2rem_#fee,0_0_1em_#ff4444,0_0_0.5em_#ff4444,0_0_0.1em_#ff4444,0_0.5rem_0.2rem_#000]
          
          [&>span:nth-of-type(2)]:animate-[blink-opacity_3s_linear_infinite]
        "
      >
        {/* 1. 修改这里：应用新的动画 */}
        <span className="
            inline-block 
            transform-gpu translate-z-0 
            will-change-[opacity]
            animate-[blink-opacity_2s_linear_infinite]
        ">
          e-
        </span>

        <span>idol</span>
      </b>
    </div>
  );
};

export default Logo;