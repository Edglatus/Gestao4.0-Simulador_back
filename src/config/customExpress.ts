import express from "express";
import apiRules from "../middlewares/apiRules";
import requestLogger from "../middlewares/requestLogger";
import router from "../routes/router";
import fileUpload from "express-fileupload";

export default () => {
  const app = express();
  app.use(requestLogger);
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(fileUpload());
  app.use(apiRules);
  router(app);
  return app;
};
