import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IScenarioLine {
  prompt: string;
  options: Array<ObjectId>;
  character: ObjectId;
}

export interface IScenarioLineModel extends IScenarioLine, Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ScenarioLineSchema: Schema = new Schema(
  {
    prompt: { type: String, required: true },
    options: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "scenarioOptions",
    },
    character: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "characters",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IScenarioLineModel>("scenarioLines", ScenarioLineSchema);
