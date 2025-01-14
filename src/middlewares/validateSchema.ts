import Joi, { CoerceResult, ObjectSchema, object } from "joi";
import { Request, Response, NextFunction } from "express";
import Logging from "../library/Logging";
import { IQuestion } from "../models/Question";
import { IList } from "../models/List";
import { IQuizItem } from "../models/QuizItem";
import { IQuiz } from "../models/Quiz";
import { ICharacter } from "../models/Character";
import { IScenario } from "../models/Scenario";
import { IScenarioLine } from "../models/ScenarioLine";
import { IScenarioOption } from "../models/ScenarioOption";
import { IScenarioOutcome } from "../models/ScenarioOutcome";
import { ISimulationScenario } from "../models/SimulationScenario";
import { ISimulationAsset } from "../models/SimulationAsset";

const custom = Joi.extend({
  type: 'object',
  base: Joi.object(),
  coerce: {
    method(value, schema): CoerceResult {

      if (value[0] !== '{' &&
        !/^\s*\{/.test(value)) {
        return { value: undefined };
      }

      try {
        return { value: JSON.parse(value) };
      }
      catch (err) {
        console.log(err);
        return { value: undefined };
      }
    }
  }
});

export const validateSchema = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error: any) {
      Logging.error(error);
      return res.status(422).json({ message: error.message || error });
    }
  };
};

export const schemas = {
  quiz: {
    create: custom.object().keys(
      {
        quiz: Joi.object().keys({
          title: Joi.string().required(),
          itemList: Joi.array().required(),
          difficulty: Joi.number().required(),
          description: Joi.string().required(),
          backgroundURL: Joi.string().required(),
        })
      }),
  },
  quizItem: {
    create: Joi.object<IQuizItem>({
      description: Joi.string().required(),
      list: Joi.object().required(),
      requiredHits: Joi.number().required(),
    }),
  },
  list: {
    create: Joi.object<IList>({
      title: Joi.string().required(),
      description: Joi.string().required(),
      questions: Joi.array().required(),
    }),
  },
  question: {
    create: Joi.object<IQuestion>({
      prompt: Joi.string().required(),
      answers: Joi.array()
        .items({
          text: Joi.string().required(),
          correct: Joi.boolean().required(),
        })
        .has(
          Joi.object().keys({
            text: Joi.string().required(),
            correct: Joi.boolean().invalid(false).required(),
          })
        )
        .required(),
      images: Joi.array().items(
        Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required()
      ),
      theme: Joi.string().required(),
      character: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      difficulty: Joi.number().required(),
      source: Joi.string().required(),
    }),
  },
  character: {
    create: custom.object().keys(
      {
        character: Joi.object<ICharacter>({
          name: Joi.string().required(),
          role: Joi.string().required(),
          assetIndex: Joi.number().required(),
          // portrait: Joi.string()
          //   .regex(/^[0-9a-fA-F]{24}$/)
          //   .required(),
        }),
      }),
  },
  scenario: {
    create: Joi.object<IScenario>({
      title: Joi.string().required(),
      description: Joi.string().required(),
      startingLine: Joi.number().required(),
      lineList: Joi.array()
        .items({
          prompt: Joi.string().required(),
          options: Joi.array().items(Joi.number()).required(),
          character: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
        })
        .required(),
      optionList: Joi.array()
        .items({
          prompt: Joi.string().allow("").default(""),
          nextLine: Joi.number(),
          value: Joi.number().min(-1).max(1).required(),
        })
        .required(),
      positiveOutcome: { line: Joi.string().required() },
      negativeOutcome: { line: Joi.string().required() },
      characters: Joi.array()
        .items(
          Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required()
        )
        .required(),
      backgroundURL: Joi.string().required(),
    }),
  },
  simulation: {
    create:
      custom.object().keys({
        simulation:
          Joi.object<ISimulationScenario>({
            title: Joi.string().required(),
            description: Joi.string().required(),
            characterList: Joi.array()
              .items({
                character: Joi.string()
                  .regex(/^[0-9a-fA-F]{24}$/)
                  .required(),
                defaultDialogueId: Joi.number().required(),
                mapLocationIndex: Joi.number().required(),
                dialogueIds: Joi.array().items(Joi.number()).required(),
                // prefabAsset: Joi.string()
                //   .regex(/^[0-9a-fA-F]{24}$/)
                //   .required(),
              })
              .required(),
            dialogueList: Joi.array()
              .items({
                defaultLineId: Joi.number().required(),
                startingLineId: Joi.number().required(),
                lineIds: Joi.array().items(Joi.number()).required(),
                optionIds: Joi.array().items(Joi.number()).required(),
                conditionalFlag: Joi.string().allow("").default(""),
                conditionalValue: Joi.boolean().default(false),
              })
              .required(),
            lineList: Joi.array()
              .items({
                prompt: Joi.string().required(),
                conditionalFlag: Joi.string().allow("").default(""),
                conditionalValue: Joi.boolean().default(false),
                triggeredFlag: Joi.string().allow("").default(""),
                triggeredValue: Joi.boolean().default(false),
                nextLineId: Joi.number(),
                optionIds: Joi.array().items(Joi.number()).required(),
              })
              .required(),
            optionList: Joi.array()
              .items({
                prompt: Joi.allow("").default(""),
                nextLineId: Joi.number(),
                score: Joi.number().required(),
                triggeredFlag: Joi.string().allow("").default(""),
                triggeredValue: Joi.boolean().default(false),
              })
              .required(),
            dialogueFlags: Joi.array().items(Joi.string().required()).required(),
            // mapAsset: Joi.string()
            //   .regex(/^[0-9a-fA-F]{24}$/)
            //   .required(),
          }),
      })
  },
  simulationAsset: {
    create: Joi.object<ISimulationAsset>({
      assetURL: Joi.string().required(),
      assetFilename: Joi.string().required(),
      assetVersion: Joi.number().min(0).required(),
    }),
  },
};
