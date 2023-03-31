import express from "express";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import apiRules from "../middlewares/apiRules";
import requestLogger from "../middlewares/requestLogger";
import router from "../routes/router";

export default () => {
  const app = express();
  app.use(helmet());
  app.use(requestLogger);
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(fileUpload());
  app.use(apiRules);
  router(app);
  return app;
};
