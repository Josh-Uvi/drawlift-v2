export type JobStatus = "pending" | "queued" | "processing" | "completed" | "failed" | "archived";

export interface JobConfig {
  mode: "2d" | "3d";
  dpi: number;
  floor_height_m: number;
  slab_thickness_m?: number;
  include_ceiling?: boolean;
  output_format: "dxf" | "dwg" | "both";
  segmenter: "ml" | "classic";
}

export interface JobCreateResponse {
  job_id: string;
}

export interface WallSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thickness: number;
  height: number;
}

export interface OpeningSegment {
  type: "door" | "window";
  x: number;
  y: number;
  width: number;
  rotation: number;
}

export interface FloorPlanGeometry {
  width: number;
  length: number;
  walls: WallSegment[];
  openings: OpeningSegment[];
  rooms: { name: string; x: number; y: number; areaM2: number }[];
}

export interface Job {
  id: string;
  status: JobStatus;
  progress: number;
  step: string | null;
  config: JobConfig;
  input_file: string;
  output_file: string | null;
  page_count: number | null;
  error_msg: string | null;
  error_trace: string | null;
  created_at: string;
  updated_at: string;
  pagesData?: string[]; // base64 / dataURLs of rendered floor plan pages
  geometry?: FloorPlanGeometry;
  glbUrl?: string;
  dxfContent?: string;
}

export interface JobListResponse {
  jobs: Job[];
  total: number;
}

export interface SSEProgressEvent {
  job_id: string;
  status: JobStatus;
  progress: number;
  step: string;
  message?: string | null;
}
