import { Request, Response, NextFunction } from "express";
import QuizItem from "../models/QuizItem";

class QuizItemController {
  async createQuizItem(req: Request, res: Response, next: NextFunction) {
    const quizItem = new QuizItem(req.body);
    return quizItem
      .save()
      .then((quizItem) => {
        res.status(201).json(quizItem);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getQuizItem(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    return QuizItem.findById(id)
      .populate({
        path: "list",
        select: "-_id -createdAt -updatedAt -__v",
        populate: {
          path: "questions",
          select: "-_id -answers._id -character._id -createdAt -updatedAt -__v",
        },
      })
      .then((quizItem) => {
        res.status(quizItem ? 200 : 404).json(
          quizItem ?? {
            message: "No quizItem found with this id",
          }
        );
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getQuizItems(req: Request, res: Response, next: NextFunction) {
    return QuizItem.find()
      .populate({
        path: "list",
        select: "-_id -createdAt -updatedAt -__v",
        populate: {
          path: "questions",
          select: "-_id -answers._id -character._id -createdAt -updatedAt -__v",
        },
      })
      .then((quizItems) => {
        res.status(200).json(quizItems);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getLastUpdate(req: Request, res: Response, next: NextFunction) {
    return QuizItem.find()
      .sort({ createdAt: -1 })
      .limit(1)
      .then((quizItem) => {
        res.status(200).json({ lastUpdate: quizItem[0]?.updatedAt });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }
}

export default new QuizItemController();
