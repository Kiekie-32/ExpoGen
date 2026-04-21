import { useState, useEffect } from "react";
import { Flag, Ban, Handshake, FileText, Zap, ArrowRight, CheckCircle2, Circle, Clock, Loader2, Sparkles } from "lucide-react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from "motion/react";
import { productService } from "../services/productService";
import { useAuth } from "../context/AuthContext";

const initialSteps = [
  { label: "Product Setup",           status: "done" },
  { label: "Ghana Compliance",         status: "active" },
  { label: "Destination Compliance",   status: "pending" },
  { label: "Trade Agreements",         status: "pending" },
  { label: "Documentation",            status: "pending" },
];

const statusCards = [
  { icon: Flag,      label: "Ghana Compliance",       description: "Regulatory framework verification for local standards.", badge: "In Review", badgeColor: "bg-yellow-100 text-yellow-700",  href: "/compliance" },
  { icon: Ban,       label: "Destination Compliance",  description: "Missing FDA registration for target jurisdiction.",       badge: "Blocked",   badgeColor: "bg-red-100 text-red-600",      href: "/compliance" },
  { icon: Handshake, label: "Trade Agreements",        description: "Evaluating AfCFTA eligibility for tax exemptions.",        badge: "Pending",   badgeColor: "bg-orange-100 text-orange-600", href: "/" },
  { icon: FileText,  label: "Documentation",           description: "Certificate of Origin and Packing List draft required.",   badge: "Pending",   badgeColor: "bg-orange-100 text-orange-600", href: "/documents" },
];

export default function MainContent() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const { user } = useAuth();

  const search = searchParams.toString() ? `?${searchParams.toString()}` : "";
  
  const [readinessScore, setReadinessScore] = useState(0);
  const [steps] = useState(initialSteps);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let lastProductId: number | null = null;
    let hsCode = "";

    // 1. Try to get it from AuthContext
    if (user && user.productIds && user.productIds.length > 0) {
      lastProductId = user.productIds[user.productIds.length - 1];
    } else {
      // 2. Fallback: scan localStorage for any cached product if auth state is out of sync
      let highestId = -1;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('product_')) {
          const idStr = key.replace('product_', '');
          const id = parseInt(idStr, 10);
          if (!isNaN(id) && id > highestId) {
            highestId = id;
          }
        }
      }
      if (highestId !== -1) {
        lastProductId = highestId;
      }
    }

    if (lastProductId !== null && !productId) {
      const cached = localStorage.getItem(`product_${lastProductId}`);
      if (cached) {
        try {
          const product = JSON.parse(cached);
          hsCode = product.selected_hs_code || "";
        } catch (e) {}
      }
      setSearchParams({ id: lastProductId.toString(), ...(hsCode ? { hs_code: hsCode } : {}) }, { replace: true });
      return; // Return early to let the re-render trigger the fetch
    }

    const fetchReadiness = async () => {
      if (!productId) return;
      setIsLoading(true);
      try {
        const res = await productService.getReadiness(Number(productId));
        if (res) {
          setReadinessScore(res.score || 0);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard readiness", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReadiness();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <Loader2 size={30} className="animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-6 space-y-5">
      
      {/* Welcome Header */}
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {user ? `Welcome back, ${user.full_name.split(' ')[0]}!` : "Welcome to ExportGen"}
        </h2>
        <p className="text-sm text-gray-500">
          {user?.business_name ? `Managing exports for ${user.business_name}` : "Streamline your export compliance and documentation."}
        </p>
      </div>

      {/* TOP ROW */}
      <div className="flex gap-5">

        {/* Progress */}
        <motion.div
          className="w-72 shrink-0 bg-white rounded-2xl border border-gray-200 p-6"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-gray-800">Export Readiness</p>
            <span className="text-xs font-bold text-teal-600">{readinessScore}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mb-5">
            <motion.div
              className="h-1.5 bg-teal-500 rounded-full"
              initial={{ width: 0 }} animate={{ width: `${readinessScore}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            />
          </div>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                {step.status === "done"    ? <CheckCircle2 size={14} className="text-teal-500 shrink-0" />
                : step.status === "active" ? <Clock size={14} className="text-yellow-500 shrink-0" />
                :                            <Circle size={14} className="text-gray-300 shrink-0" />}
                <span className={`text-xs font-medium ${
                  step.status === "done" ? "text-teal-600 line-through" :
                  step.status === "active" ? "text-gray-900" : "text-gray-400"
                }`}>{step.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Priority Action */}
        <motion.div
          className="flex-1 bg-[#0f2d4a] rounded-2xl p-8 flex flex-col justify-between"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={13} className="text-teal-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400">Priority Action</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Next Step: Register with FDA Ghana.</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              This is required for your product sector. Mandatory certification must be obtained before any shipping documents can be generated.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => navigate(`/compliance${search}`)}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
            >
              Start Task <ArrowRight size={15} />
            </button>
            <button className="text-white text-sm font-medium border border-white/30 hover:border-white/60 px-5 py-2.5 rounded-lg transition-colors">
              View Guide
            </button>
          </div>
        </motion.div>
      </div>

      {/* Start Export CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
      >
        <button
          onClick={() => navigate(`/product`)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm"
        >
          <Zap size={15} />
          Start New Export
        </button>
      </motion.div>

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4">
        {statusCards.map(({ icon: Icon, label, description, badge, badgeColor, href }, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-sm transition-shadow"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15 + i * 0.05 }}
            onClick={() => navigate(`${href}${search}`)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                <Icon size={15} className="text-gray-600" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">{label}</p>
            <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
          </motion.div>
        ))}
      </div>
    </main>
  );
}