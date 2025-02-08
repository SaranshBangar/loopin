import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface InterfaceUser {
  _id?: mongoose.Types.ObjectId;
  email: string;
  password: string;
  profilePicture?: string;
  username: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<InterfaceUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    username: { type: String, required: true, unique: true },
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
