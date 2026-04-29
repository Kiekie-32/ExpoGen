import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  TrendingUp,
  Bell
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      setIsLoading(false);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      const errorData = err.response?.data?.detail;
      setError(errorData || "Login failed. Please check your connection.");
      setIsLoading(false);
    }
  };

  // Helper to render error messages safely
  const renderError = () => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (Array.isArray(error)) {
      return error[0]?.msg || "Invalid credentials";
    }
    if (typeof error === 'object') {
      return error.msg || "An error occurred";
    }
    return "Login failed";
  };

  return (
    <div className="bg-[#f8fafc] font-sans text-slate-900 antialiased min-h-screen flex flex-col overflow-x-hidden">
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-4 lg:py-0">
          {/* Content Side: Branding & Illustration */}
          <div className="hidden lg:flex flex-col space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-[10px] font-bold tracking-[0.1em] uppercase">
                Global Trade Intelligence
              </div>
              <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Welcome back to <br />
                <span className="text-teal-600">your workspace.</span>
              </h1>
              <p className="text-slate-600 text-base leading-relaxed max-w-md font-medium">
                TradeNavigator Intelligence provides the tools and insights necessary
                to navigate international markets with confidence.
              </p>
            </div>

            {/* Featured Image / Illustration - Using the Dashboard Mockup but styled like Onboarding */}
            <div className="relative mt-4">
              <div className="rounded-[2rem] overflow-hidden shadow-2xl bg-gradient-to-br from-[#1c557c] to-[#124264] p-8 flex flex-col gap-8 min-h-[420px]">
                {/* Header */}
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-[#6cf8bb]" size={18} />
                  <span className="text-[11px] font-bold text-white tracking-widest uppercase">
                    HOTTEST EXPORT TAKES
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-7 flex-1 mt-2">
                  {/* Item 1 */}
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <h4 className="text-[15px] font-bold text-white">EV Parts to Germany</h4>
                    </div>
                    <p className="text-sm text-[#9dbcd4] font-medium">
                      Demand surged by 24% this week. Low tariff entry.
                    </p>
                  </div>

                  {/* Item 2 */}
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <h4 className="text-[15px] font-bold text-white">Semiconductors to Japan</h4>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase bg-[#e02424] text-white">
                        HOT
                      </span>
                    </div>
                    <p className="text-sm text-[#9dbcd4] font-medium">
                      New fast-track export license approved.
                    </p>
                  </div>

                  {/* Item 3 */}
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <h4 className="text-[15px] font-bold text-white">Coffee to South Korea</h4>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase bg-[#6cf8bb] text-[#002113]">
                        TRENDING
                      </span>
                    </div>
                    <p className="text-sm text-[#9dbcd4] font-medium">
                      Market gap identified. Importers seeking suppliers.
                    </p>
                  </div>
                </div>

                {/* Button */}
                <button className="w-full mt-6 py-3.5 bg-white hover:bg-slate-50 transition-colors rounded-xl flex items-center justify-center gap-2 shadow-md">
                  <span className="text-[13px] font-bold text-[#1c557c]">Get Custom Alerts</span>
                  <Bell className="text-[#1c557c]" size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-100 relative overflow-hidden min-h-[500px] flex flex-col justify-center transition-all">
              <div className="animate-in fade-in duration-500">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-center lg:text-left w-full">
                    <div className="lg:hidden inline-flex items-center px-3 py-1 rounded-full bg-[#6cf8bb] text-[#002113] text-[8px] font-bold tracking-[0.1em] uppercase mb-4">
                      Global Trade Intelligence
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-1 tracking-tight leading-tight">
                      Welcome back
                    </h2>
                    <p className="text-slate-500 text-xs lg:text-sm font-medium">
                      Enter your credentials to access your dashboard.
                    </p>
                    {error && (
                      <p className="text-red-500 text-xs font-bold mt-2 animate-pulse text-left">
                        {renderError()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="animate-in slide-in-from-right duration-500">
                  {/* SSO Options */}
                  <button className="w-full mb-5 py-2.5 sm:py-3 px-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3 group">
                    <img
                      src="https://www.google.com/favicon.ico"
                      className="w-4 h-4"
                      alt="Google"
                    />
                    <span className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest">
                      Continue with Google
                    </span>
                  </button>

                  <div className="relative mb-5 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <span className="relative px-4 bg-white text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Or with email
                    </span>
                  </div>
                </div>

                <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-4 sm:space-y-5 animate-in slide-in-from-right duration-500">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-end">
                        <label
                          className="block text-[9px] lg:text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]"
                          htmlFor="email"
                        >
                          Email Address
                        </label>
                      </div>
                      <div className="relative">
                        <Mail
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                          size={18}
                        />
                        <input
                          className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-xl border-2 border-transparent bg-slate-50 focus:bg-white focus:border-teal-500/20 focus:ring-4 focus:ring-teal-500/5 text-slate-900 placeholder:text-slate-400 transition-all font-medium text-sm outline-none"
                          id="email"
                          name="email"
                          placeholder="name@company.com"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-end">
                        <label
                          className="block text-[9px] lg:text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]"
                          htmlFor="password"
                        >
                          Password
                        </label>
                        <button
                          type="button"
                          className="text-[9px] font-bold text-teal-600 hover:underline tracking-wider"
                        >
                          Forgot?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                          size={18}
                        />
                        <input
                          className="w-full pl-11 pr-12 py-2.5 sm:py-3 rounded-xl border-2 border-transparent bg-slate-50 focus:bg-white focus:border-teal-500/20 focus:ring-4 focus:ring-teal-500/5 text-slate-900 placeholder:text-slate-400 transition-all font-medium text-sm outline-none"
                          id="password"
                          name="password"
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-4 flex items-center px-4 text-slate-400 hover:text-teal-600 transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded-md border-slate-300 text-teal-600 focus:ring-teal-600 cursor-pointer"
                        id="keep-signed-in"
                      />
                      <label
                        htmlFor="keep-signed-in"
                        className="text-xs font-bold text-slate-600 cursor-pointer"
                      >
                        Keep me signed in
                      </label>
                    </div>
                  </div>

                  {/* CTA row */}
                  <div className="space-y-4 pt-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        className="flex-1 py-3.5 px-6 bg-teal-600 text-white font-black rounded-xl shadow-lg hover:bg-teal-700 hover:shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span className="tracking-[0.1em] text-xs uppercase">
                              Sign in to dashboard
                            </span>
                            <span className="group-hover:translate-x-1 transition-transform">
                              →
                            </span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-2 opacity-60">
                        <span className="text-[10px]">🔒</span>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                          Encrypted & Secure Session
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 text-center border-t border-slate-100">
                    <p className="text-[10px] text-slate-500 font-medium">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => navigate("/onboarding")}
                        className="text-teal-600 font-bold hover:underline"
                      >
                        Start Export Journey
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

