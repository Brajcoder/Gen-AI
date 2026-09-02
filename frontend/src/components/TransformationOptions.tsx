import React from "react";
import type { Length, OutputType, Tone, TransformOptions } from "../types/api";
import { FileText, BookOpen, Share2, Camera, Mail } from "lucide-react";

interface TransformationOptionsProps {
  options: TransformOptions;
  onChange: (options: TransformOptions) => void;
  disabled?: boolean;
}

const OUTPUT_TYPES: { id: OutputType; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: "summary",
    label: "Summary",
    description: "Key points & executive summary",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "blog",
    label: "Blog Post",
    description: "Structured article with headers",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    id: "linkedin",
    label: "LinkedIn Post",
    description: "Professional social copy & tags",
    icon: <Share2 className="h-4 w-4" />,
  },
  {
    id: "instagram",
    label: "Instagram Caption",
    description: "Engaging post copy & emojis",
    icon: <Camera className="h-4 w-4" />,
  },
  {
    id: "email",
    label: "Email",
    description: "Formatted subject & body",
    icon: <Mail className="h-4 w-4" />,
  },
];

const TONES: { id: Tone; label: string }[] = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual" },
  { id: "academic", label: "Academic" },
  { id: "friendly", label: "Friendly" },
  { id: "marketing", label: "Marketing" },
];

const LENGTHS: { id: Length; label: string }[] = [
  { id: "short", label: "Short" },
  { id: "medium", label: "Medium" },
  { id: "long", label: "Long" },
];

const LANGUAGES = [
  { id: "English", label: "English" },
  { id: "Hindi", label: "Hindi" },
  { id: "Hinglish", label: "Hinglish" },
];

export const TransformationOptions: React.FC<TransformationOptionsProps> = ({
  options,
  onChange,
  disabled = false,
}) => {
  const updateOption = <K extends keyof TransformOptions>(key: K, value: TransformOptions[K]) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="space-y-5">
      {/* Output Format */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-800">
          Output Format
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {OUTPUT_TYPES.map((type) => {
            const isSelected = options.outputType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                disabled={disabled}
                onClick={() => updateOption("outputType", type.id)}
                className={`flex items-start space-x-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 text-slate-900 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:bg-slate-50/50"
                } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div
                  className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                    isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {type.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900">{type.label}</div>
                  <div className="text-[11px] text-slate-500 font-medium truncate">
                    {type.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tone & Length in Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tone Selector */}
        <div className="space-y-1.5">
          <label htmlFor="tone-select" className="block text-sm font-semibold text-slate-800">
            Tone
          </label>
          <select
            id="tone-select"
            value={options.tone}
            disabled={disabled}
            onChange={(e) => updateOption("tone", e.target.value as Tone)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all disabled:opacity-60"
          >
            {TONES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Length Selector */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-800">
            Length
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            {LENGTHS.map((l) => {
              const isSelected = options.length === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => updateOption("length", l.id)}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isSelected
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {l.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <div className="space-y-1.5">
        <label htmlFor="language-select" className="block text-sm font-semibold text-slate-800">
          Target Language
        </label>
        <select
          id="language-select"
          value={options.language}
          disabled={disabled}
          onChange={(e) => updateOption("language", e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all disabled:opacity-60"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
