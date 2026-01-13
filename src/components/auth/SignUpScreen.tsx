import { useState, useEffect } from "react";
import { MessageCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { register, clearError } from "../../store/authSlice";
import { motion, AnimatePresence } from "framer-motion";

interface SignUpScreenProps {
  onSwitchToLogin: () => void;
}

export default function SignUpScreen({ onSwitchToLogin }: SignUpScreenProps) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<number, string>>({});

  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);
  const isLoading = status === "loading";

  useEffect(() => {
    if (error) {
      setFieldErrors((prev) => ({ ...prev, [step]: error }));
    }
  }, [error, step]);

  const validationRules = [
    {
      check: () => !phone.trim() || !phone.trim().startsWith("+"),
      message: "Phone must start with +",
    },
    {
      check: () => !/^[a-z0-9_]{3,15}$/.test(username.trim()),
      message: "3-15 chars, a-z, 0-9, _ only",
    },
    {
      check: () => !displayName.trim() || displayName.trim().length < 2,
      message: "Enter your name",
    },
    {
      check: () =>
        password.length < 8 ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password),
      message: "8+ chars, with letter & number",
    },
    {
      check: () => confirmPassword !== password,
      message: "Passwords don't match",
    },
  ];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const currentRule = validationRules[step - 1];
    if (currentRule?.check()) {
      setFieldErrors((prev) => ({ ...prev, [step]: currentRule.message }));
      return;
    }

    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[step];
      return newErrors;
    });

    if (step < 5) {
      setStep(step + 1);
      return;
    }

    dispatch(
      register({
        phone: phone.trim(),
        username: username.trim(),
        displayName: displayName.trim(),
        password,
      })
    );
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    if (digits.length <= 3) return `+${digits}`;
    if (digits.length <= 5) return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
    if (digits.length <= 8)
      return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(
      5,
      8
    )} ${digits.slice(8, 10)}${
      digits.length > 10 ? ` ${digits.slice(10, 12)}` : ""
    }`;
  };

  const renderStepContent = () => {
    const error = fieldErrors[step];

    switch (step) {
      case 1:
        return (
          <>
            <label className="block text-sm font-medium text-[#00A884] mb-1.5 pl-1">
              Phone number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                const formatted = formatPhone(e.target.value);
                setPhone(formatted);
              }}
              placeholder="+1 555 123 4567"
              className="w-full bg-[#1a1a1a] text-white px-4 py-3.5 rounded-xl border border-[#2a2a2a] focus:border-[#00A884] focus:ring-1 focus:ring-[#00A884]/30"
              autoFocus
            />
          </>
        );

      case 2:
        return (
          <>
            <label className="block text-sm font-medium text-[#00A884] mb-1.5 pl-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
              className="w-full bg-[#1a1a1a] text-white px-4 py-3.5 rounded-xl border border-[#2a2a2a] focus:border-[#00A884] focus:ring-1 focus:ring-[#00A884]/30"
            />
            <p className="text-gray-400 text-xs mt-1">
              Only lowercase letters, numbers, underscores
            </p>
          </>
        );

      case 3:
        return (
          <>
            <label className="block text-sm font-medium text-[#00A884] mb-1.5 pl-1">
              Full name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-[#1a1a1a] text-white px-4 py-3.5 rounded-xl border border-[#2a2a2a] focus:border-[#00A884] focus:ring-1 focus:ring-[#00A884]/30"
            />
          </>
        );

      case 4:
        return (
          <>
            <label className="block text-sm font-medium text-[#00A884] mb-1.5 pl-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1a1a1a] text-white px-4 py-3.5 rounded-xl border border-[#2a2a2a] focus:border-[#00A884] focus:ring-1 focus:ring-[#00A884]/30 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? (
                  <EyeOff size={20} strokeWidth={1.5} />
                ) : (
                  <Eye size={20} strokeWidth={1.5} />
                )}
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-1">
              Minimum 8 characters with letter and number
            </p>
          </>
        );

      case 5:
        return (
          <>
            <label className="block text-sm font-medium text-[#00A884] mb-1.5 pl-1">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1a1a1a] text-white px-4 py-3.5 rounded-xl border border-[#2a2a2a] focus:border-[#00A884] focus:ring-1 focus:ring-[#00A884]/30 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} strokeWidth={1.5} />
                ) : (
                  <Eye size={20} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#151515] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,168,132,0.08),transparent_40%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111111]/90 backdrop-blur-sm rounded-2xl border border-white/5 shadow-2xl overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            {step > 1 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(step - 1)}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" strokeWidth={1.5} />
              </motion.button>
            )}
            <div className="flex-1 flex justify-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#00A884]/10">
                <MessageCircle
                  className="w-6 h-6 text-[#00A884]"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <div className="w-10" />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-medium text-white">Create account</h1>
            <p className="text-gray-400 mt-1">Step {step} of 5</p>
          </div>

          <form onSubmit={handleNext} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {fieldErrors[step] && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-sm bg-red-900/20 p-3 rounded-xl border border-red-900/40"
                >
                  {fieldErrors[step]}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="flex gap-3 mt-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-3.5 rounded-xl font-medium text-white transition-all ${
                  isLoading
                    ? "bg-[#00A884]/60 cursor-not-allowed"
                    : "bg-[#00A884] hover:bg-[#00c896]"
                }`}
              >
                {step < 5
                  ? "Next"
                  : isLoading
                  ? "Creating..."
                  : "Create account"}
              </motion.button>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-[#2a2a2a]">
          <p className="text-gray-400 text-sm text-center">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-[#00A884] font-medium hover:opacity-80 transition-opacity"
            >
              Sign in
            </button>
          </p>
        </div>

        <div className="px-6 py-3 flex items-center justify-center gap-2 text-xs text-gray-500">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00A884]" />
          <span>End-to-end encrypted</span>
        </div>

        <div className="px-6 py-4 flex justify-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i + 1 <= step ? "bg-[#00A884] scale-110" : "bg-gray-700/50"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
