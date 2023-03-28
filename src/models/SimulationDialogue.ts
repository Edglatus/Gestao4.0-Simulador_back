import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface ISimulationDialogue {
  startingLineId: ObjectId;
  defaultLineId: ObjectId;
  lineIds: Array<ObjectId>;
  optionIds: Array<ObjectId>;
  conditionalFlag?: string;
  conditionalValue: boolean;
}

export interface ISimulationDialogueModel
  extends ISimulationDialogue,
    Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SimulationDialogueSchema: Schema = new Schema(
  {
    startingLineId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "simulationLines",
    },
    defaultLineId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "simulationLines",
    },
    lineIds: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "simulationLines",
    },
    optionIds: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "simulationOptions",
    },
    conditionalFlag: { type: String, default: "" },
    conditionalValue: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISimulationDialogueModel>(
  "simulationDialogues",
  SimulationDialogueSchema
);
