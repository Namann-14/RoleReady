import mongoose, { Schema, Document, model, models, Types } from "mongoose";

export interface IQuizAttempt extends Document {
  user: Types.ObjectId;
  quizId: string;
  score: number;
  completedAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: String, required: true },
    score: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default models.QuizAttempt ||
  model<IQuizAttempt>("QuizAttempt", QuizAttemptSchema);
