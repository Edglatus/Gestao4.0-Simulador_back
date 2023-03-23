import { Express } from "express";
import ScenarioController from "../../controllers/ScenarioController";
import { schemas, validateSchema } from "../../middlewares/validateSchema";

export default (app: Express) => {
  app
    .route("/scenarios")
    .get(ScenarioController.getScenarios)
    .post(
      validateSchema(schemas.scenario.create),
      ScenarioController.createScenario
    );
  app.route("/scenarios/preview").get(ScenarioController.getScenariosPreview);
  app.route("/scenarios/id/:id").get(ScenarioController.getScenario);
  app
    .route("/scenarios/id/:id/preview")
    .get(ScenarioController.getScenarioPreview);
  app.route("/scenarios/lastUpdate").get(ScenarioController.getLastUpdate);
};
