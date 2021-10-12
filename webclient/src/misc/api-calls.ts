import { VideoInfo } from "../models/VideoInfo";

export async function fetchVideoInfo(id: string): Promise<VideoInfo> {
  const response = await fetch("/api/catalog/" + id)
    .then(r => r.json());
  return response;
}

export async function deleteVideo(id: string): Promise<void> {
  await fetch("/api/catalog/" + id, { method: "DELETE" });
}

export async function updateVideo(id: string, data: {title?: string, description?: string}): Promise<void> {
  await fetch("/api/catalog/" + id, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) 
  });
}