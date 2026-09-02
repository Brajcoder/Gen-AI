import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { FileUploader } from "./components/FileUploader";
import { TransformationOptions } from "./components/TransformationOptions";
import { TransformButton } from "./components/TransformButton";
import { GeneratedContent } from "./components/GeneratedContent";
import type { TransformOptions, TransformResultData } from "./types/api";
import { checkApiHealth, transformDocument } from "./services/api";
import { AlertTriangle, Sparkles, ShieldCheck } from "lucide-react";

export const App: React.FC = () => {
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultData, setResultData] = useState<TransformResultData | null>(null);

  const [options, setOptions] = useState<TransformOptions>({
    outputType: "summary",
    tone: "professional",
    length: "medium",
    language: "English",
  });

  // Check API health on load
  useEffect(() => {
    const verifyBackend = async () => {
      const isHealthy = await checkApiHealth();
      setIsBackendConnected(isHealthy);
    };
    verifyBackend();
  }, []);

  const handleTransform = async () => {
    if (!selectedFile) {
      setFileError("Please upload a PDF document before transforming.");
      return;
    }

    setError(null);
    setFileError(null);
    setIsLoading(true);

    try {
      const response = await transformDocument(selectedFile, options);
      if (response.success && response.data) {
        setResultData(response.data);
      } else {
        throw new Error("Invalid response format from server.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to transform document. Please check backend connection and try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setFileError(null);
    setError(null);
    setResultData(null);
    setOptions({
      outputType: "summary",
      tone: "professional",
      length: "medium",
      language: "English",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header isBackendConnected={isBackendConnected} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Hero Banner */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-1">
            <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100/70 text-blue-800 border border-blue-200">
              <Sparkles className="h-3 w-3 text-blue-600" />
              <span>AI Content Transformation Platform</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Turn Any PDF Into Production-Ready Content
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Upload your document, select format and tone parameters, and let Gemini 3.6 Flash extract, summarize, and reshape your text automatically.
          </p>
        </div>

        {/* Main 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input & Configuration */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              <FileUploader
                selectedFile={selectedFile}
                onFileSelect={(file) => {
                  setSelectedFile(file);
                  if (file) setFileError(null);
                }}
                disabled={isLoading}
                error={fileError}
                setError={setFileError}
              />

              <div className="border-t border-slate-100 pt-5">
                <TransformationOptions
                  options={options}
                  onChange={setOptions}
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-700 text-xs font-medium">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="flex-1">{error}</div>
                </div>
              )}

              <TransformButton
                onClick={handleTransform}
                isLoading={isLoading}
                disabled={!selectedFile}
              />
            </div>

            {/* Micro Feature Highlights Footer */}
            <div className="grid grid-cols-3 gap-3 text-center px-1">
              <div className="bg-white border border-slate-200/80 rounded-xl p-2.5">
                <div className="text-[11px] font-bold text-slate-800">PyMuPDF Engine</div>
                <div className="text-[10px] text-slate-500 font-medium">Instant PDF Extraction</div>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-xl p-2.5">
                <div className="text-[11px] font-bold text-slate-800">Gemini 3.6 Flash</div>
                <div className="text-[10px] text-slate-500 font-medium">Fast AI Generation</div>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-xl p-2.5">
                <div className="text-[11px] font-bold text-slate-800">5+ Formats</div>
                <div className="text-[10px] text-slate-500 font-medium">Summary to Social</div>
              </div>
            </div>
          </div>

          {/* Right Column: Output & Generated Content */}
          <div className="lg:col-span-7 h-full">
            <GeneratedContent
              data={resultData}
              isLoading={isLoading}
              onReset={handleReset}
            />
          </div>
        </div>
      </main>

      {/* App Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>GenAI-Transform MVP • SIH Project Frontend</span>
          </div>
          <div>Powered by FastAPI & Google Gemini AI</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
