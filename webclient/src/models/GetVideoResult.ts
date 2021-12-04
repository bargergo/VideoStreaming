export interface GetVideoResult {
  id: string;
  name: string;
  description: string;
  status: number;
  imageFileName?: string;
  progress: number;
  addedToList: boolean;
};