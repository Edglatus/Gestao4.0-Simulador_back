import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface ISimulationOption {
  prompt: string;
  nextLineId?: ObjectId;
  triggeredFlag?: string;
  triggeredValue: boolean;
}

export interface ISimulationOptionModel extends ISimulationOption, Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SimulationOptionSchema: Schema = new Schema(
  {
    prompt: { type: String, required: true },
    nextLineId: {
      type: Schema.Types.ObjectId,
      ref: "simulationLines",
    },
    triggeredFlag: { type: String, default: "" },
    triggeredValue: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISimulationOptionModel>(
  "simulationOptions",
  SimulationOptionSchema
);
