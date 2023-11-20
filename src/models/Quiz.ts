import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IQuiz {
  title: string;
  itemList: Array<ObjectId>;
  difficulty: number;
  description: string;
  backgroundURL: ObjectId;
}

export interface IQuizModel extends IQuiz, Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    itemList: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "quizItems",
    },
    difficulty: { type: Number, required: true },
    description: { type: String, required: true },
    backgroundURL: { type: Schema.Types.ObjectId, required: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IQuizModel>("quiz", QuizSchema);
