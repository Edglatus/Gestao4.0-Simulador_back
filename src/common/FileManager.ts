import fileUpload from "express-fileupload";
import { join, parse } from "path";
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import mongoose from "mongoose";
import { GridFSBucket, ObjectId } from "mongodb";

class FileManager {
  private directory: string;
  private buckets: Array<string> = ["questionsImages", "portraitImages"];

  constructor() {
    this.directory = join("/", "tmp", "temp");
    if (!existsSync(this.directory)) {
      mkdirSync(this.directory);
    }
  }

  private async initializeBucket(bucketName: string): Promise<GridFSBucket> {
    if (!this.buckets.includes(bucketName)) {
      throw new Error("Invalid Bucket Name");
    }
    const db = mongoose.connection.db;
    return new mongoose.mongo.GridFSBucket(db, { bucketName });
  }

  private handleFiles(files: fileUpload.FileArray) {
    if (!files.images) {
      return [];
    }
    if (!Array.isArray(files.images)) {
      return [files.images];
    }
    return files.images;
  }

  private write(bucket: GridFSBucket, image: fileUpload.UploadedFile) {
    return new Promise<ObjectId>(async (resolve, reject) => {
      const { name, data, mimetype } = image;
      const tempName = `${parse(name).name}_${new Date().getTime()}${
        parse(name).ext
      }`;
      const path = join(this.directory, tempName);
      writeFileSync(path, data);
      const streamGridFS = bucket.openUploadStream(name, {
        metadata: {
          mimetype,
        },
      });
      const readStream = createReadStream(path);
      readStream
        .pipe(streamGridFS)
        .on("finish", () => {
          unlinkSync(path);
          resolve(streamGridFS.id);
        })
        .on("error", (error: any) => {
          reject(error);
        });
    });
  }

  async upload(files: fileUpload.FileArray, bucketName: string) {
    const bucket = await this.initializeBucket(bucketName);
    const images = this.handleFiles(files);
    const ids: Array<ObjectId> = [];
    for (const image of images) {
      ids.push(await this.write(bucket, image));
    }
    return ids;
  }

  private read(_id: ObjectId, bucket: GridFSBucket) {
    return new Promise<string>(async (resolve, reject) => {
      const [image] = await bucket.find({ _id }).toArray();
      if (image) {
        const streamGridFS = bucket.openDownloadStream(_id);
        const path = join(
          this.directory,
          `${
            parse(image.filename).name
          }_${_id.toString()}_${new Date().getTime()}${
            parse(image.filename).ext
          }`
        );
        const writeStream = createWriteStream(path);
        streamGridFS
          .pipe(writeStream)
          .on("finish", () => {
            resolve(path);
          })
          .on("error", (error: any) => {
            reject(error);
          });
      } else {
        reject("Image not found");
      }
    });
  }

  async download(id: string, bucketName: string) {
    const _id = new ObjectId(id);
    const bucket = await this.initializeBucket(bucketName);
    return await this.read(_id, bucket);
  }

  async findAll(bucketName: string) {
    if (!this.buckets.includes(bucketName)) {
      throw new Error("Invalid Bucket Name");
    }
    const images = await mongoose.connection.db
      .collection(`${bucketName}.files`)
      .find()
      .toArray();
    return images;
  }
}

export default new FileManager();
