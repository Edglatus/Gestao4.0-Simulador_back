import { Request, Response, NextFunction } from "express";
import Question from "../models/Question";

class QuestionController {
  async createQuestion(req: Request, res: Response, next: NextFunction) {
    const question = new Question(req.body);
    const exists = await Question.findOne({ prompt: question.prompt });
    if (exists) {
      return res.status(200).json(exists);
    }
    return question
      .save()
      .then((question) => {
        res.status(201).json(question);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getQuestion(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    return Question.findById(id, { "answers._id": 0 })
      .populate({
        path: "character",
        select: "-_id -createdAt -updatedAt -__v",
      })
      .then((question) => {
        res.status(question ? 200 : 404).json(
          question ?? {
            message: "No question found with this id",
          }
        );
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getQuestions(req: Request, res: Response, next: NextFunction) {
    return Question.find({}, { "answers._id": 0 })
      .populate({
        path: "character",
        select: "-_id -createdAt -updatedAt -__v",
      })
      .then((questions) => {
        res.status(200).json(questions);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getLastUpdate(req: Request, res: Response, next: NextFunction) {
    return Question.find()
      .sort({ createdAt: -1 })
      .limit(1)
      .then((question) => {
        res.status(200).json({ lastUpdate: question[0]?.updatedAt });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }
}

export default new QuestionController();
