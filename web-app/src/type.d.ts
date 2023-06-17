export type Note = {
  id: string;
  title: string;
  text: string;
  created_at: number;
  visibility: "private" | "public";
  slate_value?: string;
  plain_text?: string;
  plain_title: string;
  slug?: string;
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
  CourierPrime = "Courier Prime",
  CutiveMono = "Cutive Mono",
}

export type Settings = {
  font?: string;
  typeSounds?: boolean;
  darkMode?: boolean;
  goal?: string;
};

export type User = {
  email: string;
  token: string;
  username?: string;
  setting?: {
    write_font?: string;
    blog_font?: string;
  }
};
