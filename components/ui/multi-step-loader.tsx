// import React from "react";

// interface Step {
//   title: string;
//   description: string;
// }

// interface MultiStepLoaderProps {
//   steps: Step[];
//   currentStep: number;
// }

// export function MultiStepLoader({ steps, currentStep }: MultiStepLoaderProps) {
//   return (
//     <div className="w-full max-w-3xl mx-auto px-4 py-16">
//       <div className="space-y-8">
//         <div className="relative">
//           {/* Progress bar */}
//           <div className="absolute left-0 top-1/2 h-0.5 w-full bg-muted transform -translate-y-1/2">
//             <div
//               className="absolute left-0 top-0 h-full bg-primary transition-all duration-500"
//               style={{
//                 width: `${(currentStep / (steps.length - 1)) * 100}%`,
//               }}
//             />
//           </div>

//           {/* Steps */}
//           <div className="relative flex justify-between">
//             {steps.map((step, index) => (
//               <div
//                 key={step.title}
//                 className="flex flex-col items-center space-y-2"
//               >
//                 {/* Step circle */}
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-200 ${
//                     index <= currentStep
//                       ? "border-primary bg-primary text-white"
//                       : "border-muted bg-background"
//                   }`}
//                 >
//                   {index + 1}
//                 </div>

//                 {/* Step title */}
//                 <div className="text-sm font-medium text-center">
//                   {step.title}
//                 </div>

//                 {/* Step description */}
//                 <div className="text-xs text-muted-foreground text-center w-24">
//                   {step.description}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Loading animation */}
//         <div className="flex justify-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
//         </div>

//         {/* Current step info */}
//         <div className="text-center space-y-2">
//           <h3 className="text-lg font-semibold">
//             {steps[currentStep].title}
//           </h3>
//           <p className="text-sm text-muted-foreground">
//             {steps[currentStep].description}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

const CheckIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn("w-6 h-6 ", className)}
    >
      <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
};

const CheckFilled = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-6 h-6 ", className)}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

type LoadingState = {
  text: string;
};

const LoaderCore = ({
  loadingStates,
  value = 0,
}: {
  loadingStates: LoadingState[];
  value?: number;
}) => {
  return (
    <div className="flex relative justify-start max-w-xl mx-auto flex-col mt-40">
      {loadingStates.map((loadingState, index) => {
        const distance = Math.abs(index - value);
        const opacity = Math.max(1 - distance * 0.2, 0); // Minimum opacity is 0, keep it 0.2 if you're sane.

        return (
          <motion.div
            key={index}
            className={cn("text-left flex gap-2 mb-4")}
            initial={{ opacity: 0, y: -(value * 40) }}
            animate={{ opacity: opacity, y: -(value * 40) }}
            transition={{ duration: 0.5 }}
          >
            <div>
              {index > value && (
                <CheckIcon className="text-black dark:text-white" />
              )}
              {index <= value && (
                <CheckFilled
                  className={cn(
                    "text-black dark:text-white",
                    value === index &&
                      "text-black dark:text-lime-500 opacity-100"
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "text-black dark:text-white",
                value === index && "text-black dark:text-lime-500 opacity-100"
              )}
            >
              {loadingState.text}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export const MultiStepLoader = ({
  loadingStates,
  loading,
  duration = 500,
  loop = true,
}: {
  loadingStates: LoadingState[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
}) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentState((prevState) =>
        loop
          ? prevState === loadingStates.length - 1
            ? 0
            : prevState + 1
          : Math.min(prevState + 1, loadingStates.length - 1)
      );
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration]);
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-2xl"
        >
          <div className="h-96  relative">
            <LoaderCore value={currentState} loadingStates={loadingStates} />
          </div>

          <div className="bg-gradient-to-t inset-x-0 z-20 bottom-0 bg-white dark:bg-black h-full absolute [mask-image:radial-gradient(900px_at_center,transparent_30%,white)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
