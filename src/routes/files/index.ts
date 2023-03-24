import { Express } from "express";
import FileController from "../../controllers/FileController";

export default (app: Express) => {
  app
    .route("/files/:bucketName")
    .get(FileController.getFiles)
    .post(FileController.createFile);
  app.route("/files/:bucketName/id/:id").get(FileController.getFile);
  app
    .route("/files/:bucketName/id/:id/download")
    .get(FileController.downloadFile);
};
