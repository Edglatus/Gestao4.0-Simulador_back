import { Request, Response, NextFunction } from "express";
import Character from "../models/Character";
import FileManager from "../common/FileManager";
import { UploadedFile } from "express-fileupload";

class CharacterController {
  async createCharacter(req: Request, res: Response, next: NextFunction) {
    let characterList = [];
    let addedCharacters = [];
    let upload;

    if (req.body.characterList !== undefined) {
      characterList = JSON.parse(req.body.characterList);
    }
    else {
      characterList.push(JSON.parse(req.body.character));
    }

    if (
      req.files === undefined || req.files === null ||
      (!Array.isArray(req.files?.files)) && (characterList.length != 1) ||
      (Array.isArray(req.files?.files)) && ((req.files?.files as UploadedFile[]).length !== characterList.length)
    ) {
      res.status(400).json({ message: "Número de imagens é incompatível com número de personagens." });
    } else {
      if (req.files !== undefined && req.files !== null) {
        try {
          upload = await FileManager.upload(req.files, "portraitImages");

          for (let i = 0; i < characterList.length; i++) {
            const character = characterList[i];

            character.portrait = upload[i].id;

            const newCharacter = new Character(character);
            await newCharacter.save()
            addedCharacters.push(newCharacter);
          }
          res.status(201).json(addedCharacters);
        } catch (error: any) {
          res.status(500).json({ message: error.message || error });
        }
      }
    }
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
