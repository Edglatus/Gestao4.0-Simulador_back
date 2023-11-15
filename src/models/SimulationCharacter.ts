import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface ISimulationCharacter {
  character: ObjectId;
  defaultDialogueId: ObjectId;
  dialogueIds: Array<ObjectId>;
  mapLocationIndex: number;
  // prefabAsset: ObjectId;
}

export interface ISimulationCharacterModel
  extends ISimulationCharacter,
  Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SimulationCharacterSchema: Schema = new Schema(
  {
    character: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "characters",
    },
    defaultDialogueId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "simulationDialogues",
    },
    dialogueIds: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "simulationDialogues",
    },
    mapLocationIndex: { type: Number, required: true },
    // prefabAsset: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    //   ref: "simulationAssets",
    // },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISimulationCharacterModel>(
  "simulationCharacters",
  SimulationCharacterSchema
);
