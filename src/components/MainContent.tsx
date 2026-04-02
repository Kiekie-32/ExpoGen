import { Flag, Ban, Handshake, FileText, Zap, ArrowRight } from "lucide-react";
import{useNavigate} from 'react-router-dom';

export default function MainContent() {
  const navigate = useNavigate();
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
<div className="flex gap-6 mb-6">

  {/* LEFT: Total Readiness card */}
  <div className="w-64 shrink-0 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
    <p className="text-base font-semibold text-gray-700 mb-4">Total Readiness</p>
    <p className="text-xs text-gray-500 leading-relaxed">
      Your project is currently in the initial setup phase. Complete FDA registration to advance.
    </p>
  </div>

  {/* RIGHT: Priority Action card */}
  <div className="flex-1 bg-[#0f2d4a] rounded-2xl p-8 flex flex-col justify-between">
   
    <div className="flex items-center gap-2 mb-3">
      <Zap size={14} className="text-teal-400" />
      <span className="text-xs font-semibold uppercase tracking-widest text-teal-400">
        Priority Action
      </span>
    </div>

    <h3 className="text-2xl font-bold text-white mb-3">
      Next Step: Register with FDA Ghana.
    </h3>

    <p className="text-gray-300 text-sm leading-relaxed mb-8">
      This is required for your product sector. Mandatory certification must be
      obtained before any shipping documents can be generated.
    </p>
    <div className="flex items-center gap-4">
      <button className="flex items-center gap-2 bg-teal-400 hover:bg-teal-300 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors">
        Start Task <ArrowRight size={16} />
      </button>
      <button className="text-white text-sm font-medium border border-white/30 hover:border-white/60 px-5 py-2.5 rounded-lg transition-colors">
        View Guide
      </button>
    </div>

  </div>

</div>

    <div className="px-8 pt-6 gap-2">
      <button
        onClick={() => navigate("/product")} className="flex items-center gap-2 bg-teal-300 hover:bg-teal-200 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors shadow-sm">
        <Zap size={16} />
        Start Export
      </button>
    </div>

      {/*Four flex cards below */}
      <div className="flex gap-4">
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
              <Flag size={16} className="text-gray-600" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
              In Review
            </span>
          </div>
          <p className="text-sm font-bold text-gray-900 mb-1">
            Ghana Compliance
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Regulatory framework verification for local standards.
          </p>
        </div>

        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
              <Ban size={16} className="text-gray-600" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-red-100 text-red-600">
              Blocked
            </span>
          </div>
          <p className="text-sm font-bold text-gray-900 mb-1">
            Destination Compliance
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Missing FDA registration for target jurisdiction.
          </p>
        </div>

        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
              <Handshake size={16} className="text-gray-600" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
              Pending
            </span>
          </div>
          <p className="text-sm font-bold text-gray-900 mb-1">
            Trade Agreements
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Evaluating AfCFTA eligibility for tax exemptions.
          </p>
        </div>

        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
              <FileText size={16} className="text-gray-600" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
              Pending
            </span>
          </div>
          <p className="text-sm font-bold text-gray-900 mb-1">Documentation</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Certificate of Origin and Packing List draft required.
          </p>
        </div>
      </div>
    </main>
  );
}
