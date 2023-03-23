import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IScenario {
  title: string;
  description: string;
  startingLine: ObjectId;
  lineList: Array<ObjectId>;
  optionList: Array<ObjectId>;
  positiveOutcome: ObjectId;
  negativeOutcome: ObjectId;
  characters: Array<ObjectId>;
  backgroundURL: string;
}

export interface IScenarioModel extends IScenario, Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ScenarioSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startingLine: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "scenarioLines",
    },
    lineList: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "scenarioLines",
    },
    optionList: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "scenarioOptions",
    },
    positiveOutcome: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "scenarioOutcomes",
    },
    negativeOutcome: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "scenarioOutcomes",
    },
    characters: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "characters",
    },
    backgroundURL: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IScenarioModel>("scenarios", ScenarioSchema);
