import mongoose from "mongoose";
import { config } from "./config/config";
import customExpress from "./config/customExpress";
import Logging from "./library/Logging";

const { port } = config.server;
const app = customExpress();

mongoose
  .connect(config.mongo.url, config.mongo.options)
  .then(() => {
    Logging.info("Connected to mongoDB.");
    app.listen(port, () =>
      Logging.info(`Server listening on http://localhost:${port}`)
    );
  })
  .catch((error) => {
    Logging.error("Unable to connect: ");
    Logging.error(error);
  });
