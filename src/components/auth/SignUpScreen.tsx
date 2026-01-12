import { useState } from 'react';
import { MessageCircle, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { login } from '../../store/authSlice';
import { User } from '../../types';

interface SignUpScreenProps {
  onSwitchToLogin: () => void;
}

export default function SignUpScreen({ onSwitchToLogin }: SignUpScreenProps) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<number, string>>({});

  const dispatch = useAppDispatch();

  const validationRules = [
    { check: () => !phone.startsWith('+') || phone.length < 11 || /\D/.test(phone.slice(1)), message: 'Номер должен начинаться с "+" и содержать минимум 10 цифр' },
    { check: () => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), message: 'Введите корректный email' },
    { check: () => !/^[a-zA-Z][a-zA-Z0-9_]{2,}$/.test(username), message: 'Имя пользователя: начинается с буквы, минимум 3 символа' },
    { check: () => !name.trim(), message: 'Введите ваше имя' },
    {
      check: () => {
        if (password.length < 8) return true;
        if (!/[A-Z]/.test(password)) return true;
        if (!/[a-z]/.test(password)) return true;
        if (!/[0-9]/.test(password)) return true;
        return false;
      },
      message: 'Пароль должен содержать минимум 8 символов, заглавную, строчную букву и цифру'
    },
    { check: () => confirmPassword !== password, message: 'Пароли не совпадают' },
  ];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const rule = validationRules[step - 1];

    if (rule.check()) {
      setFieldErrors((prev) => ({ ...prev, [step]: rule.message }));
      return;
    }

    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[step];
      return newErrors;
    });

    if (step < 6) {
      setStep(step + 1);
    } else {
      // Проверяем уникальность
      const users = JSON.parse(localStorage.getItem('users') || '[]') as (User & { password: string })[];

      if (users.some(u => u.username === username.trim())) {
        setFieldErrors({ ...fieldErrors, 3: 'Это имя пользователя уже занято' });
        return;
      }

      if (users.some(u => u.phone === phone)) {
        setFieldErrors({ ...fieldErrors, 1: 'Этот номер телефона уже зарегистрирован' });
        return;
      }

      if (users.some(u => u.email === email)) {
        setFieldErrors({ ...fieldErrors, 2: 'Этот email уже зарегистрирован' });
        return;
      }

      // Создаём пользователя
      const newUser: User & { password: string } = {
        id: 'user-' + Date.now(),
        phone,
        email,
        username: username.trim(),
        name: name.trim(),
        about: 'Привет! Я использую это приложение.',
        lastSeen: Date.now(),
        isOnline: true,
        password, // ← сохраняем пароль (только для демо!)
      };

      // Сохраняем в localStorage
      const updatedUsers = [...users, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Автологин
      const { password: _, ...userWithoutPassword } = newUser;
      dispatch(login(userWithoutPassword));
    }
  };

  const handleBack = () => {
    setFieldErrors({});
    setStep((prev) => Math.max(1, prev - 1));
  };

  const isCurrentStepValid = !validationRules[step - 1]?.check();

  const getCurrentField = () => {
    const error = fieldErrors[step];

    switch (step) {
      case 1:
        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">Номер телефона</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                let val = e.target.value;
                if (val === '' || val.startsWith('+')) {
                  val = '+' + val.slice(1).replace(/\D/g, '');
                } else {
                  val = val.replace(/\D/g, '');
                }
                setPhone(val);
              }}
              placeholder="+1234567890"
              className="w-full bg-[#1F1F1F] text-white px-4 py-3.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mt-2 bg-red-950/30 p-2 rounded">{error}</p>}
          </>
        );

      case 2:
        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full bg-[#1F1F1F] text-white px-4 py-3.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mt-2 bg-red-950/30 p-2 rounded">{error}</p>}
          </>
        );

      case 3:
        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">Имя пользователя</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe123"
              className="w-full bg-[#1F1F1F] text-white px-4 py-3.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mt-2 bg-red-950/30 p-2 rounded">{error}</p>}
          </>
        );

      case 4:
        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">Полное имя</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-[#1F1F1F] text-white px-4 py-3.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mt-2 bg-red-950/30 p-2 rounded">{error}</p>}
          </>
        );

      case 5:
        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">Пароль</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1F1F1F] text-white px-4 py-3.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] pr-11"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && <p className="text-red-400 text-xs mt-2 bg-red-950/30 p-2 rounded">{error}</p>}
          </>
        );

      case 6:
        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">Подтвердите пароль</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1F1F1F] text-white px-4 py-3.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] pr-11"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && <p className="text-red-400 text-xs mt-2 bg-red-950/30 p-2 rounded">{error}</p>}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#00A884] mb-6 mx-auto">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-light text-white mb-2">Регистрация</h1>
          <p className="text-gray-400 text-sm">Шаг {step} из 6</p>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          <div>{getCurrentField()}</div>

          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 bg-[#2A2A2A] hover:bg-[#333333] text-white py-3.5 rounded-lg font-medium transition-colors"
              >
                Назад
              </button>
            )}
            <button
              type="submit"
              disabled={!isCurrentStepValid}
              className={`flex-1 py-3.5 rounded-lg font-medium transition-colors ${
                isCurrentStepValid
                  ? 'bg-[#00A884] hover:bg-[#00c896] text-white'
                  : 'bg-[#00A884]/50 cursor-not-allowed text-white/60'
              }`}
            >
              {step < 6 ? 'Далее' : 'Создать аккаунт'}
            </button>
          </div>
        </form>

        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i + 1 <= step ? 'bg-[#00A884]' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">
            Уже есть аккаунт?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-[#00A884] hover:underline font-medium"
            >
              Войти
            </button>
          </p>
        </div>

        <div className="mt-8 text-center text-gray-500 text-xs">
          <p className="flex items-center justify-center gap-1.5">
            <span className="text-[#00A884]">🔒</span>
            Сквозное шифрование
          </p>
        </div>
      </div>
    </div>
  );
}