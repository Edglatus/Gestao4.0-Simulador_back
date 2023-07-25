import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface ISimulationAsset {
  assetURL: string;
  assetFilename: string;
  assetVersion: number;
}

export interface ISimulationAssetModel extends ISimulationAsset, Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SimulationAssetSchema: Schema = new Schema(
  {
    assetURL: { type: String, required: true },
    assetFilename: { type: String, required: true },
    assetVersion: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "'assetVersion' must be an integer value",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISimulationAssetModel>(
  "simulationAssets",
  SimulationAssetSchema
);
