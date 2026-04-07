import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FileText, Download, Eye, CheckCircle2, Loader2, FileSignature, Building2, MapPin, Package, Hash } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { documentService } from "../services/documentService";
import Stepper from "../components/Stepper";

type DocStatus = "idle" | "generating" | "ready";

interface Doc {
  id: string;
  label: string;
  description: string;
  icon: typeof FileText;
  status: DocStatus;
  fileName: string;
}

const initDocs: Doc[] = [
  { id: "coo",     label: "Certificate of Origin",  description: "Official document certifying the country in which the goods were produced.", icon: FileText,       status: "idle", fileName: "certificate_of_origin.pdf" },
  { id: "invoice", label: "Commercial Invoice",      description: "Document specifying the value and nature of goods being exported.",           icon: FileText,       status: "idle", fileName: "commercial_invoice.pdf" },
  { id: "packing", label: "Packing List",            description: "Detailed list of the contents, quantities, and weights of each package.",      icon: Package,        status: "idle", fileName: "packing_list.pdf" },
];

function DocCard({ doc, onGenerate }: { doc: Doc; onGenerate: (id: string) => void }) {
  const Icon = doc.icon;
  return (
    <div className={`bg-white rounded-xl border p-5 transition-all ${doc.status === "ready" ? "border-teal-200" : "border-gray-200"}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${doc.status === "ready" ? "bg-teal-50" : "bg-gray-100"}`}>
          <Icon size={17} className={doc.status === "ready" ? "text-teal-600" : "text-gray-500"} />
        </div>
        {doc.status === "ready" && <CheckCircle2 size={16} className="text-teal-500" />}
      </div>
      <p className="text-sm font-bold text-gray-800 mb-1">{doc.label}</p>
      <p className="text-xs text-gray-400 leading-relaxed mb-4">{doc.description}</p>

      {doc.status === "idle" && (
        <button onClick={() => onGenerate(doc.id)}
          className="w-full text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 py-2 rounded-lg transition-colors">
          Generate
        </button>
      )}
      {doc.status === "generating" && (
        <div className="flex items-center justify-center gap-2 py-2">
          <Loader2 size={14} className="animate-spin text-teal-500" />
          <span className="text-xs text-teal-600 font-medium">Generating…</span>
        </div>
      )}
      {doc.status === "ready" && (
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg transition-colors">
            <Eye size={12} /> Preview
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 py-2 rounded-lg transition-colors">
            <Download size={12} /> Download
          </button>
        </div>
      )}
    </div>
  );
}

export default function DocumentsPage() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id") || "1";
  const [docs, setDocs] = useState(initDocs);
  const [contractStatus, setContractStatus] = useState<DocStatus>("idle");
  const [generatedContractText, setGeneratedContractText] = useState("");
  const [contractPdfUrl, setContractPdfUrl] = useState("");

  // Contract form state
  const [buyerName, setBuyerName]       = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [sellerName, setSellerName]     = useState("");
  const [productDesc, setProductDesc]   = useState("");
  const [quantity, setQuantity]         = useState("");
  const [hsCode, setHsCode]             = useState("");
  const [totalValue, setTotalValue]     = useState("");
  const [currency, setCurrency]         = useState("USD");
  const [deliveryTerms, setDeliveryTerms] = useState("");

  const generate = async (id: string) => {
    setDocs(d => d.map(doc => doc.id === id ? { ...doc, status: "generating" } : doc));
    try {
      await documentService.generateOperationalDocs({
        product_id: Number(productId),
        consignee_name: buyerName || "Consignee Name",
        consignee_address: buyerAddress || "Consignee Address",
        product_details: {
          quantity: Number(quantity) || 0,
          unit_price: Number(totalValue) / (Number(quantity) || 1),
          net_weight: Number(quantity) || 0,
          gross_weight: (Number(quantity) || 0) * 1.1,
        },
        currency: currency,
        incoterms: deliveryTerms,
      });
      setDocs(d => d.map(doc => doc.id === id ? { ...doc, status: "ready" } : doc));
    } catch (error) {
      console.error("Failed to generate document", error);
      setDocs(d => d.map(doc => doc.id === id ? { ...doc, status: "idle" } : doc));
    }
  };

  const generateContract = async () => {
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
    } catch (error) {
      console.error("Failed to generate contract", error);
      setContractStatus("idle");
    }
  };

  const allDocsReady = docs.every(d => d.status === "ready");

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 pb-12">
      <Stepper currentStep={4} />
      
      <div className="px-8 space-y-6">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Documents</p>
        <h1 className="text-2xl font-bold text-gray-900">Export Documents</h1>
        <p className="text-sm text-gray-500 mt-1">Generate and download all required export documents.</p>
      </div>

      {/* Export Documents */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-800">Export Documents</h2>
          {allDocsReady && (
            <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
              <Download size={13} /> Download All
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {docs.map(doc => <DocCard key={doc.id} doc={doc} onGenerate={generate} />)}
        </div>
      </motion.div>

      {/* Contract Section */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
        <h2 className="text-sm font-bold text-gray-800 mb-3">Export Contract</h2>

        <div className="grid grid-cols-2 gap-5">
          {/* Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <FileSignature size={17} className="text-teal-600" />
              <h3 className="text-sm font-bold text-gray-800">Contract Details</h3>
            </div>

            <div className="space-y-4">
              {/* Buyer */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Buyer</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">Company Name</label>
                    <div className="relative">
                      <Building2 size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Buyer Co. Ltd"
                        className="w-full text-xs border border-gray-200 rounded-lg pl-8 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300 transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">Address</label>
                    <div className="relative">
                      <MapPin size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input value={buyerAddress} onChange={e => setBuyerAddress(e.target.value)} placeholder="City, Country"
                        className="w-full text-xs border border-gray-200 rounded-lg pl-8 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300 transition" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Seller</label>
                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-medium">Company Name</label>
                  <div className="relative">
                    <Building2 size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input value={sellerName} onChange={e => setSellerName(e.target.value)} placeholder="Your company name"
                      className="w-full text-xs border border-gray-200 rounded-lg pl-8 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300 transition" />
                  </div>
                </div>
              </div>

              {/* Product */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Product</label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">Description</label>
                    <input value={productDesc} onChange={e => setProductDesc(e.target.value)} placeholder="e.g. Dried Fruits"
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300 transition" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">HS Code</label>
                    <div className="relative">
                      <Hash size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input value={hsCode} onChange={e => setHsCode(e.target.value)} placeholder="0813.40"
                        className="w-full text-xs border border-gray-200 rounded-lg pl-8 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300 transition" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">Quantity (kg)</label>
                    <input value={quantity} onChange={e => setQuantity(e.target.value)} type="number" placeholder="0"
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300 transition" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">Total Value</label>
                    <input value={totalValue} onChange={e => setTotalValue(e.target.value)} type="number" placeholder="0.00"
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300 transition" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">Currency</label>
                    <select value={currency} onChange={e => setCurrency(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300 transition text-gray-600">
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="GHS">GHS</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Delivery terms */}
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Delivery Terms (Incoterms)</label>
                <select value={deliveryTerms} onChange={e => setDeliveryTerms(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300 transition text-gray-600">
                  <option value="">Select Incoterms…</option>
                  <option value="FOB">FOB – Free on Board</option>
                  <option value="CIF">CIF – Cost, Insurance & Freight</option>
                  <option value="EXW">EXW – Ex Works</option>
                  <option value="DDP">DDP – Delivered Duty Paid</option>
                  <option value="CFR">CFR – Cost and Freight</option>
                </select>
              </div>
            </div>

            <button onClick={generateContract} disabled={contractStatus === "generating" || !buyerName || !sellerName || !buyerAddress || !quantity || !totalValue || !deliveryTerms}
              className="mt-5 w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm py-2.5 rounded-lg transition-colors">
              {contractStatus === "generating"
                ? <><Loader2 size={14} className="animate-spin" /> Generating Contract…</>
                : <><FileSignature size={14} /> Generate Contract</>}
            </button>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-5">
              <Eye size={17} className="text-teal-600" />
              <h3 className="text-sm font-bold text-gray-800">Contract Preview</h3>
            </div>

            <AnimatePresence mode="wait">
              {contractStatus === "idle" && (
                <motion.div key="idle" className="flex-1 flex flex-col items-center justify-center text-center"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                    <FileSignature size={26} className="text-gray-300" />
                  </div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">No contract yet</p>
                  <p className="text-xs text-gray-400">Fill in the form and generate your contract to see a preview here.</p>
                </motion.div>
              )}

              {contractStatus === "generating" && (
                <motion.div key="gen" className="flex-1 flex flex-col items-center justify-center gap-3"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Loader2 size={28} className="animate-spin text-teal-500" />
                  <p className="text-sm text-gray-500 font-medium">Building your contract…</p>
                </motion.div>
              )}

              {contractStatus === "ready" && (
                <motion.div key="preview" className="flex-1 flex flex-col"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 p-5 font-mono text-[10px] text-gray-600 leading-relaxed overflow-auto mb-4">
                    {contractPdfUrl ? (
                      <div className="flex flex-col h-full space-y-4">
                        <iframe 
                          src={`https://docs.google.com/viewer?url=${encodeURIComponent(contractPdfUrl)}&embedded=true`}
                          title="Contract Preview" 
                          className="w-full h-[550px] shadow-sm rounded-lg"
                        />
                        {generatedContractText && (
                          <details className="bg-teal-50 rounded-lg border border-teal-100 group">
                            <summary className="p-3 text-teal-800 font-semibold font-sans cursor-pointer flex items-center justify-between text-xs list-none">
                              <span className="flex items-center gap-2">💡 AI Legal Review & Analysis</span>
                              <span className="text-teal-600 font-normal text-[10px] group-open:hidden underline decoration-teal-200 underline-offset-2">Read summary</span>
                            </summary>
                            <div className="px-4 pb-4 pt-1 max-h-48 overflow-y-auto whitespace-pre-wrap font-sans text-[11px] text-teal-700 leading-relaxed border-t border-teal-100/50">
                              {generatedContractText}
                            </div>
                          </details>
                        )}
                      </div>
                    ) : (
                      <>
                        <p className="font-bold text-gray-800 text-xs mb-3 non-mono font-sans">EXPORT CONTRACT AGREEMENT</p>
                        <p className="mb-2"><span className="text-gray-400">Date:</span> {new Date().toLocaleDateString()}</p>
                        <p className="mb-3"><span className="text-gray-400">Ref:</span> EG-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
                        <p className="mb-1"><span className="text-gray-400">SELLER:</span> {sellerName || "—"}</p>
                        <p className="mb-3"><span className="text-gray-400">BUYER:</span> {buyerName || "—"} | {buyerAddress || "—"}</p>
                        <p className="text-gray-400 mb-1">GOODS:</p>
                        <p className="mb-1">Product: {productDesc || "—"}</p>
                        <p className="mb-1">HS Code: {hsCode || "—"}</p>
                        <p className="mb-1">Quantity: {quantity || "—"} kg</p>
                        <p className="mb-3">Value: {currency} {totalValue || "—"}</p>
                        <p className="text-gray-400 mb-1">TERMS:</p>
                        <p className="mb-3">Delivery: {deliveryTerms || "—"}</p>
                      </>
                    )}
                    <p className="text-gray-400 text-[9px] mt-4 leading-relaxed font-sans">
                      This contract is legally binding upon signatures of both parties. Drafted by Lexi AI.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => contractPdfUrl && window.open(contractPdfUrl, "_blank")}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 py-2.5 rounded-lg transition-colors">
                      <Eye size={13} /> Full Preview
                    </button>
                    <button 
                      onClick={() => contractPdfUrl && window.open(contractPdfUrl, "_blank")}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 py-2.5 rounded-lg transition-colors">
                      <Download size={13} /> Download PDF
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        </motion.div>
      </div>
    </main>
  );
}