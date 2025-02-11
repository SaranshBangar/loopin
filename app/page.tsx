"use client";

import { apiClient } from "@/lib/api-client";
import { InterfaceVideo } from "@/models/Video";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const [videos, setVideos] = useState<InterfaceVideo[]>([]);
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Failed to fetch videos : ", error);
      }
    };

    if (status === "authenticated") {
      console.log("Logged in user:", {
        id: session.user.id,
        email: session.user.email,
        username: session.user.username,
      });
      fetchVideos();
    }
  }, [status, session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <Header />
      {session?.user?.email && (
        <div>
          <p>Welcome, {session.user.username}!</p>
          <p>Email: {session.user.email}</p>
        </div>
      )}
    </main>
  );
}
