let db: IDBDatabase;

export const init = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("retronote", 2);
    request.onupgradeneeded = () => {
      db = request.result;

      const objectStore = db.createObjectStore("images", {
        autoIncrement: true,
      });
    };

    request.onsuccess = () => {
      db = request.result;
      resolve();
    };

    request.onerror = (event) => {
      console.error("Unable to create database connection!");
      console.error(event);
      reject();
    };
  });
};

export const close = () => {
  db.close();
};

export const insertImage = ({ uri }: { uri: string }): Promise<number> => {
  return new Promise((resolve, reject) => {
    const txn = db.transaction("images", "readwrite");
    const store = txn.objectStore("images");
    const query = store.put({ uri });

    query.onsuccess = (e: any) => {
      // console.log("inserted image", e.target)
      resolve(e.target.result);
    };

    query.onerror = (e) => {
      reject(e);
    };
  });
};

export const getImage = (id: number): Promise<{ uri: string }> => {
  return new Promise((resolve, reject) => {
    const txn = db.transaction("images", "readwrite");
    const store = txn.objectStore("images");
    const query = store.get(id);

    query.onsuccess = (e: any) => {
      // console.log("fetched image", e.target)
      resolve(e.target.result);
    };

    query.onerror = (e) => {
      reject(e);
    };
  });
};
