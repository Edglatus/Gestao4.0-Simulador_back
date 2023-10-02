import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface ISimulationScenario {
  title: string;
  description: string;
  dialogueFlags: Array<string>;
  mapAsset: ObjectId;
  characterList: Array<ObjectId>;
  dialogueList: Array<ObjectId>;
  lineList: Array<ObjectId>;
  optionList: Array<ObjectId>;
  mainObjectiveFlagIndex: number;
}

export interface ISimulationScenarioModel
  extends ISimulationScenario,
    Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SimulationScenarioSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dialogueFlags: { type: [String], required: true },
    mapAsset: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "simulationAssets",
    },
    characterList: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "simulationCharacters",
    },
    dialogueList: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "simulationDialogues",
    },
    lineList: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "simulationLines",
    },
    optionList: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "simulationOptions",
    },
    mainObjectiveFlagIndex: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISimulationScenarioModel>(
  "simulationScenarios",
  SimulationScenarioSchema
);
