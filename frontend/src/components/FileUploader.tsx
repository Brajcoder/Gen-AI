import React, { useRef, useState } from "react";
import { UploadCloud, FileText, X, AlertCircle, CheckCircle2 } from "lucide-react";

interface FileUploaderProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
  error?: string | null;
  setError: (error: string | null) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const FileUploader: React.FC<FileUploaderProps> = ({
  selectedFile,
  onFileSelect,
  disabled = false,
  error,
  setError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File | null) => {
    setError(null);
    if (!file) {
      onFileSelect(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setError("Only PDF files are supported. Please select a valid PDF document.");
      onFileSelect(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds the 10 MB limit. Please select a smaller document.");
      onFileSelect(null);
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-800">
        Upload Document <span className="text-rose-500">*</span>
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
        id="pdf-upload-input"
      />

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            disabled
              ? "bg-slate-50 border-slate-200 cursor-not-allowed opacity-60"
              : isDragging
              ? "border-blue-500 bg-blue-50/70 shadow-sm scale-[1.005]"
              : "border-slate-300 bg-slate-50/50 hover:bg-slate-100/60 hover:border-slate-400"
          }`}
        >
          <div className="mx-auto h-12 w-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3">
            <UploadCloud className="h-6 w-6" />
          </div>

          <p className="text-sm font-medium text-slate-800">
            <span className="font-semibold text-blue-600 hover:text-blue-700">
              Click to browse
            </span>{" "}
            or drag and drop your PDF
          </p>
          <p className="text-xs text-slate-500 mt-1">
            PDF format only (Up to 10 MB)
          </p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex items-center justify-between group transition-all duration-200">
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className="h-11 w-11 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {selectedFile.name}
                </p>
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {formatFileSize(selectedFile.size)} • PDF Document
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) validateAndSetFile(null);
            }}
            disabled={disabled}
            aria-label="Remove document"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-rose-600 text-xs font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-100">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
