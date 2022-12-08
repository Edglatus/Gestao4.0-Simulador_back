import { Express, Request, Response, NextFunction } from "express";

export default (app: Express) => {
  app.get("/ping", (req: Request, res: Response, next: NextFunction) =>
    res.status(200).json({ message: "pong" })
  );
};
