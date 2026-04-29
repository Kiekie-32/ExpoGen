import React from "react";
import { useAuth } from "../context/AuthContext";
import { Building, Globe, Briefcase, User as UserIcon, Mail, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="px-8 md:px-16 py-20 text-center">
        <h1 className="text-4xl font-light mb-6">Profile</h1>
        <p className="text-white/60 mb-8">Please log in to view your export profile.</p>
        <button 
          onClick={() => navigate("/login")}
          className="px-8 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all"
        >
          Log In
        </button>
      </div>
    );
  }

  const profileItems = [
    { icon: UserIcon, label: "Full Name", value: user.full_name || "Not set" },
    { icon: Mail, label: "Email Address", value: user.email },
    { icon: Building, label: "Business Name", value: user.business_name || "Not set" },
    { icon: Briefcase, label: "Sector", value: user.sector || "Not set" },
    { icon: ShieldCheck, label: "Role", value: user.role || "Not set" },
    { icon: Globe, label: "Primary Destination", value: user.primary_destination || "Not set" },
  ];

  return (
    <div className="px-8 md:px-16 py-20 max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Export Profile</h1>
          <p className="text-white/60">
            This information is used to customize your compliance checks and document generation.
          </p>
        </div>
        <button 
          onClick={() => navigate("/dashboard/settings")}
          className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl border border-white/10 transition-all"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profileItems.map((item, index) => (
          <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-white font-medium">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-gradient-to-br from-teal-600/20 to-blue-600/20 border border-teal-500/20 rounded-[2rem]">
        <h3 className="text-xl font-bold text-white mb-2">Why this matters?</h3>
        <p className="text-white/70 text-sm leading-relaxed">
          Your export profile allows ExpoGen to automatically pre-fill documents, filter relevant HS codes, 
          and notify you about specific regulatory changes in your primary destination markets. 
          Keep this data accurate to ensure the highest level of compliance.
        </p>
      </div>
    </div>
  );
}
