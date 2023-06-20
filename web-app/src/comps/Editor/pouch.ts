import PouchDB from "pouchdb";

type PouchDoc<T> = T & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta;

const db = new PouchDB("notes");
const remote = new PouchDB("http://admin:password@localhost:5984/notes");

db.sync(remote, { live: true });

const PUT_DELAY_SECS = 4;
const lastUpdateTime: Record<string, number> = {};

function shouldPut(id: string) {
  if (!lastUpdateTime[id]) {
    return true;
  }
  if (new Date().getTime() - lastUpdateTime[id] > PUT_DELAY_SECS * 1000) {
    return true;
  }
  return false;
}

export const get = async <T>(id: string) => {
  try {
    return await db.get<T>(id);
  } catch (e) {
    return undefined;
  }
};

export const put = async <T extends {}>(
  id: string,
  update: (doc?: PouchDoc<T> | T) => T,
  force?: boolean
) => {
  if (!force && !shouldPut(id)) {
    return undefined;
  }

  const existingDoc = await get<T>(id);
  if (!existingDoc) {
    await db.put(update());
  } else {
    await db.put<T>(update(existingDoc));
  }

  lastUpdateTime[id] = new Date().getTime();
};

export const all = async <T>() => {
  return await db.allDocs<T>();
}

export const del = async (id: string) => {
  const existingDoc = await get(id);
  if (existingDoc) {
    db.remove(existingDoc)
  }
}