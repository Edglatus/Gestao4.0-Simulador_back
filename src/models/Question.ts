import mongoose, { Document, ObjectId, Schema } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

export interface IAnswer {
  text: string;
  correct: boolean;
}

export interface IQuestion {
  prompt: string;
  answers: Array<IAnswer>;
  images: Array<ObjectId>;
  theme: string;
  character: ObjectId;
  difficulty: number;
  source: string;
}

export interface IQuestionModel extends IQuestion, Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new Schema(
  {
    prompt: { type: String, required: true, unique: true },
    answers: {
      type: [
        {
          text: String,
          correct: Boolean,
        },
      ],
      required: true,
    },
    images: {
      type: [Schema.Types.ObjectId],
      required: false,
    },
    theme: { type: String, required: true },
    character: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "characters",
    },
    difficulty: { type: Number, required: true },
    source: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

QuestionSchema.plugin(mongooseUniqueValidator);

export default mongoose.model<IQuestionModel>("questions", QuestionSchema);
