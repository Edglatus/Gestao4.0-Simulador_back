import { Request, Response, NextFunction } from "express";
import Logging from "../library/Logging";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  Logging.info(
    `Incomming -> Method: [${req.method}] - Url: [${req.url}] - Ip: [${req.socket.remoteAddress}]`
  );
  res.on("finish", () => {
    Logging.info(
      `Outgoing -> Method: [${req.method}] - Url: [${req.url}] - Ip: [${req.socket.remoteAddress}] Status: [${res.statusCode}]`
    );
  });

  next();
};

export default requestLogger;
