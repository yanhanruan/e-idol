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
      <div className="absolute -inset-px bg-gradient-to-r from-primary-cyan400/40 via-primary-blue/30 to-primary-purple/40 rounded-lg opacity-50 blur-sm pointer-events-none" />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        /* 移动端维持原有大小，桌面端收紧到更精致的尺寸 */
        className="relative w-full flex items-center justify-between px-4 py-3 md:px-3 md:py-2 rounded-lg bg-cyber-base border border-cyber-border text-sm md:text-xs text-content-primary focus:outline-none transition-all duration-200 hover:bg-cyber-surface"
      >
        <span>{current?.label}</span>
        <ChevronDown
          size={14}
          className={`text-content-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg overflow-hidden border border-cyber-border bg-cyber-panel shadow-panel">
          {options.map((opt, i) => (
            <div key={opt.value}>
              {i > 0 && <div className="mx-3 h-px bg-cyber-border" />}
              <button
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-4 py-3 md:px-3 md:py-2 text-sm md:text-xs transition-colors duration-150 ${
                  value === opt.value
                    ? 'text-primary-cyan400 bg-primary-cyan400/10'
                    : 'text-content-muted hover:text-content-primary hover:bg-cyber-surface'
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
    <div className="relative min-h-screen bg-cyber-base flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute -top-1/4 -right-10 w-96 h-96 md:scale-125 bg-primary-purple/10 rounded-full blur-ambient-lg pointer-events-none" />
      <div className="absolute -bottom-1/4 -left-10 w-96 h-96 md:scale-125 bg-primary-cyan400/10 rounded-full blur-ambient-lg pointer-events-none" />

      {/* Back Button */}
      <button
        type="button"
        onClick={() => setLocation('/')}
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-content-muted hover:text-primary-cyan400 transition-colors duration-200 group z-20"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="text-2xs tracking-wider uppercase font-mono">BACK TO HOME</span>
      </button>

      {/* Register Container */}
      <div className="relative z-10 w-full max-w-sm md:w-88 transition-all duration-300">
        <div className="absolute -inset-px bg-gradient-to-br from-primary-purple/20 via-transparent to-primary-cyan400/20 rounded-2xl blur-sm" />

        {/* Auth Panel - rounded-2xl for primary container */}
        <div className="relative bg-cyber-glassPanel backdrop-blur-xl border border-cyber-border rounded-2xl p-6 md:p-8 shadow-panel">

          {/* Logo Section */}
          <div className="flex items-center justify-center gap-2 mb-6 md:mb-2">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary-purple/30 rounded-full blur-glow" />
              <Zap size={18} className="relative text-primary-purple drop-shadow-neon-purple" />
            </div>
            <span className="text-sm font-bold tracking-widest bg-gradient-to-r from-primary-purple to-primary-cyan400 bg-clip-text text-transparent uppercase font-mono">
              E-IDOL
            </span>
          </div>

          {/* Title Section */}
          <div className="text-center mb-6 md:mb-1">
            <h1 className="text-xl font-bold text-content-primary tracking-md mb-1">
              {authT.registerTitle || 'CREATE ACCOUNT'}
            </h1>
            <p className="text-2xs text-content-muted tracking-widest uppercase leading-none">
              {authT.registerSubtitle || 'START YOUR JOURNEY'}
            </p>
            <div className="mt-4 mx-auto w-12 h-px bg-gradient-to-r from-transparent via-primary-purple/60 to-transparent" />
          </div>

          {/* Form Section - Regular Spacing gap-4 */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <CyberInput
              label={authT.username || 'USERNAME'}
              type="text"
              placeholder={authT.usernamePlaceholder || 'Enter username (min 2 chars)'}
              value={form.username}
              onChange={handleChange('username')}
              autoComplete="username"
              disabled={isLoading}
              error={fieldErrors.username}
              className="text-xs"
            />

            <CyberInput
              label={authT.password || 'PASSWORD'}
              type="password"
              placeholder={authT.passwordPlaceholder || 'Enter password (min 6 chars)'}
              value={form.password}
              onChange={handleChange('password')}
              autoComplete="new-password"
              disabled={isLoading}
              error={fieldErrors.password}
              className="text-xs"
            />

            <CyberInput
              label={authT.confirmPassword || 'CONFIRM PASSWORD'}
              type="password"
              placeholder={authT.confirmPasswordPlaceholder || 'Repeat password'}
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              autoComplete="new-password"
              disabled={isLoading}
              error={fieldErrors.confirmPassword}
              className="text-xs"
            />

            {/* Role Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-2xs font-bold tracking-wider text-content-muted uppercase font-mono">
                {authT.role || 'IDENTITY'}
              </label>
              <RoleSelector
                value={form.role}
                onChange={(v) => setForm((prev) => ({ ...prev, role: v }))}
                options={roleOptions}
              />
            </div>

            {/* Error Message */}
            {serverError && (
              <div className="px-3 py-2 rounded-lg bg-status-error/10 border border-status-error/30 mt-1">
                <span className="text-2xs text-status-error font-medium leading-relaxed">
                  {serverError}
                </span>
              </div>
            )}

            {/* Submit Button - rounded-full for core interaction */}
            <div className="mt-4">
              <CyberButton
                className="w-full"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    {authT.registering || 'REGISTERING...'}
                  </span>
                ) : (
                  authT.registerBtn || 'JOIN NOW'
                )}
              </CyberButton>
            </div>
          </form>

          {/* Footer Section */}
          <p className="mt-8 text-center text-2xs text-content-muted tracking-wide">
            {authT.hasAccount || 'ALREADY HAVE AN ACCOUNT?'}
            <button
              type="button"
              onClick={() => setLocation('/login')}
              className="ml-1.5 text-primary-cyan400 hover:text-primary-cyan300 hover:drop-shadow-neon-cyan transition-all duration-200 cursor-pointer font-bold uppercase"
            >
              {authT.goLogin || 'LOG IN'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;