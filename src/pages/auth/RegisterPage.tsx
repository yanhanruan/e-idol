// src/pages/auth/RegisterPage.tsx
import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronDown, Loader2, Zap } from 'lucide-react';
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
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 sm:px-6 lg:px-8 py-8 font-sans md:min-h-screen md:p-0 lg:p-0 md:items-stretch">

      {/* ===== Left Side: Immersive Brand Visual Zone (Desktop only) ===== */}
      <div className="hidden md:flex md:w-[60%] md:relative md:overflow-hidden md:items-center md:justify-center md:bg-cyber-base">

        {/* Ambient glow — top-left cyan */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-cyan400/20 rounded-full blur-ambient-lg pointer-events-none" />
        {/* Ambient glow — bottom-right purple */}
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary-purple/15 rounded-full blur-ambient-lg pointer-events-none" />
        {/* Ambient glow — center soft pink */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-pink/5 rounded-full blur-ambient-md pointer-events-none" />

        {/* Decorative grid pattern via inline SVG */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="registerBrandGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#c084fc" strokeWidth="0.5" strokeOpacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#registerBrandGrid)" />
          </svg>
        </div>

        {/* Brand Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-16">
          {/* Decorative Orbital Ring */}
          <div className="relative mb-14">
            <div className="w-36 h-36 rounded-full border border-primary-purple/20 flex items-center justify-center animate-pulse">
              <div className="w-28 h-28 rounded-full border border-primary-cyan400/15 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-purple/10 to-primary-cyan400/10 backdrop-blur-sm flex items-center justify-center">
                  <Zap className="w-10 h-10 text-primary-purple drop-shadow-neon-purple" />
                </div>
              </div>
            </div>
            {/* Orbital accent dot */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary-purple shadow-neon-purple" />
          </div>

          {/* Brand Name */}
          <h2 className="text-5xl font-black tracking-lg bg-gradient-to-r from-primary-purple via-primary-blue to-primary-cyan400 bg-clip-text text-transparent mb-5 font-mono leading-none">
            E-IDOL
          </h2>

          {/* Tagline */}
          <p className="text-base text-content-muted tracking-md uppercase mb-6">
            Begin Your Virtual Journey
          </p>

          {/* Decorative divider */}
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-primary-purple/60 to-transparent mb-6" />

          {/* Description */}
          <p className="text-sm text-content-ghost tracking-wide max-w-sm leading-relaxed">
            Create your account and step into a world of immersive digital experiences. Your story starts here.
          </p>

          {/* Bottom indicator dots */}
          <div className="flex items-center gap-3 mt-14">
            <div className="w-2 h-2 rounded-full bg-primary-purple/60" />
            <div className="w-2 h-2 rounded-full bg-primary-cyan400/40" />
            <div className="w-2 h-2 rounded-full bg-primary-purple/20" />
          </div>
        </div>
      </div>

      {/* ===== Right Side: Pure Register Operation Zone ===== */}
      <div className="w-full max-w-[400px] transition-all duration-300 md:max-w-none md:w-[40%] md:flex md:items-center md:justify-center md:bg-cyber-surface md:relative">

        {/* Vertical divider line between columns */}
        <div className="hidden md:block md:absolute md:left-0 md:top-[15%] md:w-px md:h-[70%] md:bg-gradient-to-b md:from-transparent md:via-primary-purple/25 md:to-transparent" />

        {/* Card wrapper — kept for mobile, stripped on desktop for a clean look */}
        <div className="relative bg-cyber-glassPanel backdrop-blur-xl border border-cyber-border rounded-2xl p-8 md:p-8 md:pt-10 shadow-panel md:bg-transparent md:border-none md:shadow-none md:backdrop-blur-none md:rounded-none md:w-full md:max-w-sm">

          {/* Logo Section */}
          <div className="flex flex-col items-center justify-center mb-8 md:mb-2">
            <div className="flex items-center gap-2 mb-4 md:mb-3">
              <div className="relative w-10 h-10 md:w-8 md:h-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary-purple/30 rounded-full blur-xl md:blur-glow" />
                <Zap className="relative text-primary-purple drop-shadow-neon-purple w-[22px] h-[22px] md:w-[18px] md:h-[18px]" />
              </div>
              <span className="text-xl md:text-base font-bold tracking-widest bg-gradient-to-r from-primary-purple to-primary-cyan400 bg-clip-text text-transparent uppercase font-mono">
                E-IDOL
              </span>
            </div>

            <h1 className="text-xl md:text-base font-bold text-content-primary tracking-wide mb-1">
              {authT.registerTitle || 'CREATE ACCOUNT'}
            </h1>
            <p className="text-sm md:text-3xs text-content-muted md:tracking-[0.2em] uppercase">
              {authT.registerSubtitle || 'START YOUR JOURNEY'}
            </p>
          </div>


          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-4">
            <CyberInput
              label={authT.username || 'USERNAME'}
              type="text"
              placeholder={authT.usernamePlaceholder || 'Enter username (min 2 chars)'}
              value={form.username}
              onChange={handleChange('username')}
              autoComplete="username"
              disabled={isLoading}
              error={fieldErrors.username}
              className="text-sm md:text-2xs md:h-9"
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
              className="text-sm md:text-2xs md:h-9"
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
              className="text-sm md:text-2xs md:h-9"

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
              <div className="px-3 py-2.5 md:py-2 rounded-lg bg-status-error/10 border border-status-error/30">
                <span className="text-xs md:text-2xs text-status-error font-medium flex items-center gap-2 md:gap-1.5">
                  <div className="w-1.5 h-1.5 md:w-1 md:h-1 rounded-full bg-status-error animate-pulse" />
                  {serverError}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-2 md:mt-1">
              <CyberButton className="w-full h-11 md:h-9 text-sm md:text-2xs tracking-widest font-semibold">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin md:w-3.5 md:h-3.5" />
                    {authT.registering || 'REGISTERING...'}
                  </span>
                ) : (
                  authT.registerBtn || 'JOIN NOW'
                )}
              </CyberButton>
            </div>
          </form>

          {/* Footer Section */}
          <div className="text-center mt-6 pt-2 border-t border-cyber-border/30">
            <p className="text-xs md:text-2xs text-content-muted tracking-wide mt-4 md:mt-3 flex items-center justify-center gap-1">
              {authT.hasAccount || 'ALREADY HAVE AN ACCOUNT?'}
              <button
                type="button"
                onClick={() => setLocation('/login')}
                className="text-primary-cyan400 hover:text-primary-cyan300 hover:drop-shadow-neon-cyan transition-all duration-200 cursor-pointer font-bold uppercase tracking-wider md:text-2xs"
              >
                {authT.goLogin || 'LOG IN'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
