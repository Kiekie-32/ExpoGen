import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      setIsProcessing(true);
      // Simulate account creation & checklist building
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }, 1500);
    }
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
                Scale your business <br />
                <span className="text-teal-600">across borders.</span>
              </h1>
              <p className="text-slate-600 text-base leading-relaxed max-w-md font-medium">
                ExpoGen simplifies complex trade regulations, document
                generation, and compliance checks so you can focus on growth.
              </p>
            </div>

            {/* Featured Image / Illustration */}
            <div className="relative">
              <div className="rounded-[2rem] overflow-hidden shadow-2xl bg-slate-100 border border-slate-200">
                <img
                  alt="Professional exporter"
                  className="w-full h-[320px] object-cover opacity-90"
                  src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1000"
                />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/80 backdrop-blur-md flex items-center gap-4 border border-white/20 shadow-lg">
                  <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-[10px] uppercase tracking-wider text-slate-900 leading-tight">
                      Trusted by SMEs
                    </p>
                    <p className="text-[9px] text-slate-600 font-medium leading-tight">
                      Compliant with 180+ trade jurisdictions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-100 relative overflow-hidden min-h-[500px] flex flex-col justify-center transition-all">
              {/* Step 1 & 2 Forms */}
              {!isSuccess ? (
                <div className="animate-in fade-in duration-500">
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-center lg:text-left">
                      <div className="lg:hidden inline-flex items-center px-3 py-1 rounded-full bg-[#6cf8bb] text-[#002113] text-[8px] font-bold tracking-[0.1em] uppercase mb-4">
                        Global Trade Intelligence
                      </div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-1 tracking-tight leading-tight">
                        {step === 1 ? "Welcome to ExpoGen" : "Create account"}
                      </h2>
                      <p className="text-slate-500 text-xs lg:text-sm font-medium">
                        {step === 1
                          ? "Let’s set up your profile in under 2 minutes."
                          : "Enter your credentials to secure your workspace."}
                      </p>
                    </div>
                    <span className="shrink-0 px-2 sm:px-3 py-1 bg-slate-50 text-slate-400 text-[8px] sm:text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-100">
                      Step {step} of 2
                    </span>
                  </div>

                  {step === 1 && (
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
                          Or with company details
                        </span>
                      </div>
                    </div>
                  )}

                  <form
                    className="space-y-4 sm:space-y-5"
                    onSubmit={handleNextStep}
                  >
                    {step === 1 ? (
                      <div className="space-y-4 sm:space-y-5 animate-in slide-in-from-right duration-500">
                        {/* Business Name */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-end">
                            <label
                              className="block text-[9px] lg:text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]"
                              htmlFor="business-name"
                            >
                              Business name
                            </label>
                            <span className="hidden sm:block text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                              On invoices & docs
                            </span>
                          </div>
                          <input
                            className="w-full px-4 py-2.5 sm:py-3 rounded-xl border-2 border-transparent bg-slate-50 focus:bg-white focus:border-teal-500/20 focus:ring-4 focus:ring-teal-500/5 text-slate-900 placeholder:text-slate-400 transition-all font-medium text-sm outline-none"
                            id="business-name"
                            name="business-name"
                            placeholder="Acme Exports Ltd."
                            type="text"
                            required
                          />
                        </div>
                        {/* Sector Dropdown */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-end">
                            <label
                              className="block text-[9px] lg:text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]"
                              htmlFor="sector"
                            >
                              Sector
                            </label>
                            <span className="hidden sm:block text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                              Customizes compliance & HS
                            </span>
                          </div>
                          <div className="relative">
                            <select
                              className="w-full appearance-none px-4 py-2.5 sm:py-3 rounded-xl border-2 border-transparent bg-slate-50 focus:bg-white focus:border-teal-500/20 focus:ring-4 focus:ring-teal-500/5 text-slate-900 transition-all font-medium text-sm outline-none cursor-pointer"
                              id="sector"
                              name="sector"
                              defaultValue=""
                              required
                            >
                              <option disabled value="">
                                Select your industry
                              </option>
                              <option value="agribusiness">Agribusiness</option>
                              <option value="cosmetics">Cosmetics</option>
                              <option value="green">Textiles</option>
                              <option value="other">Other</option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                              ▼
                            </div>
                          </div>
                        </div>
                        {/* Export Destination */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-end">
                            <label
                              className="block text-[9px] lg:text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]"
                              htmlFor="destination"
                            >
                              Primary Destination
                            </label>
                            <span className="hidden sm:block text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                              Preloads rules
                            </span>
                          </div>
                          <div className="relative">
                            <select
                              className="w-full appearance-none px-4 py-2.5 sm:py-3 rounded-xl border-2 border-transparent bg-slate-50 focus:bg-white focus:border-teal-500/20 focus:ring-4 focus:ring-teal-500/5 text-slate-900 transition-all font-medium text-sm outline-none cursor-pointer"
                              id="destination"
                              name="destination"
                              defaultValue=""
                            >
                              <option value="">
                                Choose a destination country (Optional)
                              </option>
                              <option value="uk">United Kingdom</option>
                              <option value="germany">Germany</option>
                              <option value="usa">USA</option>
                              <option value="china">China</option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                              ▼
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 sm:space-y-5 animate-in slide-in-from-right duration-500">
                        {/* Email */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-end">
                            <label
                              className="block text-[9px] lg:text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]"
                              htmlFor="email"
                            >
                              Work Email
                            </label>
                            <span className="hidden sm:block text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                              For compliance alerts
                            </span>
                          </div>
                          <input
                            className="w-full px-4 py-2.5 sm:py-3 rounded-xl border-2 border-transparent bg-slate-50 focus:bg-white focus:border-teal-500/20 focus:ring-4 focus:ring-teal-500/5 text-slate-900 placeholder:text-slate-400 transition-all font-medium text-sm outline-none"
                            id="email"
                            name="email"
                            placeholder="name@company.com"
                            type="email"
                            required
                          />
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
                            <span className="hidden sm:block text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                              At least 8 chars
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              className="w-full px-4 py-2.5 sm:py-3 rounded-xl border-2 border-transparent bg-slate-50 focus:bg-white focus:border-teal-500/20 focus:ring-4 focus:ring-teal-500/5 text-slate-900 placeholder:text-slate-400 transition-all font-medium text-sm outline-none pr-12"
                              id="password"
                              name="password"
                              placeholder="••••••••"
                              type={showPassword ? "text" : "password"}
                              minLength={8}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-teal-600 transition-colors cursor-pointer"
                            >
                              {showPassword ? "Hide" : "Show"}
                            </button>
                          </div>
                        </div>
                        {/* Role Dropdown */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-end">
                            <label
                              className="block text-[9px] lg:text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]"
                              htmlFor="role"
                            >
                              Your Role (Optional)
                            </label>
                            <span className="hidden sm:block text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                              Customizes workspace
                            </span>
                          </div>
                          <div className="relative">
                            <select
                              className="w-full appearance-none px-4 py-2.5 sm:py-3 rounded-xl border-2 border-transparent bg-slate-50 focus:bg-white focus:border-teal-500/20 focus:ring-4 focus:ring-teal-500/5 text-slate-900 transition-all font-medium text-sm outline-none cursor-pointer"
                              id="role"
                              name="role"
                              defaultValue="exporter"
                            >
                              <option value="exporter">Exporter</option>
                              <option value="operations">Operations</option>
                              <option value="compliance">Compliance</option>
                              <option value="finance">Finance</option>
                              <option value="other">Other</option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                              ▼
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CTA row */}
                    <div className="space-y-4 pt-2">
                      <div className="flex flex-col sm:flex-row gap-3">
                        {step === 2 && (
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 text-slate-900 font-black rounded-xl uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all active:scale-95"
                          >
                            Back
                          </button>
                        )}
                        <button
                          className="flex-1 py-3.5 px-6 bg-teal-600 text-white font-black rounded-xl shadow-lg hover:bg-teal-700 hover:shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                          type="submit"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <span className="tracking-[0.1em] text-xs uppercase">
                                {step === 1
                                  ? "Continue"
                                  : "Start export journey"}
                              </span>
                              <span className="group-hover:translate-x-1 transition-transform">
                                →
                              </span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex flex-col items-center gap-3">
                        {step === 2 && (
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest text-center">
                            We’ll create your workspace and generate your
                            checklist.
                          </p>
                        )}

                        <div className="flex items-center gap-2 opacity-60">
                          <span className="text-[10px]">🔒</span>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                            Encrypted & Private • No credit card required
                          </p>
                        </div>

                        {step === 1 && (
                          <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="text-[9px] font-bold text-teal-600 uppercase tracking-[0.15em] hover:underline opacity-60 hover:opacity-100 transition-opacity"
                          >
                            I'll do this later
                          </button>
                        )}

                        {step === 2 && (
                          <p className="text-[9px] text-slate-400 font-medium text-center leading-relaxed max-w-[280px]">
                            By continuing, you agree to our{" "}
                            <a
                              href="#"
                              className="underline hover:text-teal-600"
                            >
                              Regulatory Terms
                            </a>{" "}
                            and{" "}
                            <a
                              href="#"
                              className="underline hover:text-teal-600"
                            >
                              Data Privacy
                            </a>
                            .
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 text-center">
                      <p className="text-[10px] text-slate-500 font-medium">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => navigate("/login")}
                          className="text-teal-600 font-bold hover:underline"
                        >
                          Log in
                        </button>
                      </p>
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
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      Setting up workspace
                    </h2>
                    <p className="text-slate-500 font-medium">
                      Analyzing your sector and pre-loading regulatory
                      requirements...
                    </p>
                  </div>

                  {/* Progress Indicator */}
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
