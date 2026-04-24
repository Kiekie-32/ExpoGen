import { Check } from "lucide-react";
import { motion } from "motion/react";

interface Step {
  id: number;
  label: string;
  href: string;
}

const steps: Step[] = [
  { id: 1, label: "Product Setup", href: "/product" },
  { id: 2, label: "Compliance", href: "/compliance" },
  { id: 3, label: "Readiness Score", href: "/readiness" },
  { id: 4, label: "Documents", href: "/documents" },
  { id: 5, label: "AI Generator", href: "/ai" },
];

interface StepperProps {
  currentStep: number;
}

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="w-full py-6 px-8 bg-white border-b border-gray-100 mb-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />

        {/* Progress Line */}
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-teal-500 -translate-y-1/2 z-0"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center group"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  isCompleted
                    ? "bg-teal-500 border-teal-500"
                    : isActive
                      ? "bg-white border-teal-500 shadow-[0_0_0_4px_rgba(20,184,166,0.1)]"
                      : "bg-white border-gray-200"
                }`}
              >
                {isCompleted ? (
                  <Check size={14} className="text-white" />
                ) : (
                  <span
                    className={`text-xs font-bold ${isActive ? "text-teal-600" : "text-gray-400"}`}
                  >
                    {step.id}
                  </span>
                )}
              </div>
              <span
                className={`absolute top-10 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-teal-600"
                    : isCompleted
                      ? "text-gray-500"
                      : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
