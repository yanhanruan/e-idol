// src/pages/auth/LoginPage.tsx
import { useState } from 'react';
import { useLocation } from 'wouter';
import { Loader2, Zap, Github, Mail } from 'lucide-react';
import { useTranslations } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import type { AuthUser } from '../../contexts/AuthContext';
import CyberButton from '../../components/ui/CyberButton';
import CyberInput from '../../components/ui/CyberInput';

interface LoginForm {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface ApiResponse {
  code: number;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  } | null;
}

const LoginPage = () => {
  const { t } = useTranslations();
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const [form, setForm] = useState<LoginForm>({ username: '', password: '', rememberMe: false });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const authT = (t.auth || {}) as Record<string, string>;

  const handleChange = (field: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setErrorMsg(authT.errorRequired || '请填写用户名和密码');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });

      const json: ApiResponse = await res.json();

      if (json.code === 200 && json.data) {
        login(json.data.token, json.data.user);
        setLocation('/');
      } else {
        setErrorMsg(json.message || authT.errorInvalid || '用户名或密码错误');
      }
    } catch {
      setErrorMsg(authT.errorNetwork || '网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 sm:px-6 lg:px-8 py-8 font-sans md:min-h-screen md:p-0 lg:p-0 md:items-stretch">

      {/* ===== Left Side: Immersive Brand Visual Zone (Desktop only) ===== */}
      <div className="hidden md:flex md:w-[60%] md:relative md:overflow-hidden md:items-center md:justify-center md:bg-cyber-base">

        {/* Ambient glow — top-left purple */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-purple/20 rounded-full blur-ambient-lg pointer-events-none" />
        {/* Ambient glow — bottom-right aqua */}
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary-aqua/15 rounded-full blur-ambient-lg pointer-events-none" />
        {/* Ambient glow — center soft cyan */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-cyan400/5 rounded-full blur-ambient-md pointer-events-none" />

        {/* Decorative grid pattern via inline SVG */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="brandGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#22d3ee" strokeWidth="0.5" strokeOpacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#brandGrid)" />
          </svg>
        </div>

        {/* Brand Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-16">
          {/* Decorative Orbital Ring */}
          <div className="relative mb-14">
            <div className="w-36 h-36 rounded-full border border-primary-cyan400/20 flex items-center justify-center animate-pulse">
              <div className="w-28 h-28 rounded-full border border-primary-purple/15 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-cyan400/10 to-primary-purple/10 backdrop-blur-sm flex items-center justify-center">
                  <Zap className="w-10 h-10 text-primary-cyan400 drop-shadow-neon-cyan" />
                </div>
              </div>
            </div>
            {/* Orbital accent dot */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary-cyan400 shadow-neon-cyan" />
          </div>

          {/* Brand Name */}
          <h2 className="text-5xl font-black tracking-lg bg-gradient-to-r from-primary-cyan400 via-primary-blue to-primary-purple bg-clip-text text-transparent mb-5 font-mono leading-none">
            E-IDOL
          </h2>

          {/* Tagline */}
          <p className="text-base text-content-muted tracking-md uppercase mb-6">
            Next Generation Virtual Entertainment
          </p>

          {/* Decorative divider */}
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-primary-cyan400/60 to-transparent mb-6" />

          {/* Description */}
          <p className="text-sm text-content-ghost tracking-wide max-w-sm leading-relaxed">
            Enter the future of digital interaction. Your gateway to immersive virtual experiences awaits.
          </p>

          {/* Bottom indicator dots */}
          <div className="flex items-center gap-3 mt-14">
            <div className="w-2 h-2 rounded-full bg-primary-cyan400/60" />
            <div className="w-2 h-2 rounded-full bg-primary-purple/40" />
            <div className="w-2 h-2 rounded-full bg-primary-cyan400/20" />
          </div>
        </div>
      </div>

      {/* ===== Right Side: Pure Login Operation Zone ===== */}
      <div className="w-full max-w-[400px] transition-all duration-300 md:max-w-none md:w-[40%] md:flex md:items-center md:justify-center md:bg-cyber-surface md:relative">

        {/* Vertical divider line between columns */}
        <div className="hidden md:block md:absolute md:left-0 md:top-[15%] md:w-px md:h-[70%] md:bg-gradient-to-b md:from-transparent md:via-primary-cyan400/25 md:to-transparent" />

        {/* Card wrapper — kept for mobile, stripped on desktop for a clean look */}
        <div className="relative bg-cyber-glassPanel backdrop-blur-xl border border-cyber-border rounded-2xl p-8 md:p-8 md:pt-10 shadow-panel md:bg-transparent md:border-none md:shadow-none md:backdrop-blur-none md:rounded-none md:w-full md:max-w-sm">

          {/* Logo Section */}
          <div className="flex flex-col items-center justify-center mb-8 md:mb-6">
            <div className="flex items-center gap-2 mb-4 md:mb-3">
              <div className="relative w-10 h-10 md:w-8 md:h-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary-cyan400/20 rounded-full blur-xl md:blur-md" />
                <Zap className="relative text-primary-cyan400 drop-shadow-neon-cyan w-[22px] h-[22px] md:w-[18px] md:h-[18px]" />
              </div>
              <span className="text-xl md:text-base font-bold tracking-widest bg-gradient-to-r from-primary-cyan400 to-primary-blue bg-clip-text text-transparent uppercase font-mono">
                E-IDOL
              </span>
            </div>

            <h1 className="text-xl md:text-base font-bold text-content-primary tracking-wide mb-1">
              {authT.loginTitle || 'USER LOGIN'}
            </h1>
            {/* 桌面端使用 3xs 增加科技感 */}
            <p className="text-sm md:text-3xs text-content-muted md:tracking-[0.2em] uppercase">
              {authT.loginSubtitle || 'SIGN IN TO YOUR ACCOUNT'}
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-4">
            <CyberInput
              label={authT.username || 'ユーザー名'}
              type="text"
              placeholder={authT.usernamePlaceholder || 'ユーザー名を入力してください'}
              value={form.username}
              onChange={handleChange('username')}
              autoComplete="username"
              disabled={isLoading}
              // 桌面端使用 2xs
              className="text-sm md:text-2xs md:h-9"
            />

            <div className="flex flex-col gap-2 md:gap-1.5">
              <CyberInput
                label={authT.password || 'パスワード'}
                type="password"
                placeholder={authT.passwordPlaceholder || 'パスワードを入力してください'}
                value={form.password}
                onChange={handleChange('password')}
                autoComplete="current-password"
                disabled={isLoading}
                className="text-sm md:text-2xs md:h-9"
              />

              <div className="flex items-center justify-between mt-1 px-1 md:mt-2">
                <label className="flex items-center gap-2 md:gap-1.5 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-4 h-4 md:w-3.5 md:h-3.5 rounded border border-cyber-border bg-black/20 group-hover:border-primary-cyan400/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.rememberMe}
                      onChange={handleChange('rememberMe')}
                      className="absolute opacity-0 cursor-pointer w-full h-full"
                    />
                    {form.rememberMe && <div className="w-2 h-2 md:w-1.5 md:h-1.5 rounded-sm bg-primary-cyan400 shadow-[0_0_8px_rgba(0,255,255,0.8)]" />}
                  </div>
                  {/* 桌面端使用 2xs */}
                  <span className="text-xs md:text-2xs text-content-muted group-hover:text-content-primary transition-colors">
                    {authT.rememberMe || 'Remember me'}
                  </span>
                </label>

                <button
                  type="button"
                  className="text-xs md:text-2xs text-primary-cyan400 hover:text-primary-cyan300 hover:drop-shadow-neon-cyan transition-all duration-200"
                >
                  {authT.forgotPassword || 'Forgot password?'}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="px-3 py-2.5 md:py-2 rounded-lg bg-status-error/10 border border-status-error/30">
                <span className="text-xs md:text-2xs text-status-error font-medium flex items-center gap-2 md:gap-1.5">
                  <div className="w-1.5 h-1.5 md:w-1 md:h-1 rounded-full bg-status-error animate-pulse" />
                  {errorMsg}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-2 md:mt-1">
              <CyberButton className="w-full h-11 md:h-9 text-sm md:text-2xs tracking-widest font-semibold">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin md:w-3.5 md:h-3.5" />
                    {authT.loggingIn || 'AUTHENTICATING...'}
                  </span>
                ) : (
                  authT.loginBtn || 'ログイン'
                )}
              </CyberButton>
            </div>
          </form>

          {/* 第三方登录分隔线 */}
          <div className="relative my-6 md:my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cyber-border/50"></div>
            </div>
            <div className="relative flex justify-center text-xs md:text-3xs">
              <span className="bg-cyber-glassPanel px-4 text-content-muted/80 uppercase tracking-widest md:tracking-[0.15em]">
                Or continue with
              </span>
            </div>
          </div>

          {/* 第三方登录按钮 */}
          <div className="grid grid-cols-2 gap-3 md:gap-2.5 mb-6 md:mb-5">
            <button type="button" className="flex items-center justify-center gap-2 md:gap-1.5 h-10 md:h-8 rounded-lg border border-cyber-border bg-black/20 hover:bg-white/5 hover:border-primary-cyan400/50 text-content-secondary hover:text-content-primary transition-all duration-200 text-xs md:text-3xs font-medium tracking-wider">
              <Github className="w-4 h-4 md:w-3 md:h-3" />
              GITHUB
            </button>
            <button type="button" className="flex items-center justify-center gap-2 md:gap-1.5 h-10 md:h-8 rounded-lg border border-cyber-border bg-black/20 hover:bg-white/5 hover:border-primary-cyan400/50 text-content-secondary hover:text-content-primary transition-all duration-200 text-xs md:text-3xs font-medium tracking-wider">
              <Mail className="w-4 h-4 md:w-3 md:h-3" />
              GOOGLE
            </button>
          </div>

          {/* Footer Section */}
          <div className="text-center pt-2 border-t border-cyber-border/30">
            <p className="text-xs md:text-2xs text-content-muted tracking-wide mt-4 md:mt-3 flex items-center justify-center gap-1">
              {authT.noAccount || "アカウントをお持ちでない方は"}
              <button
                type="button"
                onClick={() => setLocation('/register')}
                className="text-primary-cyan400 hover:text-primary-cyan300 hover:drop-shadow-neon-cyan transition-all duration-200 cursor-pointer font-bold uppercase tracking-wider md:text-2xs"
              >
                {authT.goRegister || '新規登録'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
