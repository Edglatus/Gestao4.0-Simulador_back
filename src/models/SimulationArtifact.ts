import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface ISimulationArtifact {
  artifactName: string;
  imageURL: ObjectId;
  description: string;
  category: string
}

export interface ISimulationArtifactModel
  extends ISimulationArtifact,
    Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SimulationArtifactSchema: Schema = new Schema(
  {
    artifactName: { type: String, required: true },
    imageURL: { type: Schema.Types.ObjectId, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISimulationArtifactModel>(
  "simulationArtifacts",
  SimulationArtifactSchema
);
