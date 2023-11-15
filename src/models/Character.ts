import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface ICharacter {
  name: string;
  role: string;
  portrait: ObjectId;
  assetIndex: number;
}

export interface ICharacterModel extends ICharacter, Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CharacterSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    portrait: { type: Schema.Types.ObjectId, required: true },
    assetIndex: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICharacterModel>("characters", CharacterSchema);
