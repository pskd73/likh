export type Note = {
  id: number;
  title: string;
  text: string;
  createdAt: number;
  hashtags: string[];
};

export type Topic = {
  title: string;
  createdAt: number;
};

export type Suggestion = {
  title: string;
  createdAt: number;
  topic: string;
};

export enum Font {
  SpecialElite = "Special Elite",
  JetBrainsMono = "JetBrains Mono"
}

export type Settings = {
  font?: string;
  typeSounds?: boolean;
  darkMode?: boolean;
};
