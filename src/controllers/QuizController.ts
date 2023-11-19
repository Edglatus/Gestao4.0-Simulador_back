import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import validateId from "../common/validateId";
import Quiz from "../models/Quiz";
import Question from "../models/Question";
import List from "../models/List";
import QuizItem from "../models/QuizItem";
import FileManager from "../common/FileManager";
import { ApiQuiz } from "../middlewares/apiSchema";

class QuizController {
  async createQuiz(req: Request, res: Response, next: NextFunction) {
    try {

      const quiz: ApiQuiz = JSON.parse(req.body.quiz);
      
      let uploadedFiles;
      
      if(req.files) {
        uploadedFiles = await FileManager.upload(req.files, "questionsImages");
      }
  
      const itemIds = [];
      for (const item of quiz.itemList) {
        const questionIds = [];
        const list = item.list;
        for (const question of list.questions) {
          const imageIds = [];
  
          if(uploadedFiles) {
            for (let i = 0; i < question.imageIndexes.length; i++) {
              const imgIndex = question.imageIndexes[i];              
              imageIds.push(uploadedFiles[imgIndex].id);
            }
          }
  
          let newQuestion;
  
          const foundQuestion = await Question.findOne({prompt: question.prompt}).exec();
  
          if(foundQuestion == undefined)
            newQuestion = await new Question({...question, images: imageIds}).save();
          else{
            await Question.findOneAndUpdate({_id: foundQuestion._id}, new Question({...question, images: imageIds, _id: foundQuestion._id})).exec();
            newQuestion = {_id: foundQuestion._id};
          }
  
          questionIds.push(newQuestion._id);
        }
  
        var newList;
        const foundList = await List.findOne({title: list.title}).exec();
        if(foundList == undefined)
          newList = await new List({...list, questions: questionIds}).save();
        else {
          await List.findOneAndUpdate({_id: foundList._id}, new List({...list, _id: foundList._id, questions: questionIds})).exec();
          newList = {_id: foundList._id};
        }
        
        const newItem = await new QuizItem({...item, list: newList._id}).save();
  
        itemIds.push(newItem._id);
      }
  
      const newQuiz = new Quiz({
        ...quiz,
        itemList: itemIds
      })
  
      // const quiz = new Quiz(req.body);
      return newQuiz
        .save()
        .then((quiz) => {
          res.status(201).json(quiz);
        })
        .catch((error) => {
          res.status(500).json({ message: error.message || error });
      });
    }
    catch(error: any) {
      res.status(500).json({ message: error.message || error });
    }
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
          updatedAt: 1,
          createdAt: 1,
          backgroundURL: 1,
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
      .select("-itemList -createdAt -backgroundURL -__v")
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
          updatedAt: 1,
          createdAt: 1,
          backgroundURL: 1,
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
          updatedAt: 1,
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
