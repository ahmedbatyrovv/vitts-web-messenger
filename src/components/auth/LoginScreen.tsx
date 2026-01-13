import { useState, useEffect } from "react";
import { MessageCircle, Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login, clearError } from "../../store/authSlice";
import { motion, AnimatePresence } from "framer-motion";

interface LoginScreenProps {
  onSwitchToSignUp: () => void;
}

export default function LoginScreen({ onSwitchToSignUp }: LoginScreenProps) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>(
    {}
  );

  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);
  const isLoading = status === "loading";

  useEffect(() => {
    if (error) {
      setErrors({ phone: error });
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const newErrors: typeof errors = {};
    if (!phone.trim()) newErrors.phone = "Enter phone number";
    if (phone.trim() && !phone.trim().startsWith("+"))
      newErrors.phone = "Phone must start with +";
    if (!password) newErrors.password = "Enter password";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    dispatch(login({ phone: phone.trim(), password }));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#151515] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,168,132,0.08),transparent_40%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111111]/90 backdrop-blur-sm rounded-2xl border border-white/5 shadow-2xl overflow-hidden"
      >
        <div className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#00A884]/10 mb-4 mx-auto">
            <MessageCircle
              className="w-7 h-7 text-[#00A884]"
              strokeWidth={1.5}
            />
          </div>
          <h1 className="text-2xl font-medium text-white">Welcome back</h1>
          <p className="text-gray-400 mt-1">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#00A884] mb-1.5 pl-1">
              Phone number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  setPhone(formatted);
                }}
                placeholder="+1 555 123 4567"
                className="w-full bg-[#1a1a1a] text-white px-4 py-3.5 rounded-xl border border-[#2a2a2a] focus:border-[#00A884] focus:ring-1 focus:ring-[#00A884]/30 focus:outline-none transition-all"
                autoFocus
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {phone && (
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                )}
              </div>
            </div>
            <AnimatePresence>
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-xs mt-1.5 pl-1"
                >
                  {errors.phone}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-[#00A884] mb-1.5 pl-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1a1a1a] text-white px-4 py-3.5 rounded-xl border border-[#2a2a2a] focus:border-[#00A884] focus:ring-1 focus:ring-[#00A884]/30 pr-12 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                {showPassword ? (
                  <EyeOff size={20} strokeWidth={1.5} />
                ) : (
                  <Eye size={20} strokeWidth={1.5} />
                )}
              </button>
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-xs mt-1.5 pl-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 rounded-xl font-medium text-white transition-all ${
              isLoading
                ? "bg-[#00A884]/60 cursor-not-allowed"
                : "bg-[#00A884] hover:bg-[#00c896]"
            }`}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </motion.button>
        </form>

        <div className="px-6 py-4 border-t border-[#2a2a2a]">
          <p className="text-gray-400 text-sm text-center">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-[#00A884] font-medium hover:opacity-80 transition-opacity"
            >
              Create one
            </button>
          </p>
        </div>

        <div className="px-6 py-3 flex items-center justify-center gap-2 text-xs text-gray-500">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00A884]" />
          <span>End-to-end encrypted</span>
        </div>
      </motion.div>
    </div>
  );
}
