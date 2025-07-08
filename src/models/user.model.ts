import bcrypt from "bcryptjs";
import mongoose, { Document, model, models, Schema, Types } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  fname: string;
  lname?: string;
  profile_pic?: string;
  roadmap: Types.ObjectId[];
  quizzes: Types.ObjectId[];
  certificates: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
    },
    profile_pic: {
      type: String,
    },
    roadmap: [{ type: Schema.Types.ObjectId, ref: "RoadmapProgress" }],
    quizzes: [{ type: Schema.Types.ObjectId, ref: "QuizAttempt" }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const User = models?.User || model<IUser>("User", userSchema);

export default User;