import React from "react";
import { VideoInfo } from "../models/VideoInfo";
import { GetVideoResult } from "../models/GetVideoResult";
import { UpdateListParam } from "../models/UpdateListParam";
import { CheckVideoIdsForUserListParam } from "../models/CheckVideoIdsForUserListParam";
import { LoginRequest } from "../models/LoginRequest";
import { RegisterRequest } from "../models/RegisterRequest";
import { RegisterResponse } from "../models/RegisterResponse";
import { LoginResponse } from "../models/LoginResponse";
import { HttpStatusError } from "../models/HttpStatusError";

export class HttpService {

  constructor(
    private username: string | null,
    private setUsername: (value: string | null) => void,
    private token: string | null,
    private setToken: (value: string | null) => void
  ) {}

  private authorizationHeader(): {[key: string]: string} {
    return this.token == null ? {} : {
      'Authorization': `Bearer ${this.token}`
    };
  }

  async getVideoInfos(): Promise<VideoInfo[]> {
    const response = await fetch("/api/catalog", { headers: { ...this.authorizationHeader() } })
      .then(r => r.json());
    return response;
  }
  
  async getVideoInfosForUser(): Promise<VideoInfo[]> {
    const response = await fetch("/api/catalog/list", { headers: { ...this.authorizationHeader(), 'userId': '1' } })
      .then(r => r.json());
    return response;
  }
  
  async checkVideoIdsForUserList(data: CheckVideoIdsForUserListParam): Promise<number[]> {
    const response = await fetch("/api/catalog/list/check", { 
      method: "POST",
      headers: {
        ...this.authorizationHeader(),
        'Content-Type': 'application/json',
        'userId': '1'
      },
      body: JSON.stringify(data) 
    }).then(r => r.json());
    return response;
  }
  
  async updateList(data: UpdateListParam): Promise<void> {
    await fetch("/api/catalog/list",
    {
      method: "PUT",
      headers: {
        ...this.authorizationHeader(),
        'Content-Type': 'application/json',
        'userId': '1'
      },
      body: JSON.stringify(data)
    });
  }
  
  async fetchVideoInfo(id: string): Promise<GetVideoResult> {
    const response = await fetch("/api/catalog/" + id, { headers: { ...this.authorizationHeader(), 'userId': '1' } })
      .then(r => r.json());
    return response;
  }
  
  async deleteVideo(id: string): Promise<void> {
    await fetch("/api/catalog/" + id, { method: "DELETE", headers: { ...this.authorizationHeader() } });
  }
  
  async updateVideo(id: string, data: {title?: string, description?: string}, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jsonString', JSON.stringify(data));
    await fetch("/api/catalog/" + id, 
    {
      method: "PUT",
      body: formData,
      headers: { ...this.authorizationHeader() }
    });
  }
  
  async updateProgress(id: string, data: {progress: number, finished: boolean}): Promise<void> {
    await fetch(`/api/catalog/${id}/progress`, 
    {
      method: "PUT",
      headers: {
        ...this.authorizationHeader(),
        'Content-Type': 'application/json',
        'userId': '1'
      },
      body: JSON.stringify(data)
    });
  }
  
  async searchVideos(data: {searchText: string}): Promise<VideoInfo[]> {
    const response =  await fetch("/api/catalog/search",
    {
      method: "POST",
      headers: {
        ...this.authorizationHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) 
    }).then(r => r.json());
    return response;
  }
  
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch("/api/user-service/login", { 
      method: "POST",
      headers: {
        ...this.authorizationHeader(),
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
    this.setToken(castedResponse.token);
    this.setUsername(castedResponse.username);
    return response;
  }

  logout(): void {
    this.setUsername(null);
    this.setToken(null);
  }
  
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch("/api/user-service/register", { 
      method: "POST",
      headers: {
        ...this.authorizationHeader(),
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
    return response;
  }
};

const HttpServiceContext = React.createContext(new HttpService(null, () => {}, null, () => {}));

export default HttpServiceContext;
