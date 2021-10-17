export interface GetVideoResult {
  id: number;
  fileId: string;
  name: string;
  description: string;
  status: string;
  imageFileName?: string;
  progress: number;
};