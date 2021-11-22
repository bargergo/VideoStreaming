import { VideoInfo } from "../models/VideoInfo";
import { GetVideoResult } from "../models/GetVideoResult";
import { UpdateListParam } from "../models/UpdateListParam";
import { CheckVideoIdsForUserListParam } from "../models/CheckVideoIdsForUserListParam";
import { LoginRequest } from "../models/LoginRequest";
import { RegisterRequest } from "../models/RegisterRequest";
import { RegisterResponse } from "../models/RegisterResponse";
import { LoginResponse } from "../models/LoginResponse";
import { HttpStatusError } from "../models/HttpStatusError";
import { loginAction, logoutAction } from "./userSlice";
import { AppStore } from "./store";
import { ValidationErrorResponse } from "../models/ValidationErrorResponse";

let store: AppStore;

export const injectStore = (_store: AppStore) => {
  store = _store;
}

function authorizationHeader(): {[key: string]: string} {
  const state = store.getState();
  return state.user.token == null ? {} : {
    'Authorization': `Bearer ${state.user.token}`
  };
}

export async function getVideoInfos(): Promise<VideoInfo[]> {
  const response = await fetch("/api/catalog/public", { headers: { ...authorizationHeader() } })
    .then(r => r.json());
  return response;
}

export async function getVideoInfosForUser(): Promise<VideoInfo[]> {
  const response = await fetch("/api/catalog/private/list", { headers: { ...authorizationHeader() } })
    .then(r => r.json());
  return response;
}

export async function checkVideoIdsForUserList(data: CheckVideoIdsForUserListParam): Promise<number[]> {
  const response = await fetch("/api/catalog/private/list/check", { 
    method: "POST",
    headers: {
      ...authorizationHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) 
  }).then(r => r.json());
  return response;
}

export async function updateList(data: UpdateListParam): Promise<void> {
  await fetch("/api/catalog/private/list",
  {
    method: "PUT",
    headers: {
      ...authorizationHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

export async function fetchVideoInfo(id: string): Promise<GetVideoResult> {
  const state = store.getState();
  const baseUrl = state.user.token != null ? "/api/catalog/private/" : "/api/catalog/public/";
  const response = await fetch(baseUrl + id, { headers: { ...authorizationHeader() } })
    .then(r => r.json());
  return response;
}

export async function deleteVideo(id: string): Promise<void> {
  await fetch("/api/catalog/private/" + id, { method: "DELETE", headers: { ...authorizationHeader() } });
}

export async function updateVideo(id: string, data: {title?: string, description?: string}, file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('jsonString', JSON.stringify(data));
  await fetch("/api/catalog/private/" + id, 
  {
    method: "PUT",
    body: formData,
    headers: { ...authorizationHeader() }
  });
}

export async function updateProgress(id: string, data: {progress: number, finished: boolean}): Promise<void> {
  await fetch(`/api/catalog/private/${id}/progress`, 
  {
    method: "PUT",
    headers: {
      ...authorizationHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

export async function searchVideos(data: {searchText: string}): Promise<VideoInfo[] | ValidationErrorResponse> {
  const response =  await fetch("/api/catalog/public/search",
  {
    method: "POST",
    headers: {
      ...authorizationHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) 
  }).then(r => r.json());
  return response;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch("/api/user-service/login", { 
    method: "POST",
    headers: {
      ...authorizationHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) 
  }).then(r => {
    if (r.ok) {
      return r.json();
    } else {
      throw new HttpStatusError(r.statusText, r.status);
    }
  });
  const castedResponse = response as LoginResponse;
  store.dispatch(loginAction({ token: castedResponse.token, name: castedResponse.username}));
  return response;
}

export function logout(): void {
  store.dispatch(logoutAction());
}

export async function register(data: RegisterRequest): Promise<RegisterResponse | ValidationErrorResponse> {
  const response = await fetch("/api/user-service/register", { 
    method: "POST",
    headers: {
      ...authorizationHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) 
  }).then(r => {
    if (r.ok || r.status === 400) {
      return r.json();
    } else {
      throw new HttpStatusError(r.statusText, r.status);
    }
  });
  return response;
}
