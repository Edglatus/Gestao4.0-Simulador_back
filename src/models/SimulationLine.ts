import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface ISimulationLine {
  prompt: string;
  nextLineId?: ObjectId;
  optionIds: Array<ObjectId>;
  conditionalFlag?: string;
  conditionalValue?: boolean;
  triggeredFlag?: string;
  triggeredValue?: boolean;
  animationFlag: string;
  addedArtifact: ObjectId;
}

export interface ISimulationLineModel extends ISimulationLine, Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SimulationLineSchema: Schema = new Schema(
  {
    prompt: { type: String, required: true },
    nextLineId: {
      type: Schema.Types.ObjectId,
      ref: "simulationLines",
    },
    optionIds: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "simulationOptions",
    },
    conditionalFlag: { type: String, default: "" },
    conditionalValue: { type: Boolean, default: false },
    triggeredFlag: { type: String, default: "" },
    triggeredValue: { type: Boolean, default: false },
    animationFlag: { type: String, required: true },
    addedArtifact: {
      type: Schema.Types.ObjectId,
      ref: "simulationArtifacts",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISimulationLineModel>(
  "simulationLines",
  SimulationLineSchema
);
