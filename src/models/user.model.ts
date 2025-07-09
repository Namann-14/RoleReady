import bcrypt from "bcryptjs";
import mongoose, { Document, model, models, Schema, Types } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password?: string; // Make optional for OAuth users
  fname: string;
  lname?: string;
  profile_pic?: string;
  provider?: string; // Add provider field for OAuth
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
      required: false, // Not required for OAuth users
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
    provider: {
      type: String,
      enum: ['credentials', 'github', 'google'],
      default: 'credentials',
    },
    roadmap: [{ type: Schema.Types.ObjectId, ref: "RoadmapProgress" }],
    quizzes: [{ type: Schema.Types.ObjectId, ref: "QuizAttempt" }],
    certificates: [{ type: Schema.Types.ObjectId, ref: "Certificate" }],
  },
  {
    timestamps: true,
  }
);

// Only hash password if it exists (for credentials users)
userSchema.pre("save", async function () {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const User = models?.User || model<IUser>("User", userSchema);

export default User;