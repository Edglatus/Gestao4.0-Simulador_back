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
  private buckets: Array<string> = [
    "quizBackgrounds",
    "scnBackgrounds",
    "questionsImages",
    "portraitImages",
    "artifactImages",
    "assetFiles",
  ];

  constructor() {
    try {
      this.directory = join("/", "tmp", "temp");
      if (!existsSync(this.directory)) {
        mkdirSync(this.directory);
      }
    }
    catch {
      this.directory = join(process.cwd(), "/", "tmp");
      if (!existsSync(this.directory)) {
        mkdirSync(this.directory);
      }
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
    if (!files.files) {
      return [];
    }
    if (!Array.isArray(files.files)) {
      return [files.files];
    }
    return files.files;
  }

  private write(bucket: GridFSBucket, file: fileUpload.UploadedFile) {
    return new Promise<{ id: ObjectId; fileName: string }>(
      async (resolve, reject) => {
        const { name, data, mimetype } = file;
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
            resolve({
              id: streamGridFS.id,
              fileName: streamGridFS.filename,
            });
          })
          .on("error", (error: any) => {
            reject(error);
          });
      }
    );
  }

  async upload(files: fileUpload.FileArray, bucketName: string) {
    const bucket = await this.initializeBucket(bucketName);
    const newFiles = this.handleFiles(files);
    const createdFiles: Array<{ id: ObjectId; fileName: string }> = [];
    for (const file of newFiles) {
      createdFiles.push(await this.write(bucket, file));
    }
    return createdFiles;
  }

  private read(_id: ObjectId, bucket: GridFSBucket) {
    return new Promise<{ fileName: string; path: string }>(
      async (resolve, reject) => {
        const [file] = await bucket.find({ _id }).toArray();
        if (file) {
          const streamGridFS = bucket.openDownloadStream(_id);
          const path = join(
            this.directory,
            `${
              parse(file.filename).name
            }_${_id.toString()}_${new Date().getTime()}${
              parse(file.filename).ext
            }`
          );
          const writeStream = createWriteStream(path);
          streamGridFS
            .pipe(writeStream)
            .on("finish", () => {
              resolve({
                fileName: file.filename,
                path,
              });
            })
            .on("error", (error: any) => {
              reject(error);
            });
        } else {
          reject("File not found");
        }
      }
    );
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
    const files = await mongoose.connection.db
      .collection(`${bucketName}.files`)
      .find()
      .toArray();
    return files;
  }

  async delete(id: string, bucketName: string) {
    const _id = new ObjectId(id);
    const bucket = await this.initializeBucket(bucketName);
    return await bucket.delete(_id);
  }
}

export default new FileManager();
