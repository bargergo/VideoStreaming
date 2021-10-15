import { VideoInfo } from "../models/VideoInfo";

export async function getVideoInfos(): Promise<VideoInfo[]> {
  const response = await fetch("/api/catalog")
    .then(r => r.json());
  return response;
}

export async function fetchVideoInfo(id: string): Promise<VideoInfo> {
  const response = await fetch("/api/catalog/" + id)
    .then(r => r.json());
  return response;
}

export async function deleteVideo(id: string): Promise<void> {
  await fetch("/api/catalog/" + id, { method: "DELETE" });
}

export async function updateVideo(id: string, data: {title?: string, description?: string}, file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('jsonString', JSON.stringify(data));
  await fetch("/api/catalog/" + id, 
  {
    method: "PUT",
    /*headers: {
      'Content-Type': 'multipart/form-data; boundary=something'
    },*/
    body: formData/*JSON.stringify(data) */
  });
}

export async function searchVideos(data: {searchText: string}): Promise<VideoInfo[]> {
  const response =  await fetch("/api/catalog/search",
  {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) 
  }).then(r => r.json());
  return response;
}