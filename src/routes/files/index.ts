import { Express } from "express";
import FileController from "../../controllers/FileController";

export default (app: Express) => {
  app
    .route("/files/:bucketName")
    .get(FileController.getFiles)
    .post(FileController.createFile);
  app
    .route("/files/:bucketName/id/:id")
    .get(FileController.getFile)
    .delete(FileController.deleteFile);
  app
    .route("/files/download/:bucketName/id/:id/name/:name")
    .get(FileController.downloadFile);
};
