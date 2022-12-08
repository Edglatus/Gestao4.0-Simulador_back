import { Express } from "express";
import ThemeController from "../../controllers/ThemeController";

export default (app: Express) => {
  app.route("/themes").get(ThemeController.getThemes);
};
