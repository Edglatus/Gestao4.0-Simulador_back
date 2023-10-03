import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface ISimulationLine {
  prompt: string;
  nextLineId?: ObjectId;
  optionIds: Array<ObjectId>;
  conditionalFlag?: string;
  conditionalValue: boolean;
  triggeredFlag?: string;
  triggeredValue: boolean;
  animationFlag: string;
  score: number;
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
    conditionalValue: { type: Boolean, required: true },
    triggeredFlag: { type: String, default: "" },
    triggeredValue: { type: Boolean, required: true },
    animationFlag: { type: String, required: true },
    score: { type: Number, required: true },
    addedArtifact: {
      type: Schema.Types.ObjectId,
      required: true,
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
