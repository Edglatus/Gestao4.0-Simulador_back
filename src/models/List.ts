import mongoose, { Document, ObjectId, Schema } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

export interface IList {
  title: string;
  description: string;
  questions: Array<ObjectId>;
}

export interface IListModel extends IList, Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ListSchema: Schema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    questions: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "questions",
    },
  },
  {
    timestamps: true,
  }
);

ListSchema.plugin(mongooseUniqueValidator);

export default mongoose.model<IListModel>("lists", ListSchema);
