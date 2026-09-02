import React from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface TransformButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const TransformButton: React.FC<TransformButtonProps> = ({
  onClick,
  isLoading,
  disabled,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-all duration-200 shadow-md ${
        isLoading
          ? "bg-blue-500 text-white cursor-wait opacity-90 shadow-none"
          : disabled
          ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.99] cursor-pointer"
      }`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-white" />
          <span>Transforming document...</span>
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>Transform Content</span>
        </>
      )}
    </button>
  );
};
