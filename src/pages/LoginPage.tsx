import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Compass,
  Mail,
  User,
  Building,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [business_name, setBusinessName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLoginMode) {
        // Use the simulated login which looks up in localStorage
        login({ email });
      } else {
        await register({
          full_name,
          email,
          business_name: business_name || undefined,
        });
      }
      setIsLoading(false);
      navigate("/dashboard");
    } catch (error) {
      console.error(
        isLoginMode ? "Login failed:" : "Registration failed:",
        error,
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-200 mb-4">
            <Compass size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isLoginMode ? "Welcome Back" : "Create Your Profile"}
          </h1>
          <p className="text-gray-500 text-sm mt-2 text-center">
            {isLoginMode
              ? "Enter your email to continue where you left off."
              : "Join ExpoGen to manage your export products and compliance."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLoginMode && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={full_name}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                  placeholder="Barbara Sackey"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                placeholder="barbara@example.com"
              />
            </div>
          </div>

          {!isLoginMode && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1">
                Company Name (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Building size={18} />
                </div>
                <input
                  type="text"
                  value={business_name}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                  placeholder="Sackey Exports Ltd."
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-200 transition-all disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                {isLoginMode
                  ? "Resume Export Journey"
                  : "Continue to Dashboard"}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            {isLoginMode
              ? "Don't have a profile yet? Create one"
              : "Already have a profile? Resume session"}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          By continuing, you agree to ExpoGen's Terms of Service and Privacy
          Policy.
        </p>
      </motion.div>
    </div>
  );
}
