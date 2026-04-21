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
    <div className="relative min-h-screen bg-[#050510] flex items-center justify-center px-4 overflow-hidden">
      {/* 背景光晕装饰 */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[140px] pointer-events-none" />

      {/* 返回按钮 */}
      <button
        onClick={() => setLocation('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors duration-200 group z-20"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="text-xs tracking-widest uppercase">返回首页</span>
      </button>

      {/* 玻璃态卡片 */}
      <div className="relative z-10 w-full max-w-md">
        {/* 卡片辉光边框 */}
        <div className="absolute -inset-[1px] bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-600/20 rounded-2xl blur-[3px]" />

        <div className="relative bg-[#0a0a1a]/90 backdrop-blur-xl border border-cyber-border rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          {/* Logo 区域 */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-md" />
              <Zap size={22} className="relative text-cyan-400" />
            </div>
            <span className="text-base font-bold tracking-[0.3em] bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent uppercase">
              E-IDOL
            </span>
          </div>

          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-cyan-50 tracking-wide mb-1">
              {authT.loginTitle || '用户登录'}
            </h1>
            <p className="text-xs text-slate-500 tracking-widest uppercase">
              {authT.loginSubtitle || 'SIGN IN TO YOUR ACCOUNT'}
            </p>
            <div className="mt-3 mx-auto w-16 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <CyberInput
              label={authT.username || '用户名'}
              type="text"
              placeholder={authT.usernamePlaceholder || '请输入用户名'}
              value={form.username}
              onChange={handleChange('username')}
              autoComplete="username"
              disabled={isLoading}
            />

            <CyberInput
              label={authT.password || '密码'}
              type="password"
              placeholder={authT.passwordPlaceholder || '请输入密码'}
              value={form.password}
              onChange={handleChange('password')}
              autoComplete="current-password"
              disabled={isLoading}
            />

            {/* 错误提示 */}
            {errorMsg && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <span className="text-xs text-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.5)]">
                  {errorMsg}
                </span>
              </div>
            )}

            {/* 登录按钮 — 直接使用 CyberButton type="submit"，不嵌套原生 button */}
            <CyberButton
              type="submit"
              disabled={isLoading}
              className="w-full mt-2"
              innerClassName="py-3 text-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  {authT.loggingIn || '登录中...'}
                </span>
              ) : (
                authT.loginBtn || '登 录'
              )}
            </CyberButton>
          </form>

          {/* 跳转注册 */}
          <p className="mt-6 text-center text-xs text-slate-500">
            {authT.noAccount || '还没有账号？'}
            <button
              type="button"
              onClick={() => setLocation('/register')}
              className="ml-1 text-cyan-400 hover:text-cyan-300 hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.6)] transition-all duration-200 cursor-pointer"
            >
              {authT.goRegister || '立即注册'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
