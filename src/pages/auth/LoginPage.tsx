// src/pages/auth/LoginPage.tsx
import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Loader2, Zap } from 'lucide-react';
import { useTranslations } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import type { AuthUser } from '../../contexts/AuthContext';
import CyberButton from '../../components/ui/CyberButton';
import CyberInput from '../../components/ui/CyberInput';

interface LoginForm {
  username: string;
  password: string;
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

  const [form, setForm] = useState<LoginForm>({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const authT = (t.auth || {}) as Record<string, string>;

  const handleChange = (field: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
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
        body: JSON.stringify(form),
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
    <div className="relative min-h-screen bg-cyber-base flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute -top-1/4 -left-10 w-96 h-96 md:scale-125 bg-primary-cyan400/10 rounded-full blur-ambient-lg pointer-events-none" />
      <div className="absolute -bottom-1/4 -right-10 w-96 h-96 md:scale-125 bg-primary-purple/10 rounded-full blur-ambient-lg pointer-events-none" />

      {/* Back Button */}
      <button
        onClick={() => setLocation('/')}
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-content-muted hover:text-primary-cyan400 transition-colors duration-200 group z-20"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="text-2xs tracking-wider uppercase font-mono font-bold">BACK TO HOME</span>
      </button>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-sm md:w-88 transition-all duration-300">
        <div className="absolute -inset-px bg-gradient-to-br from-primary-cyan400/20 via-transparent to-primary-purple/20 rounded-2xl blur-sm" />

        {/* Auth Panel - rounded-2xl for primary container */}
        <div className="relative bg-cyber-glassPanel backdrop-blur-xl border border-cyber-border rounded-2xl p-6 md:p-8 shadow-panel">
          
          {/* Logo Section */}
          <div className="flex items-center justify-center gap-2 mb-6 md:mb-2">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary-cyan400/30 rounded-full blur-glow" />
              <Zap size={18} className="relative text-primary-cyan400 drop-shadow-neon-cyan" />
            </div>
            <span className="text-sm font-bold tracking-widest bg-gradient-to-r from-primary-cyan400 to-primary-blue bg-clip-text text-transparent uppercase font-mono">
              E-IDOL
            </span>
          </div>

          {/* Title Section */}
          <div className="text-center mb-8 md:mb-1">
            <h1 className="text-xl font-bold text-content-primary tracking-md mb-1 transition-all">
              {authT.loginTitle || 'USER LOGIN'}
            </h1>
            <p className="text-2xs text-content-muted tracking-widest uppercase leading-none">
              {authT.loginSubtitle || 'SIGN IN TO YOUR ACCOUNT'}
            </p>
            <div className="mt-4 mx-auto w-12 h-px bg-gradient-to-r from-transparent via-primary-cyan400/60 to-transparent" />
          </div>

          {/* Form Section - Regular Spacing gap-5 */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5">
            <CyberInput
              label={authT.username || 'USERNAME'}
              type="text"
              placeholder={authT.usernamePlaceholder || 'Enter username'}
              value={form.username}
              onChange={handleChange('username')}
              autoComplete="username"
              disabled={isLoading}
              className="text-xs"
            />

            <CyberInput
              label={authT.password || 'PASSWORD'}
              type="password"
              placeholder={authT.passwordPlaceholder || 'Enter password'}
              value={form.password}
              onChange={handleChange('password')}
              autoComplete="current-password"
              disabled={isLoading}
              className="text-xs"
            />

            {errorMsg && (
              <div className="px-3 py-2 rounded-lg bg-status-error/10 border border-status-error/30 mt-1">
                <span className="text-2xs text-status-error font-medium leading-relaxed">
                  {errorMsg}
                </span>
              </div>
            )}

            {/* Submit Button - rounded-full for core interaction */}
            <div className="mt-2">
              <CyberButton
                className="w-full"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    {authT.loggingIn || 'LOGGING IN...'}
                  </span>
                ) : (
                  authT.loginBtn || 'SIGN IN'
                )}
              </CyberButton>
            </div>
          </form>

          {/* Footer Section */}
          <p className="mt-8 text-center text-2xs text-content-muted tracking-wide">
            {authT.noAccount || "DON'T HAVE AN ACCOUNT?"}
            <button
              type="button"
              onClick={() => setLocation('/register')}
              className="ml-1.5 text-primary-cyan400 hover:text-primary-cyan300 hover:drop-shadow-neon-cyan transition-all duration-200 cursor-pointer font-bold uppercase"
            >
              {authT.goRegister || 'REGISTER NOW'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;