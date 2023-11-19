//#region Quiz
export interface ApiQuiz {
    title: string;
    itemList: Array<QuizItem>;
    difficulty: number;
    description: string;
    backgroundURL: string;
}
export interface QuizItem {
    description: string;
    list: QuizList;
    requiredHits: number;
}
export interface QuizList {
    title: string;
    description: string;
    questions: Array<QuizQuestion>;
}
export interface QuizAnswer {
    text: string;
    correct: boolean;
}
export interface QuizQuestion {
    prompt: string;
    answers: Array<QuizAnswer>;
    imageIndexes: Array<number>;
    theme: string;
    character: String;
    difficulty: number;
    source: string;
}
//#endregion

//#region Scenario
export interface ApiScenario {
    title: string;
    description: string;
    startingLine: number;
    lineList: Array<ScenarioLine>;
    optionList: Array<ScenarioOption>;
    positiveOutcome: ScenarioOutcome;
    negativeOutcome: ScenarioOutcome;
    characters: Array<String>;
    backgroundURL: string;
}
export interface ScenarioLine {
    prompt: string;
    options: Array<number>;
    character: String;
}
export interface ScenarioOption {
    prompt: string;
    nextLine?: number;
    value: number;
}
export interface ScenarioOutcome {
    line: string;
}
//#endregion

//#region Simulation
export interface ApiSimulation {
    title: string;
    description: string;
    dialogueFlags: Array<string>;
    // mapAsset: ObjectId;
    characterList: Array<SimulationCharacter>;
    dialogueList: Array<SimulationDialogue>;
    lineList: Array<SimulationLine>;
    optionList: Array<SimulationOption>;
    mainObjectiveFlagIndex: number;
    mapAssetIndex: number;
    artifactList: Array<SimulationArtifact>;
}
export interface SimulationCharacter {
    character: string;
    defaultDialogueId: number;
    dialogueIds: Array<number>;
    mapLocationIndex: number;
}
export interface SimulationArtifact {
    artifactName: string;
    imageIndex: number;
    description: string;
    category: string
}
export interface SimulationDialogue {
    startingLineId: number;
    defaultLineId: number;
    lineIds: Array<number>;
    optionIds: Array<number>;
    conditionalFlag?: string;
    conditionalValue?: boolean;
}
export interface SimulationLine {
    prompt: string;
    nextLineIndex?: number;
    optionIds: Array<number>;
    conditionalFlag?: string;
    conditionalValue?: boolean;
    triggeredFlag?: string;
    triggeredValue?: boolean;
    animationFlag: string;
    addedArtifact: number;
}
export interface SimulationOption {
    prompt: string;
    nextLineIndex: number;
    triggeredFlag?: string;
    triggeredValue?: boolean;
    score: number;
}

// Character
export interface ICharacterAPI {
    _id: string;
    name: string;
    role: string;
    portrait: string;
    assetIndex: number;
}
//#endregion