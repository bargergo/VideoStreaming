export interface VideoDetails {
  id: string;
  name: string;
  description: string;
  status: string;
  imageFileName?: string;
  progress: number;
  addedToList: boolean;
};