"use client";

import { InterfaceVideo } from "@/models/Video";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="overflow-hidden">
        <CardContent className="p-0">
          <Skeleton className="w-full aspect-[9/16]" />
        </CardContent>
        <div className="p-4">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </Card>
    ))}
  </div>
);

const page = () => {
  const [videos, setVideos] = useState<InterfaceVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/videos/me");
        const data = await response.json();

        if (response.ok) {
          setVideos(data);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Videos</h1>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : videos.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No videos found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <Card key={video._id?.toString()} className="overflow-hidden">
              <CardContent className="p-0">
                <video src={video.videoUrl} poster={video.thumbnailUrl} controls={video.controls} className="w-full aspect-[9/16] object-cover" />
              </CardContent>
              <CardHeader>
                <CardTitle className="line-clamp-1">{video.title}</CardTitle>
                {video.description && <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>}
              </CardHeader>
              <CardFooter>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{video.viewsCount?.toLocaleString()} views</span>
                  <span>•</span>
                  <span>{video.likesCount?.toLocaleString()} likes</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default page;
