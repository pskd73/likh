import PouchDB from "pouchdb";
import CryptoJS from "crypto-js";

type PouchDoc<T> = T & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta;

export type MyPouch = {
  get: <T>(id: string) => Promise<PouchDoc<T> | undefined>;
  put: <T extends {}>(
    id: string,
    update: (doc?: PouchDoc<T> | T) => T
  ) => Promise<void>;
  all: <T extends {}>() => Promise<PouchDB.Core.AllDocsResponse<T>>;
  del: (id: string) => Promise<void>;
  sync: (osc: (state: string) => void) => void;
};

export const MakePouch = (
  secret: string,
  config: {
    username: string;
    password: string;
  }
): MyPouch => {
  const db: PouchDB.Database = new PouchDB("notes");
  let remote: PouchDB.Database | undefined = undefined;

  if (config.username && config.password) {
    remote = new PouchDB(
      `https://${config.username}:${config.password}@sync.retronote.app:6984/notes_${config.username}`
    );
  }

  function sync(onStateChange: (state: string) => void) {
    if (remote) {
      db.sync(remote, { live: true })
        .on("change", function (info) {
          onStateChange("change");
        })
        .on("paused", function (err) {
          onStateChange("paused");
        })
        .on("active", function () {
          onStateChange("active");
        })
        .on("denied", function (err) {
          onStateChange("denied");
        })
        .on("complete", function (info) {
          onStateChange("complete");
        })
        .on("error", function (err) {
          onStateChange("error");
        });
    }
  }

  function encrypt<T>(obj: T) {
    return CryptoJS.AES.encrypt(JSON.stringify(obj), secret).toString();
  }

  function decrypt<T>(str: string): T {
    var bytes = CryptoJS.AES.decrypt(str, secret);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(originalText);
  }

  const get = async <T>(id: string) => {
    try {
      const doc = await db.get<{ payload: string }>(id);
      return decrypt(doc.payload) as T;
    } catch (e) {
      return undefined;
    }
  };

  const put = async <T extends {}>(
    id: string,
    update: (doc?: PouchDoc<T> | T) => T
  ): Promise<void> => {
    let existingDoc: PouchDoc<{ payload: string }> | undefined = undefined;
    try {
      existingDoc = await db.get<{ payload: string }>(id);
    } catch {}
    if (!existingDoc) {
      await db.put({ _id: id, payload: encrypt(update()) });
    } else {
      existingDoc.payload = encrypt(update(decrypt(existingDoc.payload)));
      await db.put(existingDoc);
    }
  };

  const all = async <T>() => {
    return await db.allDocs<T>();
  };

  const del = async (id: string) => {
    const existingDoc = await db.get(id);
    if (existingDoc) {
      await db.remove(existingDoc);
    }
  };

  return {
    get,
    put,
    all,
    del,
    sync,
  };
};
