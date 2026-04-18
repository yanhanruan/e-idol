import Logo from '../Logo';

const Footer = () => (
  <footer
    className="mt-16 py-12 relative overflow-hidden"
    style={{
      background: 'linear-gradient(180deg, rgba(5, 8, 20, 0) 0%, rgba(10, 13, 30, 0.8) 20%, rgba(10, 13, 30, 0.95) 100%)',
      borderTop: '1px solid rgba(0, 255, 255, 0.2)',
      boxShadow: '0 -10px 50px rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(10px)',
    }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <div className="mb-4 flex items-center justify-center">
        <Logo />
      </div>
      <p
        className="text-sm font-medium"
        style={{
          fontFamily: "'Roboto Mono', monospace",
          color: '#00ffff',
          textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
          opacity: 0.8,
        }}
      >
        © 2026 e-Idol. All rights reserved. yOHO ✨
      </p>
    </div>
  </footer>
);

export default Footer;
