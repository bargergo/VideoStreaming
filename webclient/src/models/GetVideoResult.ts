export interface GetVideoResult {
  id: number;
  fileId: string;
  name: string;
  description: string;
  status: number;
  imageFileName?: string;
  progress: number;
  addedToList: boolean;
};