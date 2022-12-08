import { Express } from "express";
import characters from "./characters";
import healthCheck from "./healthCheck";
import images from "./images";
import lists from "./lists";
import notFound from "./notFound";
import questions from "./questions";
import quiz from "./quiz";
import quizItems from "./quizItems";
import themes from "./themes";

export default (app: Express) => {
  healthCheck(app);
  quiz(app);
  quizItems(app);
  lists(app);
  questions(app);
  characters(app);
  themes(app);
  images(app);
  notFound(app);
};
