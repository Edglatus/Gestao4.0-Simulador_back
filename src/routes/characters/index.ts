import { Express } from "express";
import CharacterController from "../../controllers/CharacterController";
import { schemas, validateSchema } from "../../middlewares/validateSchema";

export default (app: Express) => {
  app
    .route("/characters")
    .get(CharacterController.getCharacters)
    .post(
      validateSchema(schemas.character.create),
      CharacterController.createCharacter
    );
  app.route("/characters/id/:id").get(CharacterController.getCharacter);
  app.route("/characters/lastUpdate").get(CharacterController.getLastUpdate);
};
