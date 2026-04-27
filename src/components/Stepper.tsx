import { Check } from "lucide-react";
import { motion } from "motion/react";

interface Step {
  id: number;
  label: string;
  href: string;
}

const steps: Step[] = [
  { id: 1, label: "Prod. Setup", href: "/product" },
  { id: 2, label: "Compliance", href: "/compliance" },
  { id: 3, label: "Readiness", href: "/readiness" },
  { id: 4, label: "Documents", href: "/documents" },
  { id: 5, label: "AI Generator", href: "/ai" },
];

interface StepperProps {
  currentStep: number;
}

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="w-full py-6 md:py-10 px-2 sm:px-4 md:px-8 bg-white border-b border-gray-100 mb-4 md:mb-6">
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between relative px-4">
        {/* Background Line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-100 -translate-y-1/2 z-0" />

        {/* Progress Line */}
        <motion.div
          className="absolute top-1/2 left-4 h-0.5 bg-teal-500 -translate-y-1/2 z-0"
          initial={{ width: 0 }}
          animate={{
            width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 2rem)`,
          }}
          style={{ left: "1rem", right: "1rem" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  isCompleted
                    ? "bg-teal-500 border-teal-500"
                    : isActive
                      ? "bg-white border-teal-500 shadow-[0_0_0_4px_rgba(20,184,166,0.1)]"
                      : "bg-white border-gray-200"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                ) : (
                  <span
                    className={`text-[10px] sm:text-xs font-bold ${isActive ? "text-teal-600" : "text-gray-400"}`}
                  >
                    {step.id}
                  </span>
                )}
              </div>
              <span
                className={`absolute top-8 sm:top-10 w-16 sm:w-20 md:w-24 text-center text-[7px] min-[400px]:text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors leading-tight ${
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
