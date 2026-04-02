import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {ArrowLeft, Search, CheckCircle, Package, FileText, Globe, PackageOpen} from "lucide-react";
import { motion } from "motion/react";

export default function ProductPage() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [description, setDescription] = useState("");
  const [customsDescription, setCustomsDescription] = useState("");

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
      {/*Back button */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-sm text-gray-500 hover-gray-400 transition-colors"
        >
          <ArrowLeft size={16} /> Back To Dashboard
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Product Status: Draft
          </p>
          <h1 className="text-2xl font-bold text-teal-600">
            Add Product Name/ HS code
          </h1>
        </div>
        <button className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
          Save
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-8">
          <motion.div
            className="bg-white rounded-2xl border border-gray-200 p-12"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Package size={24} className="text-teal-600" />
              <h2 className="text-sm font-bold text-gray-800">
                Core Product Information
              </h2>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Product Name
              </label>
              {/* value ties the input to state. onChange updates state on every keystroke */}
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g: Dried Fruits"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                HS code
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="eg.081340"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Commercial Description
              </label>
              {/* textarea for multi-line text. rows controls default height */}
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Fruits dehydrated to remove water content"
                rows={4}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300 transition resize-none"
              />
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl border border-gray-200 p-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <PackageOpen size={24} className="text-teal-600" />
              <h2 className="text-sm font-bold text-gray-800">
                Packaging & Shipping
              </h2>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/*RIGHT COLUMN */}
        <div className='flex flex-col gap-6'>
            <motion.div className="bg-white rounded-2xl border border-gray-200 p-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}>
                <div className="flex items-center gap-2 mb-5">
                    <Globe size={16} className="text-teal-600" />
                    <h2 className="text-sm font-bold text-gray-800">Customs & Compliance Data</h2>
                </div>
                <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">HS Code (Harmonized System)</label>
                    {/* flex row: input grows, button stays fixed width */}
                    <div className="flex gap-2">
                    <input
                        type="text"
                        value={hsCode}
                        onChange={(e) => setHsCode(e.target.value)}
                        placeholder="e.g. 6203.42.1000"
                        className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300 transition"/>
                    <button className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors">
                        <Search size={13} />
                        HS Lookup
                    </button>
                </div>
                {/* Valid code indicator — only shows when hsCode has a value */}
                {hsCode && (
                    <div className="flex items-center gap-1 mt-1.5">
                        <CheckCircle size={12} className="text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Valid Code</span>
                    </div>
                )}
                </div>
                
                <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Country of Origin</label>
                    {/* select = dropdown. The first option is a placeholder */}
                    <select className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300 transition text-gray-600">
                        <option value="">Select country...</option>
                        <option value="GH">Ghana</option>
                        <option value="NG">Nigeria</option>
                        <option value="KE">Kenya</option>
                        <option value="ZA">South Africa</option>
                        <option value="US">United States</option>
                        <option value="CN">China</option>
                    </select>
                </div>
            </motion.div>
        </div>
      </div>
    </main>
  );
}
