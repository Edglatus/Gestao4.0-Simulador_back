import { Express } from "express";
import ScenarioController from "../../controllers/ScenarioController";
import { schemas, validateSchema } from "../../middlewares/validateSchema";

export default (app: Express) => {
    app
      .route("/scenario")
      .get(ScenarioController.getScenarios)
      .post(validateSchema(schemas.scenario.create), ScenarioController.createScenario);
    app.route("/scenario/preview").get(ScenarioController.getScenariosPreview);
    app.route("/scenario/id/:id").get(ScenarioController.getScenario);
    app.route("/scenario/id/:id/preview").get(ScenarioController.getScenarioPreview);
    app.route("/scenario/lastUpdate").get(ScenarioController.getLastUpdate);
  };
