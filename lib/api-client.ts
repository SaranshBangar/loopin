import { InterfaceVideo } from "@/models/Video";
import exp from "constants";

export type VideoData = Omit<InterfaceVideo, "_id" | "createdAt">;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
};

class ApiClient {
  private async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { method = "GET", headers = {}, body } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from ${endpoint}`);
    }

    return response.json();
  }

  async getVideos() {
    return this.fetch<InterfaceVideo[]>("/videos");
  }

  async getParticularVideo(id: string) {
    return this.fetch<InterfaceVideo>(`/videos/${id}`);
  }

  async uploadVideo(videoData: VideoData) {
    return this.fetch<InterfaceVideo>("/videos", {
      method: "POST",
      body: videoData,
    });
  }

  async loginUser(identifier: string, password: string) {
    return this.fetch("/auth/login", {
      method: "POST",
      body: { identifier, password },
    });
  }

  async registerUser(email: string, username: string, password: string) {
    return this.fetch("/auth/register", {
      method: "POST",
      body: { email, username, password },
    });
  }
}

export const apiClient = new ApiClient();
