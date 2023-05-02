import { API_HOST } from "../config";
import { LoggedInUser, Note } from "../type";

export const getNotes = async (
  user: LoggedInUser
): Promise<Record<string, Note>> => {
  const res = await fetch(`${API_HOST}/notes`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
  const resJson = await res.json();
  const coll: Record<string, Note> = {};
  for (const note of resJson) {
    coll[note.id] = note;
  }
  return coll;
};

export const saveNote = async (user: LoggedInUser, note: Note) => {
  await fetch(`${API_HOST}/note`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify({
      id: note.id,
      title: note.title,
      text: note.text,
    }),
  });
};

export const createNote = async (
  user: LoggedInUser,
  title: string,
  text: string
): Promise<Note> => {
  const res = await fetch(`${API_HOST}/note`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify({
      title,
      text,
    }),
  });
  return await res.json();
};

export const deleteNote = async (
  user: LoggedInUser,
  note_id: string
): Promise<void> => {
  await fetch(`${API_HOST}/delete-note`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify({
      note_id,
    }),
  });
};
