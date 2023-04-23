import { Note, Topic } from "../type";

export type NoteCollection = Record<string, Note>;
export type TopicCollection = Record<string, Topic>;

const STORAGE_KEY_NOTES = "notes";
const STORAGE_KEY_IDS = "ids";
const STORAGE_KEY_TOPICS = "topics";

const saveNoteCollection = (collection: NoteCollection) => {
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(collection));
};

export const getNoteCollection = (): NoteCollection => {
  const raw = localStorage.getItem(STORAGE_KEY_NOTES);
  if (!raw) {
    return {};
  }
  return JSON.parse(raw);
};

export const saveNote = (note: Note) => {
  const collection = getNoteCollection();
  collection[note.id] = note;
  saveNoteCollection(collection);
};

export const getNote = (id: string) => {
  return getNoteCollection()[id];
};

export const deleteNote = (id: number) => {
  const collection = getNoteCollection();
  delete collection[id];
  saveNoteCollection(collection);
};

export const getNextId = (type: string): number => {
  let rawIds = localStorage.getItem(STORAGE_KEY_IDS);
  if (!rawIds) {
    rawIds = "{}";
  }
  const ids = JSON.parse(rawIds);
  const prev = ids[type] || 0;
  const next = prev + 1;
  ids[type] = next;
  localStorage.setItem(STORAGE_KEY_IDS, JSON.stringify(ids));
  return ids[type];
};

export const getTopics = (): TopicCollection => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY_TOPICS) || "{}");
};

export const saveTopicCollection = (coll: TopicCollection) => {
  localStorage.setItem(STORAGE_KEY_TOPICS, JSON.stringify(coll));
};

export const addTopic = (topic: Topic) => {
  const topics = getTopics();
  topics[topic.title] = topic;
  saveTopicCollection(topics);
};

export const deleteTopic = (title: string) => {
  const topics = getTopics();
  delete topics[title];
  saveTopicCollection(topics);
};
