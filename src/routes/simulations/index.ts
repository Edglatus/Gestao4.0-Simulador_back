import { Express } from "express";
import SimulationController from "../../controllers/SimulationController";
import { schemas, validateSchema } from "../../middlewares/validateSchema";

export default (app: Express) => {
  app
    .route("/simulations")
    .get(SimulationController.getSimulations)
    .post(
      validateSchema(schemas.simulation.create),
      SimulationController.createSimulation
    );
  app
    .route("/simulations/preview")
    .get(SimulationController.getSimulationsPreview);
  app.route("/simulations/id/:id").get(SimulationController.getSimulation);
  app
    .route("/simulations/id/:id/preview")
    .get(SimulationController.getSimulationPreview);
  app.route("/simulations/lastUpdate").get(SimulationController.getLastUpdate);
  app
    .route("/simulations/assets")
    .post(
      validateSchema(schemas.simulationAsset.create),
      SimulationController.createSimulationAsset
    );
};
