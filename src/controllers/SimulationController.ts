import { Request, Response, NextFunction } from "express";
import validateId from "../common/validateId";
import SimulationAsset from "../models/SimulationAsset";
import SimulationCharacter from "../models/SimulationCharacter";
import SimulationDialogue from "../models/SimulationDialogue";
import SimulationLine from "../models/SimulationLine";
import SimulationOption from "../models/SimulationOption";
import SimulationScenario from "../models/SimulationScenario";
import SimulationArtifact from "../models/SimulationArtifact";
import { ApiSimulation } from "../middlewares/apiSchema";
import FileManager from "../common/FileManager";

class SimulationConttroller {
  async createSimulationAsset(req: Request, res: Response, next: NextFunction) {
    const simulationAsset = req.body;

    const newSimulationAsset = new SimulationAsset(simulationAsset);
    return newSimulationAsset
      .save()
      .then((simulationAsset) => {
        res.status(201).json(simulationAsset);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async createSimulation(req: Request, res: Response, next: NextFunction) {
    const simulation: ApiSimulation = req.body.simulation;
    const lineList = [];
    const optionList = [];
    const dialogueList = [];
    const characterList = [];
    const artifactList = [];

    let uploadedFiles;

    if (req.files) {
      uploadedFiles = await FileManager.upload(req.files, "artifactImages");
    }

    if (uploadedFiles === undefined || simulation.artifactList.length > uploadedFiles.length)
      throw new Error("Could not find required artifact files");

    for (let index = 0; index < simulation.artifactList.length; index++) {
      const artifact = await new SimulationArtifact({
        artifactName: simulation.artifactList[index].artifactName,
        imageURL: uploadedFiles[simulation.artifactList[index].imageIndex],
        description: simulation.artifactList[index].description,
        category: simulation.artifactList[index].category,
      }).save();
      artifactList.push(artifact._id);
    }

    for (let index = 0; index < simulation.optionList.length; index++) {
      const option = await new SimulationOption({
        prompt: simulation.optionList[index].prompt,
        triggeredFlag: simulation.optionList[index].triggeredFlag,
        triggeredValue: simulation.optionList[index].triggeredValue,
        score: simulation.optionList[index].score,
      }).save();
      optionList.push(option._id);
    }

    for (let index = 0; index < simulation.lineList.length; index++) {
      const optionIds = [];
      for (let j = 0; j < simulation.lineList[index].optionIds.length; j++) {
        optionIds.push(optionList[simulation.lineList[index].optionIds[j]]);
      }
      const line = await new SimulationLine({
        prompt: simulation.lineList[index].prompt,
        conditionalFlag: simulation.lineList[index].conditionalFlag,
        conditionalValue: simulation.lineList[index].conditionalValue,
        triggeredFlag: simulation.lineList[index].triggeredFlag,
        triggeredValue: simulation.lineList[index].triggeredValue,
        optionIds,
        animationFlag: simulation.lineList[index].animationFlag,
        addedArtifact: artifactList[simulation.lineList[index].addedArtifact],
        //addedArtifact: simulation.lineList[index].addedArtifact,
      }).save();
      lineList.push(line._id);
    }

    for (let index = 0; index < simulation.optionList.length; index++) {
      if (simulation.optionList[index].nextLineIndex) {
        await SimulationOption.updateOne(
          { _id: optionList[index] },
          {
            $set: {
              nextLineId: lineList[simulation.optionList[index].nextLineIndex],
            },
          }
        );
      }
    }

    for (let i = 0; i < simulation.lineList.length; i++) {
      if (simulation.lineList[i].nextLineIndex) {
        const index = simulation.lineList[i].nextLineIndex;

        if (index !== undefined)
          await SimulationLine.updateOne(
            { _id: lineList[i] },
            {
              $set: {
                nextLineId: lineList[index],
              },
            }
          );
      }
    }

    for (let index = 0; index < simulation.dialogueList.length; index++) {
      const dialogue = await new SimulationDialogue({
        defaultLineId: lineList[simulation.dialogueList[index].defaultLineId],
        startingLineId: lineList[simulation.dialogueList[index].startingLineId],
        lineIds: lineList.filter((id, filterIndex) =>
          simulation.dialogueList[index].lineIds.includes(filterIndex)
        ),
        optionIds: optionList.filter((id, filterIndex) =>
          simulation.dialogueList[index].optionIds.includes(filterIndex)
        ),
        conditionalFlag: simulation.dialogueList[index].conditionalFlag,
        conditionalValue: simulation.dialogueList[index].conditionalValue,
      }).save();
      dialogueList.push(dialogue._id);
    }

    for (let index = 0; index < simulation.characterList.length; index++) {
      const character = await new SimulationCharacter({
        ...simulation.characterList[index],
        defaultDialogueId:
          dialogueList[simulation.characterList[index].defaultDialogueId],
        dialogueIds: dialogueList.filter((id, filterIndex) =>
          simulation.characterList[index].dialogueIds.includes(filterIndex)
        ),
      }).save();
      characterList.push(character._id);
    }

    const newSimulation = new SimulationScenario({
      ...simulation,
      characterList,
      dialogueList,
      lineList,
      optionList,
      artifactList,
    });
    return newSimulation
      .save()
      .then((simulation) => {
        res.status(201).json(simulation);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getSimulation(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!validateId(id)) {
      return res.status(500).json({ message: "Invalid Id" });
    }
    return SimulationScenario.findById(id)
      .populate([
        // {
        //   path: "mapAsset",
        //   select: "-_id -createdAt -updatedAt -__v",
        // },
        {
          path: "characterList",
          select: "-createdAt -updatedAt -__v",
          populate: [
            { path: "character", select: "-createdAt -updatedAt -__v" },
            { path: "prefabAsset", select: "-createdAt -updatedAt -__v" },
          ],
        },
        {
          path: "dialogueList",
          select: "-createdAt -updatedAt -__v",
        },
        {
          path: "lineList",
          select: "-createdAt -updatedAt -__v",
        },
        {
          path: "optionList",
          select: "-createdAt -updatedAt -__v",
        },
        {
          path: "artifactList",
          select: "-createdAt -updatedAt -__v",
        },
      ])
      .then((simulation) => {
        res.status(simulation ? 200 : 404).json(
          simulation ?? {
            message: "No simulation found with this id",
          }
        );
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getSimulationPreview(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    return SimulationScenario.findById(id)
      .select(
        //"-mapAsset -characterList -dialogueList -lineList -mainObjectiveFlagIndex -optionList -createdAt -__v"
        "-mapAssetIndex -characterList -dialogueList -lineList -artifactList -mainObjectiveFlagIndex -optionList -createdAt -__v"
      )
      .then((simulation) => {
        res.status(simulation ? 200 : 404).json(
          simulation ?? {
            message: "No simulation found with this id",
          }
        );
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getSimulations(req: Request, res: Response, next: NextFunction) {
    return SimulationScenario.find()
      .populate([
        // {
        //   path: "mapAsset",
        //   select: "-_id -createdAt -updatedAt -__v",
        // },
        {
          path: "characterList",
          select: "-createdAt -updatedAt -__v",
          populate: [
            { path: "character", select: "-createdAt -updatedAt -__v" },
            { path: "prefabAsset", select: "-createdAt -updatedAt -__v" },
          ],
        },
        {
          path: "dialogueList",
          select: "-createdAt -updatedAt -__v",
        },
        {
          path: "lineList",
          select: "-createdAt -updatedAt -__v",
        },
        {
          path: "optionList",
          select: "-createdAt -updatedAt -__v",
        },
        {
          path: "artifactList",
          select: "-createdAt -updatedAt -__v",
        },
      ])
      .then((simulation) => {
        res.status(200).json(simulation);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getSimulationsPreview(req: Request, res: Response, next: NextFunction) {
    return SimulationScenario.find()
      .select(
        //"-mapAsset -characterList -dialogueList -lineList -mainObjectiveFlagIndex -optionList -createdAt -__v"
        "-mapAssetIndex -characterList -dialogueList -lineList -artifactList -mainObjectiveFlagIndex -optionList -createdAt -__v"
      )
      .then((simulation) => {
        res.status(200).json(simulation);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getLastUpdate(req: Request, res: Response, next: NextFunction) {
    return SimulationScenario.find()
      .sort({ createdAt: -1 })
      .limit(1)
      .then((simulation) => {
        res.status(200).json({ lastUpdate: simulation[0]?.updatedAt });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }
}

export default new SimulationConttroller();
