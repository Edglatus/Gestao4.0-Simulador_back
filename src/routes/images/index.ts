import { Express } from "express";
import ImageController from "../../controllers/ImageController";

export default (app: Express) => {
  app
    .route("/images/:bucketName")
    .get(ImageController.getImages)
    .post(ImageController.createImage);
  app.route("/images/:bucketName/id/:id").get(ImageController.getImage);
};
