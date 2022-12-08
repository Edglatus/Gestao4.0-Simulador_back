import { Express } from "express";
import QuizItemController from "../../controllers/QuizItemController";
import { schemas, validateSchema } from "../../middlewares/validateSchema";

export default (app: Express) => {
  app
    .route("/quizItems")
    .get(QuizItemController.getQuizItems)
    .post(
      validateSchema(schemas.quizItem.create),
      QuizItemController.createQuizItem
    );
  app.route("/quizItems/id/:id").get(QuizItemController.getQuizItem);
  app.route("/quizItems/lastUpdate").get(QuizItemController.getLastUpdate);
};
