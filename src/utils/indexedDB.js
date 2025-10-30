import { openDB } from "idb";

const DB_NAME = "ImagineBooksDB";
const STORE_NAME = "books";

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
}

export async function saveBooks(books) {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await Promise.all(books.map((b) => tx.store.put(b)));
  await tx.done;
}

export async function getBooks() {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function deleteBook(id) {
  const db = await getDB();
  return db.delete(STORE_NAME, id);
}
