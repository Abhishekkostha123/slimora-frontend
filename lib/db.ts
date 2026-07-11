/**
 * Shared MongoDB connection for Next.js API Route Handlers.
 * Reuses cached connection across hot-reloads in dev.
 */
import { MongoClient, Db } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let cachedDb: Db | null = null;

export async function getDatabase(): Promise<Db> {
  if (cachedDb) return cachedDb;

  const rawUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "")
    .trim()
    .replace(/\r/g, "");

  if (
    !rawUrl.startsWith("mongodb://") &&
    !rawUrl.startsWith("mongodb+srv://")
  ) {
    throw new Error(
      "MongoDB URL not configured. Set NEXT_PUBLIC_BACKEND_URL to a mongodb:// URI."
    );
  }

  // Extract DB name from path: mongodb://host/dbname
  let dbName = "blog-admin";
  try {
    const parsed = new URL(rawUrl);
    dbName = parsed.pathname.replace(/^\//, "") || "blog-admin";
  } catch {
    const match = rawUrl.match(/\/([^/?#]+)(\?|#|$)/);
    if (match) dbName = match[1];
  }

  let clientPromise: Promise<MongoClient>;
  if (process.env.NODE_ENV === "development") {
    // In dev, use global to survive HMR
    if (!global._mongoClientPromise) {
      const client = new MongoClient(rawUrl);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    const client = new MongoClient(rawUrl);
    clientPromise = client.connect();
  }

  const connectedClient = await clientPromise;
  const db = connectedClient.db(dbName);
  cachedDb = db;
  return db;
}
