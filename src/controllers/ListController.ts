import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import validateId from "../common/validateId";
import List from "../models/List";

class ListController {
  async createList(req: Request, res: Response, next: NextFunction) {
    const list = new List(req.body);
    return list
      .save()
      .then((list) => {
        res.status(201).json(list);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getList(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!validateId(id)) {
      return res.status(500).json({ message: "Invalid Id" });
    }
    return List.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
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
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          questions: 1,
          quantity: {
            $size: "$questions",
          },
        },
      },
      {
        $project: {
          "questions._id": 0,
          "questions.answers._id": 0,
          "questions.createdAt": 0,
          "questions.updatedAt": 0,
          "questions.__v": 0,
        },
      },
    ])
      .then((list) => {
        res.status(list.length ? 200 : 404).json(
          list[0] ?? {
            message: "No list found with this id",
          }
        );
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getLists(req: Request, res: Response, next: NextFunction) {
    return List.aggregate([
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
          _id: 1,
          title: 1,
          description: 1,
          questions: 1,
          quantity: {
            $size: "$questions",
          },
        },
      },
      {
        $project: {
          "questions._id": 0,
          "questions.answers._id": 0,
          "questions.createdAt": 0,
          "questions.updatedAt": 0,
          "questions.__v": 0,
        },
      },
    ])
      .then((lists) => {
        res.status(200).json(lists);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getLastUpdate(req: Request, res: Response, next: NextFunction) {
    return List.find()
      .sort({ createdAt: -1 })
      .limit(1)
      .then((list) => {
        res.status(200).json({ lastUpdate: list[0]?.updatedAt });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }
}

export default new ListController();
