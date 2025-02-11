"use client";

import React, { useState, useRef, useEffect } from "react";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Image, Video, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onSuccess: (res: IKUploadResponse) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
  onFileSelect?: (file: File | null) => void;
  triggerUpload?: boolean;
}

const checkVideoResolution = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
      });
    };
    video.onerror = () => {
      reject(new Error("Failed to load video metadata"));
    };
    video.src = URL.createObjectURL(file);
  });
};

const processVideo = async (file: File): Promise<File | null> => {
  const { width, height } = await checkVideoResolution(file);
  const aspectRatio = width / height;

  if (Math.abs(aspectRatio - 16 / 9) < 0.01) {
    return file;
  }

  // Conversion logic placeholder
  return file;
};

export default function FileUpload({ onSuccess, onProgress, fileType = "image", onFileSelect, triggerUpload }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const uploadRef = useRef<any>(null);

  useEffect(() => {
    if (triggerUpload && uploadRef.current) {
      try {
        const uploadButton = uploadRef.current as HTMLInputElement;
        uploadButton.click();
      } catch (error) {}
    }
  }, [triggerUpload]);

  const generateFileName: string = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    style: "lowerCase",
  });

  const handleRemoveFile = () => {
    setSelectedFileName(null);
    setError(null);
    setSuccessMessage(null);
    setWarningMessage(null);
    if (uploadRef.current) {
      uploadRef.current.value = "";
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  const onError = (error: { message: string }) => {
    setError(error.message);
    setUploading(false);
  };

  const handleSuccess = (response: IKUploadResponse) => {
    setUploading(false);
    setError(null);
    setSelectedFileName(null);
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

  const validateFile = async (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a video file");
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        setError("File size should be less than 50MB");
        return false;
      }

      try {
        const { width, height } = await checkVideoResolution(file);
        const aspectRatio = width / height;

        if (Math.abs(aspectRatio - 16 / 9) < 0.01) {
          setSuccessMessage("Video is being uploaded");
          return true;
        }

        const canConvert = aspectRatio >= 0.5 && aspectRatio <= 2;
        if (canConvert) {
          setWarningMessage("Video can be converted to 16:9 aspect ratio. Uploading...");
          return true;
        }

        setError("Video cannot be converted to 16:9 aspect ratio");
        return false;
      } catch (err) {
        setError("Failed to process video. Please try again.");
        return false;
      }
    }
    return true;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      if (await validateFile(file)) {
        setSelectedFileName(file.name);
        setError(null);
        setSuccessMessage(null);
        setWarningMessage(null);
      }
    }
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect({ target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="space-y-4">
      <IKUpload
        ref={uploadRef}
        fileName={generateFileName}
        onChange={handleFileSelect}
        folder="videos"
        onError={onError}
        onSuccess={handleSuccess}
        onUploadProgress={handleProgress}
        onUploadStart={handleUploadStart}
        style={{ display: "none" }}
      />

      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 transition-colors",
          "hover:border-primary/50 hover:bg-muted/50",
          isDragging && "border-primary bg-muted",
          "cursor-pointer"
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => uploadRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {fileType === "image" ? <Image className="h-10 w-10 text-muted-foreground" /> : <Video className="h-10 w-10 text-muted-foreground" />}

          {selectedFileName ? (
            <div className="text-sm font-medium flex items-center gap-2">
              <span>{selectedFileName}</span>
              <X
                className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
              />
            </div>
          ) : (
            <>
              <div className="flex flex-col space-y-1">
                <span className="font-medium">Drop your {fileType} here, or click to browse</span>
                <span className="text-xs text-muted-foreground">{fileType === "video" ? "Maximum size: 50MB" : "Maximum size: 5MB"}</span>
              </div>
            </>
          )}

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">Uploading...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
        </Alert>
      )}

      {warningMessage && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertDescription className="text-amber-600">{warningMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
