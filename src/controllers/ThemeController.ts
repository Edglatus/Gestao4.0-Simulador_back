import { Request, Response, NextFunction } from "express";
import Question from "../models/Question";

class ThemeController {
  async getThemes(req: Request, res: Response, next: NextFunction) {
    return Question.distinct("theme")
      .then((themes) => {
        res.status(200).json(themes);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }
}

export default new ThemeController();
