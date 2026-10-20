export type TurnAnswer = {
  accept: string[];
  keywords?: string[][];
  model: string;
  hint: string;
};

export type NpcTurn = {
  type: "npc";
  ms: string;
  en: string;
  audio?: string;
} & TurnAnswer;

export type PromptTurn = {
  type: "prompt";
  en: string;
} & TurnAnswer;

export type TaskTurn = NpcTurn | PromptTurn;

export type DialogueLine = {
  id: string;
  who: "npc" | "you";
  ms: string;
  en: string;
  audio?: {
    normal?: string;
    slow?: string;
  };
};

export type Chip = {
  spoken: string;
  formal: string;
  note: string;
};

export type Phrase = {
  ms: string;
  en: string;
  audio?: {
    normal?: string;
    slow?: string;
  };
};

export type CardTaskConclusion = {
  who: "npc";
  ms: string;
  en: string;
  audio?: string;
};

export type Card = {
  id: string;
  title: string;
  scene: string;
  icon: string;
  minutes: number;
  variety: string;
  review: {
    status: "draft" | "approved";
    by?: string;
    date?: string;
  };
  dialogue: DialogueLine[];
  chips: Chip[];
  phrases: Phrase[];
  task: {
    goal: string;
    turns: TaskTurn[];
    conclusion?: CardTaskConclusion;
  };
};

export type CardProgress = {
  started: boolean;
  finished: boolean;
  lastStepIndex: number;
  bestTask?: {
    turns: number;
    firstTry: number;
    withHint: number;
    assisted: number;
  };
  attempts: number;
  updatedAt: number;
};

export type ProgressMap = Record<string, CardProgress>;

export type FailedAnswer = {
  cardId: string;
  turnIndex: number;
  input: string;
  ts: number;
};

export type UserSettings = {
  defaultSpeed: "normal" | "slow";
  showEnglishDefault: boolean;
};

export type MatchResult = {
  pass: boolean;
  by: "exact" | "keywords" | "none";
  nearMiss: boolean;
};
