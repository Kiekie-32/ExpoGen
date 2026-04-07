import { useState, useRef, useEffect } from "react";
import { CheckCircle2, Circle, AlertCircle, Upload, ChevronDown, ChevronUp, ShieldCheck, Globe, ArrowRight, Clock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { complianceService } from "../services/complianceService";
import type { ComplianceRequirement } from "../services/complianceService";
import { productService } from "../services/productService";
import Stepper from "../components/Stepper";

type Status = "done" | "pending" | "blocked" | "review";

interface CheckItem extends ComplianceRequirement {
  country_code?: string;
}

const statusConfig: Record<Status, { label: string; color: string }> = {
  done:    { label: "Complete",  color: "bg-green-100 text-green-700" },
  pending: { label: "Pending",   color: "bg-orange-100 text-orange-600" },
  blocked: { label: "Blocked",   color: "bg-red-100 text-red-600" },
  review:  { label: "In Review", color: "bg-yellow-100 text-yellow-700" },
};

function StatusIcon({ status }: { status: Status }) {
  if (status === "done")    return <CheckCircle2 size={15} className="text-green-500 shrink-0" />;
  if (status === "review")  return <Clock size={15} className="text-yellow-500 shrink-0" />;
  if (status === "blocked") return <AlertCircle size={15} className="text-red-500 shrink-0" />;
  return <Circle size={15} className="text-gray-300 shrink-0" />;
}

function ChecklistItem({ item, onUpload, productId }: { item: CheckItem; onUpload: (id: string, name: string) => void, productId: string }) {
  const [expanded, setExpanded] = useState(item.status === "blocked");
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setIsUploading(true);
      try {
        // Mock file upload to a storage service
        const fileUrl = `https://storage.example.com/${f.name}`;
        await productService.uploadDocument(Number(productId) || 1, {
          document_type: item.label,
          file_url: fileUrl,
          verified: false,
        });
        onUpload(item.id, f.name);
      } catch (error) {
        console.error("Failed to upload document", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${
      item.status === "blocked" ? "border-red-200 bg-red-50/20" :
      item.status === "done" ? "border-green-100" : "border-gray-200 bg-white"
    }`}>
      <button className="w-full flex items-center justify-between px-4 py-3.5 text-left" onClick={() => setExpanded(v => !v)}>
        <div className="flex items-center gap-3">
          <StatusIcon status={item.status} />
          <span className="text-xs font-semibold text-gray-800">{item.label}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${statusConfig[item.status].color}`}>
            {statusConfig[item.status].label}
          </span>
          {expanded ? <ChevronUp size={13} className="text-gray-400" /> : <ChevronDown size={13} className="text-gray-400" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div className="px-4 pb-4 border-t border-gray-100 bg-white"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }}>
            <p className="text-xs text-gray-500 leading-relaxed mt-3 mb-3">{item.description}</p>

            {item.status === "blocked" && (
              <div className="mb-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <p className="text-xs text-red-600 font-semibold">⚠ This item is blocking your export. Resolve it to proceed.</p>
              </div>
            )}

            {item.requiresUpload && (
              item.uploadedFile ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-green-500" />
                  <span className="text-xs text-green-700 font-medium">{item.uploadedFile}</span>
                  <button className="text-xs text-gray-400 hover:text-gray-600 underline ml-1" onClick={() => fileRef.current?.click()}>Replace</button>
                </div>
              ) : (
                <button 
                  onClick={() => fileRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-2 border border-dashed border-gray-300 hover:border-teal-400 hover:bg-teal-50 text-xs font-semibold text-gray-400 hover:text-teal-700 px-4 py-2.5 rounded-lg transition-all disabled:opacity-50">
                  {isUploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                  Upload Document
                </button>
              )
            )}
            <input ref={fileRef} type="file" className="hidden"
              onChange={handleFileChange} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CompliancePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id") || "";
  const hsCode = searchParams.get("hs_code") || "151590"; // Fallback to a default if missing
  
  const [ghanaList, setGhanaList] = useState<CheckItem[]>([]);
  const [destList, setDestList]   = useState<CheckItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let response;
        if (productId) {
          response = await complianceService.getProductCompliance(Number(productId));
        } else {
          response = await complianceService.getGhanaCompliance(hsCode);
        }
        console.log("Compliance response:", response);
        
        let ghanaRaw: any[] = [];
        let destRaw: any[] = [];

        if (response && typeof response === 'object' && Array.isArray((response as any).ghana_requirements)) {
          // Extract arrays exactly as returned by product compliance endpoint
          ghanaRaw = (response as any).ghana_requirements;
          destRaw = (response as any).destination_requirements || [];
        } else {
          // Fallback legacy behavior
          let rawItems: any[] = [];
          if (Array.isArray(response)) {
            rawItems = response;
          } else if (response && typeof response === 'object' && Array.isArray((response as any).items)) {
            rawItems = (response as any).items;
          } else if (response && typeof response === 'object' && Array.isArray((response as any).requirements)) {
            rawItems = (response as any).requirements;
          }

          ghanaRaw = rawItems.filter((r: any) => r.country_code === "GHA" || r.country_code === "GH");
          destRaw = rawItems.filter((r: any) => r.country_code !== "GHA" && r.country_code !== "GH");
        }

        const mapReq = (item: any): CheckItem => ({
          id: item.id?.toString() || Math.random().toString(),
          label: item.requirement_type || item.authority || item.label,
          description: item.description,
          status: item.completed ? "done" : item.mandatory ? "pending" : "done",
          requiresUpload: !!item.expected_document_type || !!item.document_required,
          country_code: item.country_code?.toUpperCase()
        });

        const ghana = ghanaRaw.map(mapReq);
        const dest = destRaw.map(mapReq);

        setGhanaList(ghana);
        setDestList(dest);
      } catch (error) {
        console.error("Failed to fetch compliance requirements", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId, hsCode]);

  const upload = (
    id: string, name: string, listType: 'ghana' | 'dest'
  ) => {
    const setList = listType === 'ghana' ? setGhanaList : setDestList;
    setList(prev => prev.map(item => item.id === id
      ? { ...item, uploadedFile: name, status: item.status === "pending" ? "review" : item.status }
      : item
    ));
  };

  const ghanaScore = ghanaList.length > 0 ? Math.round((ghanaList.filter(i => i.status === "done").length / ghanaList.length) * 100) : 0;
  const destScore  = destList.length > 0 ? Math.round((destList.filter(i => i.status === "done").length / destList.length) * 100) : 0;
  const blocked    = [...ghanaList, ...destList].filter(i => i && i.status === "blocked").length;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={30} className="animate-spin text-teal-600" />
          <p className="text-sm font-medium text-gray-500">Loading compliance checklist...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 pb-12">
      <Stepper currentStep={2} />
      
      <div className="px-8">
        <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Compliance</p>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Checklist</h1>
          <p className="text-sm text-gray-500 mt-1">Complete all items to unlock document generation.</p>
        </div>
        <button onClick={() => navigate(`/readiness?id=${productId}`)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors">
          View Readiness Score <ArrowRight size={15} />
        </button>
      </div>

      {/* Summary bar */}
      {blocked > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 flex items-center gap-3 mb-6">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-700 font-medium">
            <span className="font-bold">{blocked} blocked item{blocked > 1 ? "s" : ""}</span> must be resolved before you can generate export documents.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">

        {/* GHANA */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center">
                <ShieldCheck size={14} className="text-teal-700" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-800">Ghana Requirements</h2>
                <p className="text-[11px] text-gray-400">{ghanaList.filter(i => i.status === "done").length} / {ghanaList.length} complete</p>
              </div>
            </div>
            <span className="text-sm font-bold text-teal-600">{ghanaScore}%</span>
          </div>
          <div className="w-full h-1 bg-gray-200 rounded-full mb-4">
            <motion.div className="h-1 bg-teal-500 rounded-full" animate={{ width: `${ghanaScore}%` }} transition={{ duration: 0.5 }} />
          </div>
          <div className="space-y-2">
            {ghanaList.map(item => (
              <ChecklistItem key={item.id} item={item} productId={productId}
                onUpload={(id, name) => upload(id, name, 'ghana')} />
            ))}
          </div>
        </motion.div>

        {/* DESTINATION */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.08 }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                <Globe size={14} className="text-blue-700" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-800">Destination Requirements</h2>
                <p className="text-[11px] text-gray-400">{destList.filter(i => i.status === "done").length} / {destList.length} complete</p>
              </div>
            </div>
            <span className="text-sm font-bold text-blue-600">{destScore}%</span>
          </div>
          <div className="w-full h-1 bg-gray-200 rounded-full mb-4">
            <motion.div className="h-1 bg-blue-500 rounded-full" animate={{ width: `${destScore}%` }} transition={{ duration: 0.5 }} />
          </div>
          <div className="space-y-2">
            {destList.map(item => (
              <ChecklistItem key={item.id} item={item} productId={productId}
                onUpload={(id, name) => upload(id, name, 'dest')} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </main>
  );
}