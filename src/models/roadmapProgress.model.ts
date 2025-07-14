import mongoose, { Schema, Document, model, models, Types } from "mongoose";

export interface IRoadmapProgress extends Document {
  user: Types.ObjectId;
  roadmapId: string;
  progress: {
    resourceId: string;
    completed: boolean;
  }[];
  certificateIssued: boolean;
  startedAt: Date;
  completedAt?: Date;
}

const RoadmapProgressSchema = new Schema<IRoadmapProgress>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roadmapId: { type: String, required: true },
    progress: [
      {
        resourceId: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    certificateIssued: { type: Boolean, default: false },
    startedAt: { type: Date, default: Date.now },
    completedAt: Date,
  },
  { timestamps: true }
);

export default models.RoadmapProgress ||
  model<IRoadmapProgress>("RoadmapProgress", RoadmapProgressSchema);