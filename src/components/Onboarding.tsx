import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<any>(null);

  const [formData, setFormData] = useState({
    "full-name": "",
    "business-name": "",
    sector: "",
    destination: "",
    email: "",
    password: "",
    role: "exporter",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      setIsProcessing(true);
      setError(null);
      try {
        await register({
          email: formData.email,
          password: formData.password,
          full_name: formData["full-name"],
          business_name: formData["business-name"],
          sector: formData.sector,
          primary_destination: formData.destination,
          role: formData.role,
        });
        setIsProcessing(false);
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } catch (err: any) {
        setIsProcessing(false);
        const errorData = err.response?.data?.detail;
        setError(errorData || "Registration failed. Please try again.");
        console.error("Registration error:", errorData);
      }
    }
  };

  // Helper to render error messages safely
  const renderError = () => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (Array.isArray(error)) {
      return error[0]?.msg || "Invalid input data";
    }
    if (typeof error === 'object') {
      return error.msg || "An error occurred";
    }
    return "Registration failed";
  };

  return (
    <div className="bg-[#f8fafc] font-sans text-slate-900 antialiased h-screen flex flex-col overflow-hidden">
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden">
        <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full">
          {/* Content Side: Branding & Illustration */}
          <div className="hidden lg:flex flex-col justify-center space-y-6 pr-6 h-full overflow-hidden">
            <div className="space-y-3 shrink-0">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-[10px] font-bold tracking-[0.1em] uppercase w-fit">
                Global Trade Intelligence
              </div>
              <h1 className="text-3xl text-[#0F4C71] xl:text-7xl font-bold tracking-tight leading-[1.15]">
                Scale your business <br />
                <span className="text-teal-600">across borders.</span>
              </h1>
              <p className="text-slate-500 text-base leading-relaxed max-w-lg font-medium">
                ExpoGen simplifies complex trade regulations, document
                generation, and compliance checks so you can focus on growth.
              </p>
            </div>

            {/* Featured Image / Illustration */}
            <div className="relative flex-1 min-h-0">
              <div className="h-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-100 border border-slate-200">
                <img
                  alt="Professional exporter"
                  className="w-full h-full object-cover opacity-90"
                  src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=40&w=1000"
                />
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/80 backdrop-blur-md flex items-center gap-5 border border-white/20 shadow-xl">
                  <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-base font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-extrabold text-[11px] uppercase tracking-wider text-slate-900 leading-tight">
                      Trusted by SMEs
                    </p>
                    <p className="text-[13px] text-slate-600 font-medium leading-tight mt-0.5">
                      Compliant with 180+ trade jurisdictions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full max-w-lg mx-auto flex items-center h-full">
            <div className="bg-white rounded-[2rem] p-4 sm:p-5 lg:p-8 shadow-2xl border border-slate-100/50 relative overflow-y-auto w-full h-full max-h-[85vh] flex flex-col justify-center transition-all scrollbar-hide">
              {!isSuccess ? (
                <div className="animate-in fade-in duration-500">
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-center lg:text-left">
                      <div className="lg:hidden inline-flex items-center px-3 py-1 rounded-full bg-[#6cf8bb] text-[#002113] text-[8px] font-bold tracking-[0.1em] uppercase mb-4">
                        Global Trade Intelligence
                      </div>
                      <h2 className="text-2xl text-[#0F4C51] sm:text-3xl lg:text-4xl font-bold mb-1 tracking-tight leading-tight">
                        {step === 1 ? "Welcome to ExpoGen" : "Create account"}
                      </h2>
                      <p className="text-slate-500 text-sm font-medium">
                        {step === 1
                          ? "Let’s set up your profile in under 2 minutes."
                          : "Enter your credentials to secure your workspace."}
                      </p>
                      {error && (
                        <p className="text-red-500 text-xs font-bold mt-2 animate-pulse">
                          {renderError()}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-100">
                      Step {step} of 2
                    </span>
                  </div>

                  <form
                    className="space-y-4"
                    onSubmit={handleNextStep}
                  >
                    {step === 1 ? (
                      <div className="space-y-4 animate-in slide-in-from-right duration-500">
                        {/* SSO Options */}
                        <button type="button" className="w-full py-3.5 px-8 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-4 group">
                          <img
                            src="https://www.google.com/favicon.ico"
                            className="w-5 h-5"
                            alt="Google"
                          />
                          <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                            Continue with Google
                          </span>
                        </button>

                        <div className="relative flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                          </div>
                          <span className="relative px-6 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Or company details
                          </span>
                        </div>

                        {/* Business Name */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]" htmlFor="business-name">
                            Business name
                          </label>
                          <input
                            className="w-full px-5 py-3 rounded-xl border-2 border-transparent bg-slate-50 focus:bg-white focus:border-teal-500/20 focus:ring-4 focus:ring-teal-500/5 text-slate-900 placeholder:text-slate-400 transition-all font-medium text-sm outline-none"
                            id="business-name"
                            name="business-name"
                            placeholder="Acme Exports Ltd."
                            type="text"
                            value={formData["business-name"]}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        {/* Sector */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]" htmlFor="sector">
                            Sector
                          </label>
                          <div className="relative">
                            <select
                              className="w-full appearance-none px-5 py-3 rounded-xl border-2 border-transparent bg-slate-50 focus:bg-white focus:border-teal-500/20 focus:ring-4 focus:ring-teal-500/5 text-slate-900 transition-all font-medium text-sm outline-none cursor-pointer"
                              id="sector"
                              name="sector"
                              value={formData.sector}
                              onChange={handleChange}
                              required
                            >
                              <option disabled value="">Select your industry</option>
                              <option value="agribusiness">Agribusiness</option>
                              <option value="cosmetics">Cosmetics</option>
                              <option value="textiles">Textiles</option>
                              <option value="other">Other</option>
                            </select>
                            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-slate-400">▼</div>
                          </div>
                        </div>
                        {/* Destination */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]" htmlFor="destination">
                            Primary Destination
                          </label>
                          <div className="relative">
                            <select
                              className="w-full appearance-none px-5 py-3 rounded-xl border-2 border-transparent bg-slate-50 focus:bg-white focus:border-teal-500/20 focus:ring-4 focus:ring-teal-500/5 text-slate-900 transition-all font-medium text-sm outline-none cursor-pointer"
                              id="destination"
                              name="destination"
                              value={formData.destination}
                              onChange={handleChange}
                            >
                              <option value="">Choose a destination (Optional)</option>
                              <option value="uk">United Kingdom</option>
                              <option value="germany">Germany</option>
                              <option value="usa">USA</option>
                              <option value="china">China</option>
                            </select>
                            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-slate-400">▼</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-in slide-in-from-right duration-500">
                        {/* Full Name */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]" htmlFor="full-name">
                            Full Name
                          </label>
                          <input
                            className="w-full px-5 py-3 rounded-xl border-2 border-transparent bg-slate-50 focus:bg-white focus:border-teal-500/20 focus:ring-4 focus:ring-teal-500/5 text-slate-900 placeholder:text-slate-400 transition-all font-medium text-sm outline-none"
                            id="full-name"
                            name="full-name"
                            placeholder="Barbara Sackey"
                            type="text"
                            value={formData["full-name"]}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        {/* Email */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]" htmlFor="email">
                            Work Email
                          </label>
                          <input
                            className="w-full px-5 py-3 rounded-xl border-2 border-transparent bg-slate-50 focus:bg-white focus:border-teal-500/20 focus:ring-4 focus:ring-teal-500/5 text-slate-900 placeholder:text-slate-400 transition-all font-medium text-sm outline-none"
                            id="email"
                            name="email"
                            placeholder="name@company.com"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        {/* Password */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]" htmlFor="password">
                            Password
                          </label>
                          <div className="relative">
                            <input
                              className="w-full px-5 py-3 rounded-xl border-2 border-transparent bg-slate-50 focus:bg-white focus:border-teal-500/20 focus:ring-4 focus:ring-teal-500/5 text-slate-900 placeholder:text-slate-400 transition-all font-medium text-sm outline-none pr-14"
                              id="password"
                              name="password"
                              placeholder="••••••••"
                              type={showPassword ? "text" : "password"}
                              minLength={8}
                              value={formData.password}
                              onChange={handleChange}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-5 flex items-center text-slate-400 hover:text-teal-600 transition-colors cursor-pointer text-xs"
                            >
                              {showPassword ? "Hide" : "Show"}
                            </button>
                          </div>
                        </div>
                        {/* Role */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]" htmlFor="role">
                            Your Role (Optional)
                          </label>
                          <div className="relative">
                            <select
                              className="w-full appearance-none px-5 py-3 rounded-xl border-2 border-transparent bg-slate-50 focus:bg-white focus:border-teal-500/20 focus:ring-4 focus:ring-teal-500/5 text-slate-900 transition-all font-medium text-sm outline-none cursor-pointer"
                              id="role"
                              name="role"
                              value={formData.role}
                              onChange={handleChange}
                            >
                              <option value="exporter">Exporter</option>
                              <option value="operations">Operations</option>
                              <option value="compliance">Compliance</option>
                              <option value="finance">Finance</option>
                              <option value="other">Other</option>
                            </select>
                            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-slate-400">▼</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CTA Row */}
                    <div className="space-y-6 pt-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        {step === 2 && (
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 text-slate-900 font-bold rounded-xl uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all active:scale-95"
                          >
                            Back
                          </button>
                        )}
                        <button
                          className="flex-1 py-3.5 px-6 bg-teal-600 text-white font-bold rounded-xl shadow-lg hover:bg-teal-700 hover:shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                          type="submit"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <span className="tracking-[0.1em] text-xs uppercase">
                                {step === 1 ? "Continue" : "Start export journey"}
                              </span>
                              <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-center space-y-4">
                        <p className="text-sm text-slate-500 font-medium">
                          Already have an account?{" "}
                          <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="text-teal-600 font-bold hover:underline"
                          >
                            Log in
                          </button>
                        </p>
                        
                        <div className="flex items-center justify-center gap-2 opacity-60">
                          <span className="text-[10px]">🔒</span>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                            Encrypted & Private • No credit card required
                          </p>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                /* Success Transition State */
                <div className="text-center space-y-6 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-teal-100">
                    <span className="text-teal-600 text-3xl">✓</span>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                      Setting up workspace
                    </h2>
                    <p className="text-slate-500 font-medium">
                      Analyzing your sector and pre-loading regulatory
                      requirements...
                    </p>
                  </div>

                  <div className="max-w-[240px] mx-auto space-y-4">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-600 animate-progress origin-left"></div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                        <span>•</span> Building compliance checklist
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse delay-75">
                        <span>•</span> Securing trade data access
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
