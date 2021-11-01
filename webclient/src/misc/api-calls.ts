import { VideoInfo } from "../models/VideoInfo";
import { GetVideoResult } from "../models/GetVideoResult";
import { UpdateListParam } from "../models/UpdateListParam";
import { CheckVideoIdsForUserListParam } from "../models/CheckVideoIdsForUserListParam";
import { LoginRequest } from "../models/LoginRequest";
import { RegisterRequest } from "../models/RegisterRequest";
import { RegisterResponse } from "../models/RegisterResponse";
import { LoginResponse } from "../models/LoginResponse";

export async function getVideoInfos(): Promise<VideoInfo[]> {
  const response = await fetch("/api/catalog")
    .then(r => r.json());
  return response;
};

export async function getVideoInfosForUser(): Promise<VideoInfo[]> {
  const response = await fetch("/api/catalog/list", { headers: { 'userId': '1' } })
    .then(r => r.json());
  return response;
};

export async function checkVideoIdsForUserList(data: CheckVideoIdsForUserListParam): Promise<number[]> {
  const response = await fetch("/api/catalog/list/check", { 
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'userId': '1'
    },
    body: JSON.stringify(data) 
  }).then(r => r.json());
  return response;
};

export async function updateList(data: UpdateListParam): Promise<void> {
  await fetch("/api/catalog/list",
  {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'userId': '1'
    },
    body: JSON.stringify(data)
  });
};

export async function fetchVideoInfo(id: string): Promise<GetVideoResult> {
  const response = await fetch("/api/catalog/" + id, { headers: { 'userId': '1' } })
    .then(r => r.json());
  return response;
};

export async function deleteVideo(id: string): Promise<void> {
  await fetch("/api/catalog/" + id, { method: "DELETE" });
};

export async function updateVideo(id: string, data: {title?: string, description?: string}, file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('jsonString', JSON.stringify(data));
  await fetch("/api/catalog/" + id, 
  {
    method: "PUT",
    body: formData
  });
};

export async function updateProgress(id: string, data: {progress: number, finished: boolean}): Promise<void> {
  await fetch(`/api/catalog/${id}/progress`, 
  {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'userId': '1'
    },
    body: JSON.stringify(data)
  });
};

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
};

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch("/api/user-service/login", { 
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) 
  }).then(r => r.json());
  return response;
};

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const response = await fetch("/api/user-service/register", { 
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) 
  }).then(r => r.json());
  return response;
};