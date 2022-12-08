import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IQuizItem {
  description: string;
  list: ObjectId;
  requiredHits: number;
}

export interface IQuizItemModel extends IQuizItem, Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuizItemSchema: Schema = new Schema(
  {
    description: { type: String, required: true },
    list: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "lists",
    },
    requiredHits: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IQuizItemModel>("quizItems", QuizItemSchema);
