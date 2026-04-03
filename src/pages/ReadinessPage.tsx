import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2, XCircle, ArrowRight, BarChart3, FileText, ShieldCheck } from "lucide-react";

const score = 42;

const missing = [
  { label: "FDA Ghana Registration",   section: "Ghana",       severity: "high" },
  { label: "FDA USA Registration",     section: "Destination", severity: "high" },
  { label: "Certificate of Origin",    section: "Destination", severity: "medium" },
  { label: "Export License (GEPA)",    section: "Ghana",       severity: "medium" },
  { label: "Phytosanitary Certificate",section: "Ghana",       severity: "low" },
  { label: "Import Permit",            section: "Destination", severity: "low" },
];

const completed = [
  { label: "Business Registration (RGD)", section: "Ghana" },
  { label: "GSA Review Submitted",        section: "Ghana" },
];

const warnings = [
  "2 blocked items will prevent document generation until resolved.",
  "FDA Ghana registration can take up to 30 business days — start immediately.",
  "Certificate of Origin must be authenticated before customs clearance.",
];

const severityConfig = {
  high:   { color: "bg-red-100 text-red-600",    label: "High" },
  medium: { color: "bg-orange-100 text-orange-600", label: "Medium" },
  low:    { color: "bg-yellow-100 text-yellow-600", label: "Low" },
};

function ScoreRing({ value }: { value: number }) {
  const radius = 54;
  const circ   = 2 * Math.PI * radius;
  const dash   = (value / 100) * circ;
  const color  = value >= 70 ? "#14b8a6" : value >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="10" />
      <motion.circle
        cx="70" cy="70" r={radius}
        fill="none" stroke={color} strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${circ}`}
        strokeDashoffset={circ}
        animate={{ strokeDashoffset: circ - dash }}
        transform="rotate(-90 70 70)"
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      />
      <text x="70" y="65" textAnchor="middle" dominantBaseline="middle" fontSize="26" fontWeight="800" fill={color}>{value}</text>
      <text x="70" y="84" textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#9ca3af">/ 100</text>
    </svg>
  );
}

export default function ReadinessPage() {
  const navigate = useNavigate();

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-8">

      <div className="mb-6">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Export Readiness</p>
        <h1 className="text-2xl font-bold text-gray-900">Readiness Score</h1>
        <p className="text-sm text-gray-500 mt-1">A snapshot of your current export compliance progress.</p>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">

        {/* Score card */}
        <motion.div className="col-span-1 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">Overall Score</p>
          <ScoreRing value={score} />
          <div className="mt-4 text-center">
            <p className="text-sm font-bold text-amber-600">Needs Attention</p>
            <p className="text-xs text-gray-400 mt-1">Complete blocked items to improve</p>
          </div>
        </motion.div>

        {/* Category breakdown */}
        <motion.div className="col-span-2 bg-white rounded-2xl border border-gray-200 p-6"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-5">Category Breakdown</p>
          {[
            { label: "Ghana Compliance",       score: 60, icon: ShieldCheck, color: "bg-teal-500" },
            { label: "Destination Compliance", score: 25, icon: BarChart3,   color: "bg-blue-500" },
            { label: "Documentation",          score: 10, icon: FileText,    color: "bg-purple-400" },
          ].map(({ label, score: s, icon: Icon, color }, i) => (
            <div key={i} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Icon size={14} className="text-gray-400" />
                  <span className="text-xs font-semibold text-gray-700">{label}</span>
                </div>
                <span className="text-xs font-bold text-gray-500">{s}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <motion.div className={`h-2 rounded-full ${color}`}
                  initial={{ width: 0 }} animate={{ width: `${s}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: "easeOut" }} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-5">

        {/* Missing items */}
        <motion.div className="bg-white rounded-2xl border border-gray-200 p-6"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">Missing Items ({missing.length})</p>
          <div className="space-y-2">
            {missing.map((item, i) => {
              const { color, label } = severityConfig[item.severity as keyof typeof severityConfig];
              return (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2.5">
                    <XCircle size={14} className="text-red-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{item.label}</p>
                      <p className="text-[10px] text-gray-400">{item.section}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color}`}>{label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Completed + Warnings */}
        <div className="flex flex-col gap-5">
          {/* Completed */}
          <motion.div className="bg-white rounded-2xl border border-gray-200 p-6"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.12 }}>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">Completed ({completed.length})</p>
            <div className="space-y-2">
              {completed.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 py-2 border-b border-gray-100 last:border-0">
                  <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{item.label}</p>
                    <p className="text-[10px] text-gray-400">{item.section}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Warnings */}
          <motion.div className="bg-amber-50 border border-amber-200 rounded-2xl p-6"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={15} className="text-amber-500" />
              <p className="text-xs font-bold uppercase tracking-wide text-amber-600">Warnings</p>
            </div>
            <div className="space-y-2">
              {warnings.map((w, i) => (
                <p key={i} className="text-xs text-amber-700 leading-relaxed border-b border-amber-100 last:border-0 pb-2 last:pb-0">
                  {w}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Next step CTA */}
      <motion.div className="bg-[#0f2d4a] rounded-2xl p-6 flex items-center justify-between"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <div>
          <p className="text-white font-bold text-sm mb-1">Ready to generate your export documents?</p>
          <p className="text-gray-400 text-xs">Resolve all blocked items, then generate your Certificate of Origin, Packing List, and Commercial Invoice.</p>
        </div>
        <button onClick={() => navigate("/documents")}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0 ml-6">
          Go to Documents <ArrowRight size={15} />
        </button>
      </motion.div>
    </main>
  );
}