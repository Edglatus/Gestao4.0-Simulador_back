import dotenv from "dotenv";
import { ConnectOptions } from "mongoose";
dotenv.config();

const USE_LOCAL_MONGO = Boolean(process.env.USE_LOCAL_MONGO) || false;

const MONGO_USERNAME = (USE_LOCAL_MONGO) ? process.env.MONGO_LOCAL_USERNAME || "" : process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = (USE_LOCAL_MONGO) ? process.env.MONGO_LOCAL_PASSWORD || "" : process.env.MONGO_PASSWORD || "";

const SERVER_PORT = process.env.SERVER_PORT ?? "8080";

const MONGO_HOST = (USE_LOCAL_MONGO) ? process.env.LOCAL_MONGO_HOST || "" : process.env.MONGO_HOST || "";
const MONGO_DATABASE = (USE_LOCAL_MONGO) ? `test` : process.env.MONGO_DATABASE || "test";

const MONGO_URL = (USE_LOCAL_MONGO) ?
  `mongodb://${MONGO_HOST}` :
  `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DATABASE}?retryWrites=true&w=majority`
  ;

console.log(MONGO_URL);

const options: ConnectOptions = {
  dbName: MONGO_DATABASE,
  user: MONGO_USERNAME,
  pass: MONGO_PASSWORD,
}

export const config = {
  mongo: {
    url: MONGO_URL,
    options
  },
  server: {
    port: Number(SERVER_PORT),
  },
};
