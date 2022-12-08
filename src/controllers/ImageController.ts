import { Request, Response } from "express";
import { existsSync, unlinkSync } from "fs";
import FileManager from "../common/FileManager";

class ImageController {
  async getImage(req: Request, res: Response) {
    try {
      const { id, bucketName } = req.params;
      const image = await FileManager.download(id, bucketName);
      return res.sendFile(image, () => {
        if (existsSync(image)) {
          unlinkSync(image);
        }
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || error });
    }
  }

  async getImages(req: Request, res: Response) {
    try {
      const { bucketName } = req.params;
      const images = await FileManager.findAll(bucketName);
      res.status(200).json(images);
    } catch (error: any) {
      res.status(500).json({ message: error.message || error });
    }
  }

  async createImage(req: Request, res: Response) {
    try {
      const { bucketName } = req.params;
      const image = req.files;

      if (image) {
        const newImages = await FileManager.upload(image, bucketName);
        return res.status(201).json({
          ids: newImages,
          message: "Success",
        });
      } else {
        return res.status(500).json({ message: "No image found" });
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message || error });
    }
  }
}

export default new ImageController();
