import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IScenarioOption {
  prompt: string;
  nextLine?: ObjectId;
  value: number;
}

export interface IScenarioOptionModel extends IScenarioOption, Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ScenarioOptionSchema: Schema = new Schema(
  {
    prompt: { type: String, required: true },
    nextLine: {
      type: Schema.Types.ObjectId,
      ref: "scenarioLines",
    },
    value: { type: Number, required: true, min: -1, max: 1 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IScenarioOptionModel>(
  "scenarioOptions",
  ScenarioOptionSchema
);
