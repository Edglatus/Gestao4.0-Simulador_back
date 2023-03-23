import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IScenarioOutcome {
  line: string;
}

export interface IScenarioOutcomeModel extends IScenarioOutcome, Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ScenarioOutcomeSchema: Schema = new Schema(
  {
    line: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IScenarioOutcomeModel>(
  "scenarioOutcomes",
  ScenarioOutcomeSchema
);
