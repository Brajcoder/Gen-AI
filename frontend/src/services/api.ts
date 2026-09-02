import axios, { AxiosError } from "axios";
import type { TransformOptions, TransformResponse } from "../types/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for AI generation
});

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get("/health");
    return response.data && response.data.success === true;
  } catch (error) {
    return false;
  }
};

export const transformDocument = async (
  file: File,
  options: TransformOptions
): Promise<TransformResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("output_type", options.outputType);
  formData.append("tone", options.tone);
  formData.append("length", options.length);
  formData.append("language", options.language);

  try {
    const response = await apiClient.post<TransformResponse>(
      "/api/v1/transform-document",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.data.success) {
      throw new Error("Transformation failed. Invalid response received.");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError<{ detail?: string }>;
      if (axiosErr.response) {
        const detail = axiosErr.response.data?.detail;
        throw new Error(
          detail ||
            `Server error (${axiosErr.response.status}). Please try again.`
        );
      } else if (axiosErr.request) {
        throw new Error(
          "Unable to connect to the AI service. Please make sure the backend is running at " +
            API_BASE_URL
        );
      }
    }
    throw new Error(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred during transformation."
    );
  }
};
