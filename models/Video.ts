import mongoose, { Schema, model, models } from "mongoose";

export const VIDEO_DIMENSIONS = {
  width: 1080,
  height: 1920,
} as const;

export interface InterfaceVideo {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality: number;
  };
  uploaderId: mongoose.Types.ObjectId;
  viewsCount?: number;
  likesCount?: number;
  dislikesCount?: number;
  savedCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const videoSchema = new Schema<InterfaceVideo>(
  {
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    controls: { type: Boolean, default: true },
    transformation: {
      height: { type: Number, default: VIDEO_DIMENSIONS.height },
      width: { type: Number, default: VIDEO_DIMENSIONS.width },
      quality: { type: Number, min: 1, max: 100 },
    },
    uploaderId: { type: Schema.Types.ObjectId, ref: "User" },
    viewsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
    savedCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Video = models?.Video || model<InterfaceVideo>("Video", videoSchema);

export default Video;
