import React from "react";
import { Sparkles, Cpu } from "lucide-react";

interface HeaderProps {
  isBackendConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isBackendConnected = true }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                GenAI-Transform
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                MVP v0.1
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Turn one document into powerful, ready-to-use content.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200/80">
            <Cpu className="h-4 w-4 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-700">
              Gemini 3.6 Flash
            </span>
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  isBackendConnected ? "bg-emerald-400 opacity-75" : "bg-amber-400 opacity-75"
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isBackendConnected ? "bg-emerald-500" : "bg-amber-500"
                }`}
              ></span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
