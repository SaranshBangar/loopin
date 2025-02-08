"use client";

import { apiClient } from "@/lib/api-client";
import { InterfaceVideo } from "@/models/Video";
import { IKVideo } from "imagekitio-next";
import { useEffect, useState } from "react";
import Header from "../components/Header";

export default function Home() {
  const [videos, setVideos] = useState<InterfaceVideo[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Failed to fetch videos : ", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <main>
      <Header />
    </main>
  );
}
