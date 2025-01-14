import { Request, Response } from "express";
import { existsSync, unlinkSync } from "fs";
import FileManager from "../common/FileManager";

class FileController {
  private static servableFiles: Array<string> = [
    "quizBackgrounds",
    "scnBackgrounds",
    "questionsImages",
    "portraitImages",
    "artifactImages",
    "assetFiles",
  ];

  async downloadFile(req: Request, res: Response) {
    try {
      const { id, bucketName, name } = req.params;
      const { fileName, path } = await FileManager.download(id, bucketName);
      if (name !== fileName) {
        throw new Error("Invalid id/name combination");
      }
      return res.download(path, fileName, () => {
        if (existsSync(path)) {
          unlinkSync(path);
        }
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || error });
    }
  }

  async getFile(req: Request, res: Response) {
    try {
      const { id, bucketName } = req.params;
      if (!FileController.servableFiles.includes(bucketName)) {
        throw new Error("This type of file cannot be served");
      }
      const { path } = await FileManager.download(id, bucketName);
      return res.sendFile(path, () => {
        if (existsSync(path)) {
          unlinkSync(path);
        }
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || error });
    }
  }

  async getFiles(req: Request, res: Response) {
    try {
      const { bucketName } = req.params;
      const files = await FileManager.findAll(bucketName);
      res.status(200).json(files);
    } catch (error: any) {
      res.status(500).json({ message: error.message || error });
    }
  }

  async createFile(req: Request, res: Response) {
    try {
      const { bucketName } = req.params;
      const { files } = req;

      if (files) {
        const newFiles = await FileManager.upload(files, bucketName);
        return res.status(201).json({
          files: newFiles,
          message: "Success",
        });
      } else {
        return res.status(500).json({ message: "No file found" });
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message || error });
    }
  }

  async deleteFile(req: Request, res: Response) {
    try {
      const { id, bucketName } = req.params;
      await FileManager.delete(id, bucketName);
      return res.json({ message: "Deleted!" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || error });
    }
  }
}

export default new FileController();
