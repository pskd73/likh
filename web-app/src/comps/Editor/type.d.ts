export type NewNote = {
  text: string;
  created_at?: number;
}

export type NoteMeta = {
  id: string;
};

export type SavedNote = {
  id: string;
  text: string;
  serialized?: string;
  created_at: number;
};
