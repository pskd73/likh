export type Note = {
  id: string;
  title: string;
  text: string;
  created_at: number;
  visibility: "private" | "public";
};

export type NewNote = Omit<Note, "id">;

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
  CourierPrime = "Courier Prime",
  CutiveMono = "Cutive Mono",
}

export type Settings = {
  font?: string;
  typeSounds?: boolean;
  darkMode?: boolean;
  goal?: string;
};

export type LoggedInUser = {
  email: string;
  token: string;
};
