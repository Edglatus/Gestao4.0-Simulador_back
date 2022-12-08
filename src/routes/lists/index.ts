import { Express } from "express";
import ListController from "../../controllers/ListController";
import { schemas, validateSchema } from "../../middlewares/validateSchema";

export default (app: Express) => {
  app
    .route("/lists")
    .get(ListController.getLists)
    .post(validateSchema(schemas.list.create), ListController.createList);
  app.route("/lists/id/:id").get(ListController.getList);
  app.route("/lists/lastUpdate").get(ListController.getLastUpdate);
};
