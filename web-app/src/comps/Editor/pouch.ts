import PouchDB from "pouchdb";
import CryptoJS from "crypto-js";

const SECRET = "mysecret";

type PouchDoc<T> = T & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta;

const db = new PouchDB("notes");
const remote = new PouchDB("http://admin:password@localhost:5984/notes");

db.sync(remote, { live: true });

function encrypt<T>(obj: T) {
  return CryptoJS.AES.encrypt(JSON.stringify(obj), SECRET).toString();
}

function decrypt<T>(str: string): T {
  var bytes = CryptoJS.AES.decrypt(str, SECRET);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(originalText);
}

export const get = async <T>(id: string) => {
  try {
    const doc = await db.get<{ payload: string }>(id);
    return decrypt(doc.payload) as T;
  } catch (e) {
    return undefined;
  }
};

export const put = async <T extends {}>(
  id: string,
  update: (doc?: PouchDoc<T> | T) => T
) => {
  const existingDoc = await db.get<{ payload: string }>(id);
  if (!existingDoc) {
    await db.put({ _id: id, payload: encrypt(update()) });
  } else {
    existingDoc.payload = encrypt(update(decrypt(existingDoc.payload)));
    await db.put(existingDoc);
  }
};

export const all = async <T>() => {
  return await db.allDocs<T>();
};

export const del = async (id: string) => {
  const existingDoc = await db.get(id);
  if (existingDoc) {
    db.remove(existingDoc);
  }
};
