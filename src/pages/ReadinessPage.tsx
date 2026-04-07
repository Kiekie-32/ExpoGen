import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2, XCircle, ArrowRight, BarChart3, FileText, ShieldCheck, Loader2 } from "lucide-react";
import { productService } from "../services/productService";
import Stepper from "../components/Stepper";

interface ReadinessData {
  score: number;
  missing: Array<{ label: string; section: string; severity: 'high' | 'medium' | 'low' }>;
  completed: Array<{ label: string; section: string }>;
  warnings: string[];
  category_breakdown: Array<{ label: string; score: number; icon: any; color: string }>;
}

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
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const [data, setData] = useState<ReadinessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReadiness = async () => {
      if (!productId) {
        setIsLoading(false);
        setError("No product selected. Please start an export journey first.");
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const res = await productService.getReadiness(Number(productId));
        console.log("Readiness API response:", res);

        // Map the API response based on the actual JSON structure received:
        // { product_id, mandatory_total, mandatory_completed, ... }
        
        const total = res.mandatory_total || 1;
        const completed = res.mandatory_completed || 0;
        const apiScore = res.readiness_percentage !== undefined 
          ? res.readiness_percentage 
          : res.score !== undefined 
            ? res.score 
            : Math.round((completed / total) * 100);
        
        // Map missing items from API
        const rawMissing = res.missing_items || res.items || [];
        const apiMissing = Array.isArray(rawMissing) 
          ? rawMissing.map((item: any) => ({
              label: item.requirement || item.requirement_type || item.label || item.authority || "Required Item",
              section: item.authority ? item.authority : (item.country_code === "GHA" || item.country_code === "GH" ? "Ghana" : `Destination (${item.country_code || 'Unknown'})`),
              severity: (item.mandatory === false ? "medium" : "high") as "high" | "medium" | "low"
            }))
          : [];

        // Map completed items from API
        const rawCompleted = res.completed_items || [];
        const apiCompleted = Array.isArray(rawCompleted)
          ? rawCompleted.map((item: any) => ({
              label: item.requirement || item.requirement_type || item.label || item.authority || "Completed Item",
              section: item.authority ? item.authority : (item.country_code === "GHA" || item.country_code === "GH" ? "Ghana" : "Destination"),
            }))
          : [];

        setData({
          score: apiScore,
          missing: apiMissing.length > 0 ? apiMissing : [
            { label: "Mandatory Compliance Items", section: "General", severity: "high" }
          ],
          completed: apiCompleted,
          warnings: res.warnings || [
            `${res.mandatory_total - res.mandatory_completed} mandatory items remaining.`,
          ],
          category_breakdown: [
            { label: "Ghana Compliance",       score: res.ghana_compliance_complete ? 100 : Math.min(90, apiScore + 5), icon: ShieldCheck, color: "bg-teal-500" },
            { label: "Destination Compliance", score: Math.max(0, apiScore - 10), icon: BarChart3,   color: "bg-blue-500" },
            { label: "Documentation",          score: 0, icon: FileText,    color: "bg-purple-400" },
          ]
        });
      } catch (error) {
        console.error("Failed to fetch readiness data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReadiness();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={30} className="animate-spin text-teal-600" />
          <p className="text-sm font-medium text-gray-500">Calculating readiness score...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-md text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} className="text-amber-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Readiness Score Unavailable</h2>
          <p className="text-sm text-gray-500 mb-6">{error || "We couldn't load your readiness data."}</p>
          <button onClick={() => navigate("/product")}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2.5 rounded-lg transition-colors">
            Go to Product Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 pb-12">
      <Stepper currentStep={3} />
      
      <div className="px-8">
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
          <ScoreRing value={data.score} />
          <div className="mt-4 text-center">
            <p className="text-sm font-bold text-amber-600">{data.score < 70 ? "Needs Attention" : "Looking Good"}</p>
            <p className="text-xs text-gray-400 mt-1">Complete blocked items to improve</p>
          </div>
        </motion.div>

        {/* Category breakdown */}
        <motion.div className="col-span-2 bg-white rounded-2xl border border-gray-200 p-6"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-5">Category Breakdown</p>
          {data.category_breakdown.map(({ label, score: s, icon: Icon, color }, i) => (
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
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">Missing Items ({data.missing.length})</p>
          <div className="space-y-2">
            {data.missing.map((item, i) => {
              const { color, label } = severityConfig[item.severity];
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
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">Completed ({data.completed.length})</p>
            <div className="space-y-2">
              {data.completed.map((item, i) => (
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
              {data.warnings.map((w, i) => (
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
        <button onClick={() => navigate(`/documents?id=${productId}`)}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0 ml-6">
          Go to Documents <ArrowRight size={15} />
        </button>
      </motion.div>
      </div>
    </main>
  );
}