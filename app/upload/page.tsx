"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import FileUpload from "@/components/FileUpload";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Upload } from "lucide-react";

const page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [triggerUpload, setTriggerUpload] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const isFormValid = title.trim() !== "" && description.trim() !== "";

  const handleUploadSuccess = async (response: IKUploadResponse) => {
    console.log("[UploadPage] Upload succeeded:", response);

    try {
      setIsSubmitting(true);
      setError(null);

      const videoData = {
        title,
        description,
        videoUrl: response.url,
        uploaderId: session?.user?.id,
      };

      const res = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(videoData),
      });

      if (!res.ok) {
        throw new Error("Failed to save video details");
      }

      setProgress(0);
      setTriggerUpload(false);
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save video");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProgress = (progress: number) => {
    setProgress(progress);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !title.trim()) {
      return;
    }

    setTriggerUpload(true);
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Video
          </CardTitle>
          <CardDescription>
            Share your video with the community
            <div className="mt-1 text-sm text-muted-foreground">Video must have a 16:9 aspect ratio for optimal viewing experience</div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter video description"
                className="min-h-[100px]"
                required
              />
            </div>

            {isFormValid && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Video File</Label>
                <FileUpload
                  onSuccess={handleUploadSuccess}
                  onProgress={handleProgress}
                  fileType="video"
                  onFileSelect={setSelectedFile}
                  triggerUpload={triggerUpload}
                />
              </div>
            )}

            {progress > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Upload Progress: {progress}%</Label>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
