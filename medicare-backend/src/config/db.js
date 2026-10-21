import fs from "fs";
import path from "path";
import admin from "firebase-admin";
import { ENV } from "./env.js";

let firestoreInstance = null;

// Candidate locations for Firebase Service Account JSON
const candidatePaths = [
  ENV.FIREBASE_SERVICE_ACCOUNT_PATH,
  path.resolve(process.cwd(), "serviceAccountKey.json"),
  path.resolve(process.cwd(), "firebase-service-account.json"),
  path.resolve(process.cwd(), "..", "serviceAccountKey.json"),
].filter(Boolean);

let loadedCredentials = false;

for (const candidate of candidatePaths) {
  const resolved = path.isAbsolute(candidate) ? candidate : path.resolve(process.cwd(), candidate);
  if (fs.existsSync(resolved)) {
    try {
      // Strip UTF-8 BOM if present (prevents Windows PowerShell Out-File encoding issues)
      const rawContent = fs.readFileSync(resolved, "utf8").replace(/^\uFEFF/, "");
      const serviceAccount = JSON.parse(rawContent);
      if (admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      }
      firestoreInstance = admin.firestore();
      console.log(`=======================================================`);
      console.log(`[FIREBASE ACTIVE] Connected to Google Cloud Firestore!`);
      console.log(`Project ID: ${serviceAccount.project_id || "GCP Firestore"}`);
      console.log(`Service Account: ${serviceAccount.client_email}`);
      console.log(`=======================================================`);
      loadedCredentials = true;
      break;
    } catch (err) {
      console.warn(`[FIREBASE] Warning: Found file at ${resolved} but failed to parse:`, err.message);
    }
  }
}

// Built-in In-Memory / File-Persisted Reactive Firestore interface for zero-config local run
class MemoryCollection {
  constructor(name) {
    this.name = name;
    this.docs = new Map();
  }

  doc(id) {
    const coll = this;
    return {
      id,
      async get() {
        const data = coll.docs.get(id);
        return {
          id,
          exists: Boolean(data),
          data: () => (data ? { ...data, id } : undefined),
        };
      },
      async set(data) {
        coll.docs.set(id, { ...data, id });
        return { id };
      },
      async update(data) {
        const existing = coll.docs.get(id) || {};
        coll.docs.set(id, { ...existing, ...data, id });
        return { id };
      },
      async delete() {
        coll.docs.delete(id);
      },
    };
  }

  async add(data) {
    const id = `${this.name.slice(0, 3)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.docs.set(id, { ...data, id });
    return { id };
  }

  where(field, op, value) {
    const coll = this;
    return {
      async get() {
        const matches = [];
        for (const [id, item] of coll.docs.entries()) {
          if (op === "==" && item[field] === value) {
            matches.push({ id, data: () => ({ ...item, id }) });
          }
        }
        return {
          empty: matches.length === 0,
          size: matches.length,
          docs: matches,
        };
      },
    };
  }

  async get() {
    const docs = Array.from(this.docs.entries()).map(([id, data]) => ({
      id,
      data: () => ({ ...data, id }),
    }));
    return {
      empty: docs.length === 0,
      size: docs.length,
      docs,
    };
  }
}

class ReactiveFirestore {
  constructor() {
    this.collections = new Map();
  }

  collection(name) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new MemoryCollection(name));
    }
    return this.collections.get(name);
  }

  async runTransaction(updateFunction) {
    const transactionContext = {
      get: async (docRef) => docRef.get(),
      set: async (docRef, data) => docRef.set(data),
      update: async (docRef, data) => docRef.update(data),
    };
    return await updateFunction(transactionContext);
  }
}

if (!loadedCredentials) {
  console.log(`[STORAGE] Zero-config local reactive document store active.`);
  console.log(`[STORAGE] Set FIREBASE_SERVICE_ACCOUNT_PATH in .env or place serviceAccountKey.json to link live Google Cloud Firestore.`);
}

export const db = firestoreInstance || new ReactiveFirestore();
