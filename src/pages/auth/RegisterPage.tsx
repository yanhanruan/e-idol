// src/pages/auth/RegisterPage.tsx
import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, ChevronDown, Loader2, Zap } from 'lucide-react';
import { useTranslations } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import type { AuthUser } from '../../contexts/AuthContext';
import CyberButton from '../../components/ui/CyberButton';
import CyberInput from '../../components/ui/CyberInput';

type UserRole = 'host' | 'client';

interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

interface FormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
}

interface ApiResponse {
  code: number;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  } | null;
}

// 表单专用角色选择器 — 撑满宽度，不复用 Header 版 CyberSelect
const RoleSelector = ({
  value,
  onChange,
  options,
}: {
  value: UserRole;
  onChange: (v: UserRole) => void;
  options: { value: UserRole; label: string }[];
}) => {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <div className="relative">
      {/* 辉光边框 */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/40 via-blue-500/30 to-purple-600/40 rounded-lg opacity-50 blur-[2px] pointer-events-none" />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative w-full flex items-center justify-between px-4 py-3 rounded-lg bg-cyber-base border border-cyber-border text-sm text-cyan-50 focus:outline-none transition-all duration-200"
      >
        <span>{current?.label}</span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 下拉列表 */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg overflow-hidden border border-cyber-border bg-[#0a0a1a] shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
          {options.map((opt, i) => (
            <div key={opt.value}>
              {i > 0 && <div className="mx-3 h-[1px] bg-white/5" />}
              <button
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 ${
                  value === opt.value
                    ? 'text-primary-cyan400 bg-cyan-900/20'
                    : 'text-slate-400 hover:text-cyan-50 hover:bg-white/5'
                }`}
              >
                {opt.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RegisterPage = () => {
  const { t } = useTranslations();
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const [form, setForm] = useState<RegisterForm>({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'client',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const authT = (t.auth || {}) as Record<string, string>;

  const roleOptions: { value: UserRole; label: string }[] = [
    { value: 'client', label: authT.roleClient || '普通用户' },
    { value: 'host', label: authT.roleHost || '主播 / Cast' },
  ];

  const handleChange = (field: keyof RegisterForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    if (serverError) setServerError('');
  };

  const validate = (): boolean => {
    const errors: FormErrors = {};
    if (form.username.trim().length < 2) {
      errors.username = authT.errorUsernameMin || '用户名至少需要2个字符';
    }
    if (form.password.length < 6) {
      errors.password = authT.errorPasswordMin || '密码至少需要6位';
    }
    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = authT.errorPasswordMismatch || '两次密码输入不一致';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setServerError('');

    try {
      // Step 1: 注册
      const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          role: form.role,
        }),
      });

      const registerJson: ApiResponse = await registerRes.json();

      if (registerJson.code !== 200) {
        setServerError(registerJson.message || authT.errorRegisterFailed || '注册失败，请稍后重试');
        return;
      }

      // Step 2: 注册成功后自动登录
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });

      const loginJson: ApiResponse = await loginRes.json();

      if (loginJson.code === 200 && loginJson.data) {
        login(loginJson.data.token, loginJson.data.user);
        setLocation('/');
      } else {
        setLocation('/login');
      }
    } catch {
      setServerError(authT.errorNetwork || '网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-cyber-base flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* 背景光晕装饰 */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-ambient-lg pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-ambient-lg pointer-events-none" />

      {/* 返回按钮 */}
      <button
        type="button"
        onClick={() => setLocation('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-primary-cyan400 transition-colors duration-200 group z-20"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="text-xs tracking-widest uppercase">返回首页</span>
      </button>

      {/* 玻璃态卡片 */}
      <div className="relative z-10 w-full max-w-md">
        {/* 卡片辉光边框 */}
        <div className="absolute -inset-[1px] bg-gradient-to-br from-purple-600/20 via-transparent to-cyan-500/20 rounded-2xl blur-xs" />

        <div className="relative bg-[#0a0a1a]/90 backdrop-blur-xl border border-cyber-border rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          {/* Logo 区域 */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-400/30 rounded-full blur-md" />
              <Zap size={22} className="relative text-purple-400" />
            </div>
            <span className="text-base font-bold tracking-lg bg-gradient-to-r from-purple-400 to-primary-cyan400 bg-clip-text text-transparent uppercase">
              E-IDOL
            </span>
          </div>

          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-cyan-50 tracking-wide mb-1">
              {authT.registerTitle || '创建账号'}
            </h1>
            <p className="text-xs text-slate-500 tracking-widest uppercase">
              {authT.registerSubtitle || 'CREATE YOUR ACCOUNT'}
            </p>
            <div className="mt-3 mx-auto w-16 h-[1px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <CyberInput
              label={authT.username || '用户名'}
              type="text"
              placeholder={authT.usernamePlaceholder || '请输入用户名（至少2位）'}
              value={form.username}
              onChange={handleChange('username')}
              autoComplete="username"
              disabled={isLoading}
              error={fieldErrors.username}
            />

            <CyberInput
              label={authT.password || '密码'}
              type="password"
              placeholder={authT.passwordPlaceholder || '请输入密码（至少6位）'}
              value={form.password}
              onChange={handleChange('password')}
              autoComplete="new-password"
              disabled={isLoading}
              error={fieldErrors.password}
            />

            <CyberInput
              label={authT.confirmPassword || '确认密码'}
              type="password"
              placeholder={authT.confirmPasswordPlaceholder || '请再次输入密码'}
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              autoComplete="new-password"
              disabled={isLoading}
              error={fieldErrors.confirmPassword}
            />

            {/* 角色选择 — 使用表单专用 RoleSelector，撑满宽度 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium tracking-widest text-slate-400 uppercase">
                {authT.role || '账号类型'}
              </label>
              <RoleSelector
                value={form.role}
                onChange={(v) => setForm((prev) => ({ ...prev, role: v }))}
                options={roleOptions}
              />
            </div>

            {/* 服务端错误提示 */}
            {serverError && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <span className="text-xs text-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.5)]">
                  {serverError}
                </span>
              </div>
            )}

            {/* 注册按钮 — 直接使用 CyberButton type="submit"，不嵌套原生 button */}
            <CyberButton
              type="submit"
              disabled={isLoading}
              className="w-full mt-2"
              innerClassName="py-3 text-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  {authT.registering || '注册中...'}
                </span>
              ) : (
                authT.registerBtn || '注 册'
              )}
            </CyberButton>
          </form>

          {/* 跳转登录 */}
          <p className="mt-6 text-center text-xs text-slate-500">
            {authT.hasAccount || '已有账号？'}
            <button
              type="button"
              onClick={() => setLocation('/login')}
              className="ml-1 text-primary-cyan400 hover:text-primary-cyan300 hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.6)] transition-all duration-200 cursor-pointer"
            >
              {authT.goLogin || '立即登录'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
