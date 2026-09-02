export type OutputType =
  | "summary"
  | "blog"
  | "linkedin"
  | "instagram"
  | "email";

export type Tone =
  | "professional"
  | "casual"
  | "academic"
  | "friendly"
  | "marketing";

export type Length =
  | "short"
  | "medium"
  | "long";

export interface TransformResultData {
  file_id: string;
  filename: string;
  page_count: number;
  output_type: OutputType;
  model: string;
  content: string;
}

export interface TransformResponse {
  success: boolean;
  data: TransformResultData;
}

export interface TransformOptions {
  outputType: OutputType;
  tone: Tone;
  length: Length;
  language: string;
}
