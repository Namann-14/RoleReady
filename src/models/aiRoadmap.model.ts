import mongoose, { Schema, Document, model, models, Types } from "mongoose";

interface IReference {
  title: string;
  type: string;
  link: string;
}

interface IVideoLink {
  title: string;
  platform: string;
  link: string;
}

interface IPhase {
  phase_name: string;
  description: string;
  skills_to_acquire: string[];
  references: IReference[];
  video_links: IVideoLink[];
  practice_questions: string[];
}

export interface IAIRoadmap extends Document {
  user: Types.ObjectId;
  roadmap_title: string;
  goal: string;
  phases: IPhase[];
  general_tips: string[];
  geminiRaw?: any;
  createdAt: Date;
  updatedAt: Date;
}

const ReferenceSchema = new Schema<IReference>(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    link: { type: String, required: true },
  },
  { _id: false }
);

const VideoLinkSchema = new Schema<IVideoLink>(
  {
    title: { type: String, required: true },
    platform: { type: String, required: true },
    link: { type: String, required: true },
  },
  { _id: false }
);

const PhaseSchema = new Schema<IPhase>(
  {
    phase_name: { type: String, required: true },
    description: { type: String, required: true },
    skills_to_acquire: [{ type: String, required: true }],
    references: { type: [ReferenceSchema], default: [] },
    video_links: { type: [VideoLinkSchema], default: [] },
    practice_questions: [{ type: String, default: [] }],
  },
  { _id: false }
);

const AIRoadmapSchema = new Schema<IAIRoadmap>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roadmap_title: { type: String, required: true },
    goal: { type: String, required: true },
    phases: { type: [PhaseSchema], required: true },
    general_tips: { type: [String], default: [] },
    geminiRaw: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default models.AIRoadmap ||
  model<IAIRoadmap>("AIRoadmap", AIRoadmapSchema);