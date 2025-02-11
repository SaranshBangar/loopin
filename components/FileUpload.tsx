"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";

interface FileUploadProps {
  onSuccess: (res: IKUploadResponse) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

export default function FileUpload({ onSuccess, onProgress, fileType = "image" }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFileName: string = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    style: "lowerCase",
  });

  const onError = (error: { message: string }) => {
    console.log("Error", error);
    setError(error.message);
    setUploading(false);
  };

  const handleSuccess = (response: IKUploadResponse) => {
    console.log("Success", response);
    setUploading(false);
    setError(null);
    onSuccess(response);
  };

  const handleProgress = (event: ProgressEvent) => {
    if (event.lengthComputable && onProgress) {
      const percentComplete = (event.loaded / event.total) * 100;
      onProgress(Math.round(percentComplete));
    }
  };

  const handleUploadStart = () => {
    setUploading(true);
    setError(null);
  };

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a video file");
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        setError("File size should be less than 50MB");
        return false;
      }
    } else {
      const validTypes = ["image/webp", "image/jpg", "image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload an image file of type jpg, jpeg, png, gif or webp");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return false;
      }
    }
    return false;
  };

  return (
    <div className="space-y-2">
      <IKUpload
        fileName={generateFileName}
        // useUniqueFileName={true}
        validateFile={validateFile}
        folder={fileType === "video" ? "/videos" : "/images"}
        onError={onError}
        onSuccess={handleSuccess}
        onUploadProgress={handleProgress}
        onUploadStart={handleUploadStart}
        className="file-input file-input-bordered w-full"
      />
      {uploading && <div className="flex items-center gap-2 text-sm">Loading...</div>}
      {error && (
        <div className="text-red-500 text-sm" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
