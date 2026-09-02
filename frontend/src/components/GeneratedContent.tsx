import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { TransformResultData } from "../types/api";
import {
  Copy,
  Check,
  RotateCcw,
  FileText,
  Sparkles,
  Bot,
  Layers,
} from "lucide-react";

interface GeneratedContentProps {
  data: TransformResultData | null;
  isLoading: boolean;
  onReset: () => void;
}

export const GeneratedContent: React.FC<GeneratedContentProps> = ({
  data,
  isLoading,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!data?.content) return;
    try {
      await navigator.clipboard.writeText(data.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy content", err);
    }
  };

  // Skeleton loading view
  if (isLoading) {
    return (
      <div className="h-full border border-slate-200 rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between min-h-[460px]">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-24 bg-slate-200 rounded-md animate-pulse"></div>
              <div className="h-5 w-16 bg-slate-100 rounded-md animate-pulse"></div>
            </div>
            <div className="h-5 w-28 bg-slate-100 rounded-full animate-pulse"></div>
          </div>

          <div className="space-y-4">
            <div className="h-6 w-3/4 bg-slate-200 rounded-md animate-pulse"></div>
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full bg-slate-100 rounded-md animate-pulse"></div>
              <div className="h-4 w-11/12 bg-slate-100 rounded-md animate-pulse"></div>
              <div className="h-4 w-4/5 bg-slate-100 rounded-md animate-pulse"></div>
            </div>
            <div className="space-y-2 pt-4">
              <div className="h-4 w-full bg-slate-100 rounded-md animate-pulse"></div>
              <div className="h-4 w-9/12 bg-slate-100 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-center space-x-2 text-xs text-blue-600 font-semibold">
          <Sparkles className="h-4 w-4 animate-spin" />
          <span>Transforming document using Gemini 3.6 Flash...</span>
        </div>
      </div>
    );
  }

  // Empty state view
  if (!data) {
    return (
      <div className="h-full border border-slate-200 rounded-2xl bg-slate-50/50 p-8 text-center flex flex-col items-center justify-center min-h-[460px] border-dashed">
        <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 mb-4 shadow-sm">
          <FileText className="h-8 w-8 text-slate-300" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          Your transformed content will appear here
        </h3>
        <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
          Upload a document and choose your preferred output format to generate AI-powered insights, blogs, or emails.
        </p>

        <div className="mt-6 flex items-center space-x-4 text-[11px] text-slate-400 font-medium">
          <span className="flex items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300 mr-1.5"></span>
            PDF Text Extraction
          </span>
          <span className="flex items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300 mr-1.5"></span>
            Gemini 3.6 Flash AI
          </span>
        </div>
      </div>
    );
  }

  // Success result view
  return (
    <div className="h-full border border-slate-200 rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between min-h-[460px]">
      <div>
        {/* Success Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
              {data.output_type}
            </span>
            <span className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
              <Check className="h-3 w-3 mr-1" /> Complete
            </span>
          </div>

          {/* Document Details Metadata */}
          <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium">
            <div className="flex items-center space-x-1">
              <FileText className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold text-slate-700 max-w-[140px] truncate" title={data.filename}>
                {data.filename}
              </span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Layers className="h-3.5 w-3.5 text-slate-400" />
              <span>{data.page_count} {data.page_count === 1 ? "page" : "pages"}</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1 text-indigo-600 font-semibold">
              <Bot className="h-3.5 w-3.5" />
              <span>{data.model}</span>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="prose prose-slate prose-sm max-w-none text-slate-800 leading-relaxed overflow-y-auto max-h-[500px] pr-2">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-lg font-bold text-slate-900 border-b pb-2 mb-3 mt-1">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-base font-bold text-slate-900 mt-4 mb-2">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-semibold text-slate-800 mt-3 mb-1.5">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 space-y-1 my-2 text-sm text-slate-700">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-5 space-y-1 my-2 text-sm text-slate-700">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="leading-normal">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-3 py-1 bg-blue-50/40 my-3 text-slate-700 italic rounded-r-md">
                  {children}
                </blockquote>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-slate-900">{children}</strong>
              ),
            }}
          >
            {data.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-3 mt-6">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Start New Transformation</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 shadow-xs ${
            copied
              ? "bg-emerald-600 text-white"
              : "bg-slate-900 hover:bg-slate-800 text-white"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy Content</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
