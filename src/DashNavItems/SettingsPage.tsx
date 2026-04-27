import { useState } from "react";
import {
  Settings,
  User,
  Building,
  Mail,
  Globe,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Check,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

type Section = "profile" | "notifications" | "security";

const SECTION_ITEMS: {
  key: Section;
  label: string;
  icon: typeof Settings;
  description: string;
}[] = [
  {
    key: "profile",
    label: "Profile & Business",
    icon: User,
    description: "Manage your personal and business information",
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Control how and when you get notified",
  },
  {
    key: "security",
    label: "Privacy & Security",
    icon: Shield,
    description: "Account security and data preferences",
  },
];

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile fields
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [businessName, setBusinessName] = useState(user?.business_name || "");
  const [email] = useState(user?.email || "");
  const [exportRegion, setExportRegion] = useState("Ghana");
  const [preferredCurrency, setPreferredCurrency] = useState("USD");

  // Notification toggles
  const [notifDocuments, setNotifDocuments] = useState(true);
  const [notifCompliance, setNotifCompliance] = useState(true);
  const [notifMarkets, setNotifMarkets] = useState(false);
  const [notifUpdates, setNotifUpdates] = useState(true);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const Toggle = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-colors ${checked ? "bg-teal-500" : "bg-gray-200"}`}
      style={{ width: "40px", height: "22px" }}
    >
      <span
        className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}
        style={{
          width: "18px",
          height: "18px",
          top: "2px",
          left: checked ? "20px" : "2px",
          transition: "left 0.2s",
        }}
      />
    </button>
  );

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">
            Preferences
          </p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Settings size={22} className="text-teal-500" />
            Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account, preferences, and notifications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar nav */}
          <div className="space-y-1">
            {SECTION_ITEMS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                  activeSection === key
                    ? "bg-teal-50 text-teal-700 border border-teal-100"
                    : "text-gray-600 hover:bg-white hover:text-gray-800 border border-transparent"
                }`}
              >
                <Icon size={15} />
                {label}
                {activeSection === key && (
                  <ChevronRight size={13} className="ml-auto text-teal-400" />
                )}
              </button>
            ))}

            <div className="pt-4 border-t border-gray-200 mt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Content panel */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
          >
            {/* Profile section */}
            {activeSection === "profile" && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-0.5">
                    Profile & Business
                  </h2>
                  <p className="text-xs text-gray-400">
                    Your personal and business information used across ExpoGen.
                  </p>
                </div>

                {/* Avatar area */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-14 h-14 rounded-full bg-teal-600 text-white text-xl font-bold flex items-center justify-center shrink-0">
                    {fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .substring(0, 2) || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {fullName || "Your Name"}
                    </p>
                    <p className="text-xs text-gray-400">{email}</p>
                    {businessName && (
                      <p className="text-xs text-teal-600 font-medium mt-0.5">
                        {businessName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        value={email}
                        readOnly
                        className="w-full text-sm border border-gray-100 rounded-lg pl-9 pr-3 py-2.5 bg-gray-50 text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Business Name
                    </label>
                    <div className="relative">
                      <Building
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Your company name"
                        className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Export Region
                    </label>
                    <div className="relative">
                      <Globe
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <select
                        value={exportRegion}
                        onChange={(e) => setExportRegion(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition appearance-none"
                      >
                        <option>Ghana</option>
                        <option>Nigeria</option>
                        <option>Kenya</option>
                        <option>Côte d'Ivoire</option>
                        <option>South Africa</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Preferred Currency
                    </label>
                    <select
                      value={preferredCurrency}
                      onChange={(e) => setPreferredCurrency(e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition appearance-none"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="GHS">GHS (GH₵)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications section */}
            {activeSection === "notifications" && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-0.5">
                    Notification Preferences
                  </h2>
                  <p className="text-xs text-gray-400">
                    Choose what activity triggers notifications in-app.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      label: "Document Generation",
                      description:
                        "When certificates, invoices, or contracts are ready",
                      value: notifDocuments,
                      set: setNotifDocuments,
                    },
                    {
                      label: "Compliance Alerts",
                      description:
                        "Missing certifications or regulatory changes",
                      value: notifCompliance,
                      set: setNotifCompliance,
                    },
                    {
                      label: "Market Intelligence",
                      description: "New trade opportunities and tariff updates",
                      value: notifMarkets,
                      set: setNotifMarkets,
                    },
                    {
                      label: "Platform Updates",
                      description: "New features and improvements to ExpoGen",
                      value: notifUpdates,
                      set: setNotifUpdates,
                    },
                  ].map(({ label, description, value, set }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {description}
                        </p>
                      </div>
                      <Toggle checked={value} onChange={set} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security section */}
            {activeSection === "security" && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-0.5">
                    Privacy & Security
                  </h2>
                  <p className="text-xs text-gray-400">
                    Manage your data and account security settings.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      label: "Data stored securely",
                      description:
                        "All your export data is encrypted at rest and in transit.",
                      color: "text-emerald-500",
                      icon: Check,
                    },
                    {
                      label: "Session-based authentication",
                      description:
                        "Your session is tied to your email and device securely.",
                      color: "text-teal-500",
                      icon: Shield,
                    },
                    {
                      label: "No third-party data sharing",
                      description:
                        "ExpoGen does not sell or share your business data with third parties.",
                      color: "text-blue-500",
                      icon: Globe,
                    },
                  ].map(({ label, description, color, icon: Icon }) => (
                    <div
                      key={label}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div
                        className={`w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 ${color}`}
                      >
                        <Icon size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={15} />
                    Sign out of all devices
                  </button>
                </div>
              </div>
            )}

            {/* Save button */}
            {activeSection !== "security" && (
              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Changes are saved to your account.
                </p>
                <button
                  onClick={handleSave}
                  disabled={isSaving || saved}
                  className={`flex items-center gap-2 text-sm font-bold px-5 py-2 rounded-xl transition-all ${
                    saved
                      ? "bg-emerald-500 text-white"
                      : "bg-teal-600 hover:bg-teal-500 text-white shadow-sm"
                  } disabled:opacity-70`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving…
                    </>
                  ) : saved ? (
                    <>
                      <Check size={14} /> Saved!
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
