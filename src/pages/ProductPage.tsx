import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Package,
  FileText,
  Globe,
  PackageOpen,
  Loader2,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { hsCodeService } from "../services/hsCodeService";
import type { HSSuggestion } from "../services/hsCodeService";
import { productService } from "../services/productService";
import Stepper from "../components/Stepper";
import { useAuth } from "../context/AuthContext";

export default function ProductPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const { user, addProductToUser } = useAuth();

  const [productName, setProductName] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [description, setDescription] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<HSSuggestion[]>([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;

      setIsLoading(true);
      try {
        // Try to get from localStorage first (as a cache/fallback)
        const cachedProduct = localStorage.getItem(`product_${productId}`);
        if (cachedProduct) {
          const product = JSON.parse(cachedProduct);
          setProductName(product.product_name || "");
          setDescription(product.description || "");
          setHsCode(product.selected_hs_code || "");
          setDestinationCountry(product.destination_country || "");
          setIsLoading(false);
          return;
        }

        // If not in cache, try the API (in case the endpoint exists now)
        try {
          const product = await productService.getById(Number(productId));
          if (product) {
            setProductName(product.product_name || "");
            setDescription(product.description || "");
            setHsCode(product.selected_hs_code || "");
            setDestinationCountry(product.destination_country || "");
          }
        } catch (apiError) {
          // Silence the 404 log since we rely on localStorage cache
          console.log("Product not found in backend, using local cache.");
        }
      } catch (error) {
        console.error("Failed to fetch product details", error);
        // If API fails (404), we still have the empty form or whatever was in state
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleHSLookup = async () => {
    if (!productName) return;
    setIsSearching(true);
    setSuggestions([]);
    try {
      const results = await hsCodeService.search(productName);
      console.log("HS suggestions received:", results); // Help identify correct property names
      setSuggestions(results);
    } catch (error) {
      console.error("Failed to search HS codes", error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectHSCode = (code: string) => {
    setHsCode(code);
    setSuggestions([]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const product = await productService.create({
        user_id: user?.id || 1, // Use logged-in user ID or fallback to 1
        product_name: productName,
        description: description,
        selected_hs_code: hsCode,
        destination_country: destinationCountry,
      });
      console.log("Product created:", product);

      // Add to user profile
      if (product.id) {
        addProductToUser(product.id);
      }

      // Save to localStorage so we can retrieve it even if GET /products/{id} 404s
      localStorage.setItem(`product_${product.id}`, JSON.stringify(product));

      navigate(
        `/compliance?id=${product.id}&hs_code=${product.selected_hs_code}`,
      );
    } catch (error) {
      console.error("Failed to save product", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={30} className="animate-spin text-teal-600" />
          <p className="text-sm font-medium text-gray-500">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 pb-12">
      <Stepper currentStep={1} />

      <div className="px-4 md:px-8">
        {/*Back button */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={16} /> Back To Dashboard
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
              Product Status: Draft
            </p>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-teal-600">
              Add Product Name/ HS code
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
          <div className="flex flex-col gap-6 md:gap-8">
            <motion.div
              className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 md:p-10 lg:p-12"
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
                  value={hsCode}
                  onChange={(e) => setHsCode(e.target.value)}
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
              className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
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
          <div className="flex flex-col gap-6">
            <motion.div
              className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Globe size={16} className="text-teal-600" />
                <h2 className="text-sm font-bold text-gray-800">
                  Customs & Compliance Data
                </h2>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  HS Code (Harmonized System)
                </label>
                {/* flex row on larger screens, column on mobile */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={hsCode}
                    onChange={(e) => setHsCode(e.target.value)}
                    placeholder="Search HS code..."
                    className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
                  />
                  <button
                    onClick={handleHSLookup}
                    disabled={isSearching}
                    className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0"
                  >
                    {isSearching ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Search size={13} />
                    )}
                    AI Lookup
                  </button>
                </div>

                {/* Suggestions List */}
                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 border border-teal-100 rounded-xl bg-teal-50/30 overflow-hidden"
                    >
                      <div className="p-3 border-b border-teal-100 flex items-center gap-2">
                        <Info size={12} className="text-teal-600" />
                        <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                          AI Suggestions
                        </span>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() =>
                              selectHSCode(s.code || s.hs_code || "")
                            }
                            className="w-full text-left p-3 hover:bg-white transition-colors border-b border-teal-50 last:border-0 group"
                          >
                            <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                              <span className="text-xs font-bold text-teal-700 break-all">
                                {s.code || s.hs_code}
                              </span>
                              <span className="text-[10px] font-bold text-teal-500 bg-teal-100 px-1.5 py-0.5 rounded uppercase whitespace-nowrap">
                                {s.relevance || 0}% Match
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-600 leading-snug group-hover:text-gray-900">
                              {s.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-5 p-4 bg-teal-50 rounded-xl border border-teal-100">
                  <div className="flex gap-3">
                    <Info size={16} className="text-teal-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-teal-800 mb-1">
                        Why use AI Lookup?
                      </p>
                      <p className="text-[11px] text-teal-700/80 leading-relaxed">
                        Our AI analyzes your product name and description to
                        find the most accurate HS code, ensuring compliant
                        documentation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <FileText size={16} className="text-teal-600" />
                <h2 className="text-sm font-bold text-gray-800">
                  Target Market
                </h2>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Destination Country
                </label>
                <select
                  value={destinationCountry}
                  onChange={(e) => setDestinationCountry(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300 transition text-gray-600"
                >
                  <option value="">Select country...</option>
                  <option value="UK">United Kingdom (GB)</option>
                  <option value="US">United States (US)</option>
                  <option value="EU">European Union (EU)</option>
                  <option value="NG">Nigeria (NG)</option>
                </select>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto min-w-[160px] justify-center bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving && <Loader2 size={13} className="animate-spin" />}
            Save & Continue
          </button>
        </div>
      </div>
    </main>
  );
}
