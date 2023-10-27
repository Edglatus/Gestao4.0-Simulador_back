import { Request, Response, NextFunction } from "express";
import Character from "../models/Character";
import FileManager from "../common/FileManager";

class CharacterController {
  async createCharacter(req: Request, res: Response, next: NextFunction) {
    const character = JSON.parse(req.body.character);

    if(req.files) {
      const upload = await FileManager.upload(req.files, "portraitImages");
      character.portrait = upload[0].id;
    }

    const newCharacter = new Character(character);
    return newCharacter
      .save()
      .then((character) => {
        res.status(201).json(character);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getCharacter(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    return Character.findById(id)
      .then((character) => {
        res.status(character ? 200 : 404).json(
          character ?? {
            message: "No character found with this id",
          }
        );
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getCharacters(req: Request, res: Response, next: NextFunction) {
    return Character.find()
      .then((character) => {
        res.status(200).json(character);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getLastUpdate(req: Request, res: Response, next: NextFunction) {
    return Character.find()
      .sort({ createdAt: -1 })
      .limit(1)
      .then((character) => {
        res.status(200).json({ lastUpdate: character[0]?.updatedAt });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }
}

export default new CharacterController();
