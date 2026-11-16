export type TurnAnswer = {
  id?: string;
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
  id?: string;
  spoken: string;
  formal: string;
  note: string;
};

export type Phrase = {
  id: string;
  ms: string;
  en: string;
  register?: 'informal' | 'neutral' | 'polite' | 'formal';
  wordGlosses?: WordGloss[];
  usageNote?: string;
  review: PhraseReview;
  audio?: {
    normal?: string;
    slow?: string;
  };
};

export type WordGloss = {
  malay: string;
  english: string;
  reviewStatus: 'draft' | 'approved';
  reviewer?: string;
  reviewedAt?: string;
};

export type PhraseReview = {
  status: 'draft' | 'approved';
  reviewer: string | null;
  reviewedAt: string | null;
  notes: string[];
};

export type SavedPhrase = {
  id: string;
  scenarioId: string;
  malay: string;
  english: string;
  savedAt: number;
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
  learnerGoal: string;
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
  referencePhrases?: Phrase[];
  comprehensionQuestions: ComprehensionQuestion[];
  task: {
    goal: string;
    turns: TaskTurn[];
    conclusion?: CardTaskConclusion;
  };
};

export type ComprehensionQuestion = {
  id: string;
  prompt: string;
  choices: { id: string; text: string }[];
  correctChoiceId: string;
  explanation: string;
  reviewStatus: 'draft' | 'approved';
  audioText?: string;
  audio?: { normal?: string; slow?: string };
};

export type CardProgress = {
  started: boolean;
  finished: boolean;
  lastStepIndex: number;
  taskDraft?: TaskDraftProgress;
  comprehensionResults?: Record<string, boolean>;
  bestTask?: {
    turns: number;
    firstTry: number;
    withHint: number;
    assisted: number;
    attempts?: number;
    phrasesToRevisit?: string[];
  };
  attempts: number;
  updatedAt: number;
};

export type TaskDraftProgress = {
  turnIndex: number;
  inputMode: 'type' | 'wordbank';
  typedInput: string;
  selectedWordTiles: { id: string; word: string }[];
  turnState: {
    status: 'answering' | 'passed' | 'hint' | 'assisted';
    attempts: number;
    nearMiss: boolean;
  };
  firstTryCount: number;
  withHintCount: number;
  assistedCount: number;
  totalAttempts: number;
  phrasesToRevisit: string[];
  isConcluding: boolean;
  assistedReconstructed: boolean;
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
  status: 'accepted' | 'close' | 'incorrect';
  pass: boolean;
  by: "exact" | "keywords" | "none";
  nearMiss: boolean;
};
