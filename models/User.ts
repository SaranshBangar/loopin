import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface InterfaceUser {
  _id?: mongoose.Types.ObjectId;
  email: string;
  password: string;
  profilePicture?: string;
  username: string;
  connections?: mongoose.Types.ObjectId[];
  uploadedContent?: mongoose.Types.ObjectId[];
  viewedContent?: mongoose.Types.ObjectId[];
  likedContent?: mongoose.Types.ObjectId[];
  dislikedContent?: mongoose.Types.ObjectId[];
  savedContent?: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<InterfaceUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: {
      type: String,
      default: "https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      validate: {
        validator: function (v: string) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(v);
        },
        message: (props) => `${props.value} is not a valid image URL!`,
      },
    },
    username: { type: String, required: true, unique: true },
    connections: [{ type: Schema.Types.ObjectId, ref: "User" }],
    uploadedContent: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    viewedContent: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    likedContent: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    dislikedContent: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    savedContent: [{ type: Schema.Types.ObjectId, ref: "Video" }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
  next();
});

const User = models?.User || model<InterfaceUser>("User", userSchema);

export default User;
