import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FileText, Download, Eye, Building2, MapPin, Hash, CheckCircle2, Loader2, Package, FileSpreadsheet, FilePenLine } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { documentService } from "../services/documentService";
import { productService } from "../services/productService";
import { useAuth } from "../context/AuthContext";
import Stepper from "../components/Stepper";

type DocStatus = "idle" | "generating" | "ready";

interface Doc {
  id: string;
  label: string;
  description: string;
  icon: typeof FileText;
  status: DocStatus;
  fileName: string;
  fileUrl?: string;
}

const initDocs: Doc[] = [
  { id: "coo",     label: "Certificate of Origin",  description: "Official document certifying the country in which the goods were produced.", icon: FileText,       status: "idle", fileName: "certificate_of_origin.pdf" },
  { id: "invoice", label: "Commercial Invoice",      description: "Document specifying the value and nature of goods being exported.",           icon: FileText,       status: "idle", fileName: "commercial_invoice.pdf" },
  { id: "packing", label: "Packing List",            description: "Detailed list of the contents, quantities, and weights of each package.",      icon: Package,        status: "idle", fileName: "packing_list.pdf" },
];

function DocCard({ doc, onPreview }: { doc: Doc; onPreview: (doc: Doc) => void }) {
  const Icon = doc.icon;
  return (
    <div className={`bg-white rounded-xl border p-5 transition-all flex flex-col justify-between ${doc.status === "ready" ? "border-teal-200" : "border-gray-200"}`}>
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${doc.status === "ready" ? "bg-teal-50" : "bg-gray-100"}`}>
            <Icon size={17} className={doc.status === "ready" ? "text-teal-600" : "text-gray-500"} />
          </div>
          {doc.status === "ready" && <CheckCircle2 size={16} className="text-teal-500" />}
        </div>
        <p className="text-sm font-bold text-gray-800 mb-1">{doc.label}</p>
        <p className="text-xs text-gray-400 leading-relaxed mb-4">{doc.description}</p>
      </div>

      <div>
        {doc.status === "idle" && (
          <span className="block w-full text-center text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-100 py-2 rounded-lg">
            Pending Generation
          </span>
        )}
        {doc.status === "generating" && (
          <div className="flex items-center justify-center gap-2 py-2">
            <Loader2 size={14} className="animate-spin text-teal-500" />
            <span className="text-xs text-teal-600 font-medium">Generating…</span>
          </div>
        )}
        {doc.status === "ready" && (
          <div className="flex gap-2">
            <button 
              onClick={() => onPreview(doc)}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg transition-colors">
              <Eye size={12} /> Preview
            </button>
            <button 
              onClick={() => {
                const link = document.createElement("a");
                link.href = doc.fileUrl || `/${doc.fileName}`;
                link.download = doc.fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 py-2 rounded-lg transition-colors">
              <Download size={12} /> Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id") || "1";
  const { user } = useAuth();
  const [docs, setDocs] = useState(initDocs);
  const [contractStatus, setContractStatus] = useState<DocStatus>("idle");
  const [generatedContractText, setGeneratedContractText] = useState("");
  const [contractPdfUrl, setContractPdfUrl] = useState("");
  const [previewDoc, setPreviewDoc] = useState<{ title: string, url: string } | null>(null);

  // Contract & Doc form state
  const [buyerName, setBuyerName]       = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [sellerName, setSellerName]     = useState("");
  const [productDesc, setProductDesc]   = useState("");
  const [quantity, setQuantity]         = useState("");
  const [hsCode, setHsCode]             = useState("");
  const [totalValue, setTotalValue]     = useState("");
  const [currency, setCurrency]         = useState("USD");
  const [deliveryTerms, setDeliveryTerms] = useState("");

  useEffect(() => {
    const loadDefaults = async () => {
      // Prioritize the user's business name from context for auto-fill
      if (user) {
        setSellerName(user.business_name || user.full_name);
        return;
      }

      // Fallback to localStorage if no user is logged in
      const savedSeller = localStorage.getItem("expogen_seller_name");
      if (savedSeller) {
        setSellerName(savedSeller);
      } else {
        setSellerName(""); // Leave blank if no user and no cache
      }

      if (!productId) return;
      try {
        const cachedProduct = localStorage.getItem(`product_${productId}`);
        if (cachedProduct) {
          const product = JSON.parse(cachedProduct);
          if (product.product_name) setProductDesc(product.product_name);
          if (product.selected_hs_code) setHsCode(product.selected_hs_code);
          return;
        }

        const product = await productService.getById(Number(productId));
        if (product) {
          if (product.product_name) setProductDesc(product.product_name);
          if (product.selected_hs_code) setHsCode(product.selected_hs_code);
        }
      } catch (e) {
        console.error("Failed to load product details for auto-fill", e);
      }
    };
    loadDefaults();
  }, [productId]);

  // Save seller info automatically to prevent re-typing
  useEffect(() => {
    if (sellerName) localStorage.setItem("expogen_seller_name", sellerName);
  }, [sellerName]);

  const isFormValid = !!(buyerName && sellerName && buyerAddress && quantity && totalValue && deliveryTerms);
  const operationalGenerating = docs.some(d => d.status === "generating");

  const getAbsoluteUrl = (url?: string) => {
    if (!url) return "";
    // If it's already an absolute URL, return it
    if (url.startsWith('http')) return url;
    // If it's a relative path, prefix with backend URL
    return "https://expo-gen-rose.vercel.app" + (url.startsWith('/') ? url : '/' + url);
  };

  const generateOperationalDocs = async () => {
    if (!isFormValid) return;
    setDocs(d => d.map(doc => ({ ...doc, status: "generating" })));
    try {
      const response = await documentService.generateOperationalDocs({
        product_id: Number(productId),
        consignee_name: buyerName,
        consignee_address: buyerAddress,
        product_details: {
          quantity: Number(quantity) || 0,
          unit_price: Number(totalValue) / (Number(quantity) || 1),
          net_weight: Number(quantity) || 0,
          gross_weight: (Number(quantity) || 0) * 1.1,
        },
        currency: currency,
        incoterms: deliveryTerms,
      });
      
      setDocs(d => d.map(doc => {
        let url = "";
        if (doc.id === "coo") url = response?.certificate_url;
        if (doc.id === "invoice") url = response?.invoice_url;
        if (doc.id === "packing") url = response?.packing_list_url;
        
        return { 
          ...doc, 
          status: "ready",
          fileUrl: getAbsoluteUrl(url) || `/${doc.fileName}`
        };
      }));
    } catch (error) {
      console.error("Failed to generate operational documents", error);
      setDocs(d => d.map(doc => ({ ...doc, status: "idle" })));
    }
  };

  const generateContract = async () => {
    if (!isFormValid) return;
    setContractStatus("generating");
    try {
      const response = await documentService.generateContract({
        product_id: Number(productId),
        consignee_name: buyerName,
        consignee_address: buyerAddress,
        quantity: `${quantity} kg`,
        quantity_value: Number(quantity),
        price_per_unit: Number(totalValue) / (Number(quantity) || 1),
        total_price: Number(totalValue),
        incoterms: deliveryTerms,
        port_name: "Tema Port",
        payment_terms: "30% deposit, 70% against documents",
        governing_law: "Ghana",
        dispute_resolution: "Arbitration in Accra",
      });
      setGeneratedContractText(response.ai_legal_review || "");
      
      let relativeUrl = response.contract_url || "";
      let absolutePdfUrl = relativeUrl;
      // Ensure we have an absolute URL for Google Docs Viewer
      if (relativeUrl.startsWith('/')) {
        absolutePdfUrl = "https://expo-gen-rose.vercel.app" + relativeUrl;
      }
      setContractPdfUrl(absolutePdfUrl);
      setContractStatus("ready");
      setPreviewDoc({ title: "AI Export Contract", url: absolutePdfUrl });
    } catch (error) {
      console.error("Failed to generate contract", error);
      setContractStatus("idle");
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Stepper currentStep={4} />
        
        <div>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Documents & Contracts</p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Export Documents Wizard</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Provide your overall transaction details below. This data will be securely sent to our servers 
            to structure and construct perfectly formatted, compliance-ready export documents and legal contracts.
          </p>
        </div>

        {/* Transaction Form Layer */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FileSpreadsheet size={17} className="text-teal-600" />
              <h3 className="text-sm font-bold text-gray-800">1. Transaction Details</h3>
            </div>
            {!isFormValid && (
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">Completion Required</span>
            )}
            {isFormValid && (
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">Ready to Generate</span>
            )}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Buyer */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Buyer Information</label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5 font-medium">Company Name</label>
                    <div className="relative">
                      <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Buyer Co. Ltd"
                        className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition shadow-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5 font-medium">Address</label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input value={buyerAddress} onChange={e => setBuyerAddress(e.target.value)} placeholder="123 Export Ave, City, Country"
                        className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Seller Information</label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5 font-medium">Company Name</label>
                    <div className="relative">
                      <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input value={sellerName} onChange={e => setSellerName(e.target.value)} placeholder="Your company name"
                        className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />
            
            {/* Product */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Product & Value</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="lg:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1.5 font-medium">Product Description</label>
                  <input value={productDesc} onChange={e => setProductDesc(e.target.value)} placeholder="e.g. Organic Grade A Shea Butter"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 font-medium">HS Code</label>
                  <div className="relative">
                    <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input value={hsCode} onChange={e => setHsCode(e.target.value)} placeholder="1515.90"
                      className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition shadow-sm" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 font-medium">Quantity (kg)</label>
                  <input value={quantity} onChange={e => setQuantity(e.target.value)} type="number" placeholder="500"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 font-medium">Total Value</label>
                  <input value={totalValue} onChange={e => setTotalValue(e.target.value)} type="number" placeholder="2500.00"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 font-medium">Currency</label>
                  <select value={currency} onChange={e => setCurrency(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition shadow-sm text-gray-700">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="GHS">GHS (GH₵)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 font-medium">Incoterms</label>
                  <select value={deliveryTerms} onChange={e => setDeliveryTerms(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition shadow-sm text-gray-700">
                    <option value="">Select Terms…</option>
                    <option value="FOB">FOB - Free on Board</option>
                    <option value="CIF">CIF - Cost, Insurance, Freight</option>
                    <option value="EXW">EXW - Ex Works</option>
                    <option value="DDP">DDP - Delivered Duty Paid</option>
                    <option value="CFR">CFR - Cost and Freight</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* Generation Actions (Left Side) */}
          <div className="space-y-6 flex flex-col h-full"> 
            {/* Operational Documents */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="flex flex-col bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-4">2. Generate Operational Documents</h2>
              
              <div className="mb-5">
                <button onClick={generateOperationalDocs} disabled={operationalGenerating || !isFormValid}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm py-2.5 rounded-xl transition-colors shadow-sm">
                  {operationalGenerating
                    ? <><Loader2 size={14} className="animate-spin" /> Generating Documents remotely…</>
                    : <><FileText size={15} /> Generate Standard Documents</>}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {docs.map(doc => <DocCard key={doc.id} doc={doc} onPreview={(d) => setPreviewDoc({ title: d.label, url: d.fileUrl || `/${d.fileName}` })} />)}
              </div>
            </motion.div>
            
            {/* AI Contract */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="flex flex-col bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-4">3. Generate AI Export Contract</h2>
              <button onClick={generateContract} disabled={contractStatus === "generating" || !isFormValid}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm py-2.5 rounded-xl transition-colors shadow-sm mb-3">
                {contractStatus === "generating"
                  ? <><Loader2 size={14} className="animate-spin" /> Requesting Lexi AI Contract…</>
                  : <><FilePenLine size={15} /> Generate Legal Contract</>}
              </button>
              
              {contractStatus === "idle" && (
                 <p className="text-[11px] text-gray-500 text-center">Your custom contract will be drafted by our AI service based on the transaction data.</p>
              )}
               {contractStatus === "ready" && (
                 <div className="border border-emerald-100 bg-emerald-50 rounded-xl p-4 flex flex-col items-center">
                    <CheckCircle2 size={24} className="text-emerald-500 mb-2" />
                    <p className="text-xs font-bold text-emerald-800 mb-3">Contract Ready</p>
                    <div className="flex w-full gap-2">
                       <button onClick={() => setPreviewDoc({ title: "AI Export Contract", url: contractPdfUrl })} className="flex-1 text-xs font-semibold py-2 bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 rounded-lg">
                         Preview
                       </button>
                       <button onClick={() => window.open(contractPdfUrl, "_blank")} className="flex-1 text-xs font-semibold py-2 text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg">
                         Download
                       </button>
                    </div>
                 </div>
              )}
            </motion.div>
          </div>

          {/* Combined Preview Screen (Right Side) */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className="flex flex-col h-full min-h-[600px]">
             <div className="flex-1 flex flex-col border border-gray-200 rounded-2xl overflow-hidden bg-gray-100 shadow-inner h-full">
                <div className="flex items-center justify-between p-3.5 border-b border-gray-200 bg-white">
                  <div className="flex items-center gap-2">
                    <Eye size={15} className="text-gray-600" />
                    <h3 className="text-xs font-bold text-gray-800 tracking-wide uppercase">
                      {previewDoc ? `${previewDoc.title} Viewer` : "Document Preview"}
                    </h3>
                  </div>
                  {previewDoc && (
                    <button onClick={() => setPreviewDoc(null)} className="text-[10px] font-bold tracking-wide text-gray-500 hover:text-gray-800 bg-gray-100 px-2 py-1 rounded">
                      Close Preview
                    </button>
                  )}
                </div>

                <div className="flex-1 p-0 relative flex flex-col h-full bg-slate-50">
                  <AnimatePresence mode="wait">
                    {previewDoc ? (
                      <motion.div key="shared-preview" className="flex-1 flex flex-col h-full"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <iframe 
                          key={previewDoc.url}
                          src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewDoc.url)}&embedded=true`}
                          title={previewDoc.title}
                          className="w-full flex-1 border-0 bg-white"
                        />
                        {previewDoc.title.includes("Contract") && generatedContractText && (
                            <details className="bg-white border-t border-gray-200 group relative z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                            <summary className="p-3 text-emerald-800 font-semibold cursor-pointer flex items-center justify-between text-xs list-none hover:bg-gray-50">
                                <span className="flex items-center gap-2">💡 Toggle AI Legal Review & Analysis</span>
                            </summary>
                            <div className="px-4 pb-4 pt-1 max-h-48 overflow-y-auto whitespace-pre-wrap text-[11px] text-emerald-700/90 leading-relaxed border-t border-gray-100">
                                {generatedContractText}
                            </div>
                            </details>
                        )}
                      </motion.div>
                    ) : (
                      <>
                        <motion.div key="idle" className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4 text-gray-300">
                            <Eye size={24} />
                          </div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Select a document to preview</p>
                          <p className="text-xs text-gray-500 max-w-[200px] leading-relaxed">Once you generate documents or contracts, click 'Preview' to view the PDF files rendered by the backend directly here.</p>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}