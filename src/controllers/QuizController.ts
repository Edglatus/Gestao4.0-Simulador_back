import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import validateId from "../common/validateId";
import Quiz from "../models/Quiz";

class QuizController {
  async createQuiz(req: Request, res: Response, next: NextFunction) {
    const quiz = new Quiz(req.body);
    return quiz
      .save()
      .then((quiz) => {
        res.status(201).json(quiz);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getQuiz(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!validateId(id)) {
      return res.status(500).json({ message: "Invalid Id" });
    }
    return Quiz.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "quizitems",
          localField: "itemList",
          foreignField: "_id",
          as: "itemList",
          pipeline: [
            {
              $sort: {
                _id: 1,
              },
            },
            {
              $lookup: {
                from: "lists",
                localField: "list",
                foreignField: "_id",
                as: "list",
                pipeline: [
                  {
                    $lookup: {
                      from: "questions",
                      localField: "questions",
                      foreignField: "_id",
                      as: "questions",
                      pipeline: [
                        {
                          $sort: {
                            _id: 1,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $project: {
                      title: 1,
                      description: 1,
                      questions: 1,
                      quantity: {
                        $size: "$questions",
                      },
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: "$list",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          itemList: 1,
          difficulty: 1,
          description: 1,
          quantity: {
            $sum: "$itemList.list.quantity",
          },
        },
      },
      {
        $project: {
          "itemList._id": 0,
          "itemList.createdAt": 0,
          "itemList.updatedAt": 0,
          "itemList.__v": 0,
          "itemList.list._id": 0,
          "itemList.list.createdAt": 0,
          "itemList.list.updatedAt": 0,
          "itemList.list.__v": 0,
          "itemList.list.questions._id": 0,
          "itemList.list.questions.answers._id": 0,
          "itemList.list.questions.createdAt": 0,
          "itemList.list.questions.updatedAt": 0,
          "itemList.list.questions.__v": 0,
        },
      },
    ])
      .then((quiz) => {
        res.status(quiz.length ? 200 : 404).json(
          quiz[0] ?? {
            message: "No quiz found with this id",
          }
        );
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getQuizPreview(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    return Quiz.findById(id)
      .select("-itemList -createdAt -__v")
      .then((quiz) => {
        res.status(quiz ? 200 : 404).json(
          quiz ?? {
            message: "No quiz found with this id",
          }
        );
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getQuizes(req: Request, res: Response, next: NextFunction) {
    return Quiz.aggregate([
      {
        $lookup: {
          from: "quizitems",
          localField: "itemList",
          foreignField: "_id",
          as: "itemList",
          pipeline: [
            {
              $sort: {
                _id: 1,
              },
            },
            {
              $lookup: {
                from: "lists",
                localField: "list",
                foreignField: "_id",
                as: "list",
                pipeline: [
                  {
                    $project: {
                      title: 1,
                      description: 1,
                      questions: 1,
                      quantity: {
                        $size: "$questions",
                      },
                    },
                  },
                  {
                    $lookup: {
                      from: "questions",
                      localField: "questions",
                      foreignField: "_id",
                      as: "questions",
                      pipeline: [
                        {
                          $sort: {
                            _id: 1,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: "$list",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          itemList: 1,
          difficulty: 1,
          description: 1,
          quantity: {
            $sum: "$itemList.list.quantity",
          },
        },
      },
      {
        $project: {
          "itemList._id": 0,
          "itemList.createdAt": 0,
          "itemList.updatedAt": 0,
          "itemList.__v": 0,
          "itemList.list._id": 0,
          "itemList.list.createdAt": 0,
          "itemList.list.updatedAt": 0,
          "itemList.list.__v": 0,
          "itemList.list.questions._id": 0,
          "itemList.list.questions.answers._id": 0,
          "itemList.list.questions.createdAt": 0,
          "itemList.list.questions.updatedAt": 0,
          "itemList.list.questions.__v": 0,
        },
      },
    ])
      .then((quizes) => {
        res.status(200).json(quizes);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getQuizesPreview(req: Request, res: Response, next: NextFunction) {
    return Quiz.aggregate([
      {
        $lookup: {
          from: "quizitems",
          localField: "itemList",
          foreignField: "_id",
          as: "itemList",
          pipeline: [
            {
              $sort: {
                _id: 1,
              },
            },
            {
              $lookup: {
                from: "lists",
                localField: "list",
                foreignField: "_id",
                as: "list",
                pipeline: [
                  {
                    $project: {
                      quantity: {
                        $size: "$questions",
                      },
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: "$list",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          difficulty: 1,
          description: 1,
          quantity: {
            $sum: "$itemList.list.quantity",
          },
        },
      },
    ])
      .then((quizes) => {
        res.status(200).json(quizes);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getLastUpdate(req: Request, res: Response, next: NextFunction) {
    return Quiz.find()
      .sort({ createdAt: -1 })
      .limit(1)
      .then((quiz) => {
        res.status(200).json({ lastUpdate: quiz[0]?.updatedAt });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }
}

export default new QuizController();
