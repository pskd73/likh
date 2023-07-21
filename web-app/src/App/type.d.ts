export type NewNote = {
  text: string;
  created_at?: number;
  id?: string;
}

export type NoteMeta = {
  id: string;
};

export type SavedNote = {
  id: string;
  text: string;
  serialized?: string;
  created_at: number;
  updated_at?: number;
  reminder?: {
    date: number;
  }
};
