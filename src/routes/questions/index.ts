import { Express } from "express";
import QuestionController from "../../controllers/QuestionController";
import { schemas, validateSchema } from "../../middlewares/validateSchema";

export default (app: Express) => {
  app
    .route("/questions")
    .get(QuestionController.getQuestions)
    .post(
      validateSchema(schemas.question.create),
      QuestionController.createQuestion
    );
  app.route("/questions/id/:id").get(QuestionController.getQuestion);
  app.route("/questions/lastUpdate").get(QuestionController.getLastUpdate);
};
