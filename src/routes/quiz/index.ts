import { Express } from "express";
import QuizController from "../../controllers/QuizController";
import { schemas, validateSchema } from "../../middlewares/validateSchema";

export default (app: Express) => {
  app
    .route("/quiz")
    .get(QuizController.getQuizes)
    .post(validateSchema(schemas.quiz.create), QuizController.createQuiz);
  app.route("/quiz/preview").get(QuizController.getQuizesPreview);
  app.route("/quiz/id/:id").get(QuizController.getQuiz);
  app.route("/quiz/id/:id/preview").get(QuizController.getQuizPreview);
  app.route("/quiz/lastUpdate").get(QuizController.getLastUpdate);
};
