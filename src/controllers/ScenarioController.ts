import { Request, Response, NextFunction } from "express";
import validateId from "../common/validateId";
import Scenario from "../models/Scenario";
import ScenarioLine from "../models/ScenarioLine";
import ScenarioOption from "../models/ScenarioOption";
import ScenarioOutcome from "../models/ScenarioOutcome";

class ScenarioConttroller {
  async createScenario(req: Request, res: Response, next: NextFunction) {
    const scenario = req.body;
    const lineList = [];
    const optionList = [];

    for (let index = 0; index < scenario.optionList.length; index++) {
      const option = await new ScenarioOption({
        prompt: scenario.optionList[index].prompt,
        value: scenario.optionList[index].value,
      }).save();
      optionList.push(option._id);
    }

    for (let index = 0; index < scenario.lineList.length; index++) {
      const options = [];
      for (let j = 0; j < scenario.lineList[index].options.length; j++) {
        options.push(optionList[scenario.lineList[index].options[j]]);
      }
      const line = await new ScenarioLine({
        ...scenario.lineList[index],
        options,
      }).save();
      lineList.push(line._id);
    }

    for (let index = 0; index < scenario.optionList.length; index++) {
      if (scenario.optionList[index].nextLine) {
        await ScenarioOption.updateOne(
          { _id: optionList[index] },
          {
            $set: {
              nextLine: lineList[scenario.optionList[index].nextLine],
            },
          }
        );
      }
    }

    const positiveOutcome = await new ScenarioOutcome(
      scenario.positiveOutcome
    ).save();
    const negativeOutcome = await new ScenarioOutcome(
      scenario.negativeOutcome
    ).save();
    const newScenario = new Scenario({
      ...scenario,
      startingLine: lineList[scenario.startingLine],
      lineList,
      optionList,
      positiveOutcome,
      negativeOutcome,
    });
    return newScenario
      .save()
      .then((scenario) => {
        res.status(201).json(scenario);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getScenario(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!validateId(id)) {
      return res.status(500).json({ message: "Invalid Id" });
    }
    return Scenario.findById(id)
      .populate([
        {
          path: "lineList",
          select: "-createdAt -updatedAt -__v",
        },
        {
          path: "optionList",
          select: "-createdAt -updatedAt -__v",
        },
        {
          path: "positiveOutcome",
          select: "-createdAt -updatedAt -__v",
        },
        {
          path: "negativeOutcome",
          select: "-createdAt -updatedAt -__v",
        },
      ])
      .then((scenario) => {
        res.status(scenario ? 200 : 404).json(
          scenario ?? {
            message: "No scenario found with this id",
          }
        );
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getScenarioPreview(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    return Scenario.findById(id)
      .select(
        "-startingLine -lineList -optionList -positiveOutcome -negativeOutcome -characters -createdAt -__v"
      )
      .then((scenario) => {
        res.status(scenario ? 200 : 404).json(
          scenario ?? {
            message: "No scenario found with this id",
          }
        );
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getScenarios(req: Request, res: Response, next: NextFunction) {
    return Scenario.find()
      .populate([
        {
          path: "lineList",
          select: "-createdAt -updatedAt -__v",
        },
        {
          path: "optionList",
          select: "-createdAt -updatedAt -__v",
        },
        {
          path: "positiveOutcome",
          select: "-createdAt -updatedAt -__v",
        },
        {
          path: "negativeOutcome",
          select: "-createdAt -updatedAt -__v",
        },
      ])
      .then((scenarios) => {
        res.status(200).json(scenarios);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getScenariosPreview(req: Request, res: Response, next: NextFunction) {
    return Scenario.find()
      .select(
        "-startingLine -lineList -optionList -positiveOutcome -negativeOutcome -characters -createdAt -updatedAt -__v"
      )
      .then((scenarios) => {
        res.status(200).json(scenarios);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }

  async getLastUpdate(req: Request, res: Response, next: NextFunction) {
    return Scenario.find()
      .sort({ createdAt: -1 })
      .limit(1)
      .then((scenario) => {
        res.status(200).json({ lastUpdate: scenario[0]?.updatedAt });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || error });
      });
  }
}

export default new ScenarioConttroller();
