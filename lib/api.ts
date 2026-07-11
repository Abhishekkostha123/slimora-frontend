import { MongoClient, Db } from "mongodb";

export interface FAQ {
  question: string;
  answer: string;
}

export interface Author {
  name: string;
  image?: string;
  bio?: string;
}

export interface AuthorFull {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  image?: string;
  expertise?: string[];
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    website?: string;
  };
  postCount?: number;
  createdAt?: string;
}

export interface CommentData {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: { id: string; author: string; content: string; createdAt: string }[];
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  description?: string;
  content: string; // pre-sanitized HTML
  coverImage?: string;
  coverImageAlt?: string;
  category?: string | Category;
  author?: Author;
  faqs?: FAQ[];
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
}

export interface PaginatedPosts {
  posts: Post[];
  total: number;
  pages: number;
  currentPage: number;
}

/**
 * Converts a slug like "manifestation-techniques" into a display-friendly
 * title like "Manifestation Techniques".
 */
function slugToTitle(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Safely normalizes an unknown value (string or partial object) into a Category.
 * Avoids unsafe `as Category` casts that fail TS structural checks.
 */
function normalizeCategory(cat: unknown): Category {
  if (cat && typeof cat === "object") {
    const c = cat as Record<string, unknown>;
    const name = typeof c.name === "string" ? c.name : String(c.name ?? "");
    const slug =
      typeof c.slug === "string" && c.slug
        ? c.slug
        : name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    return {
      id: c.id ? String(c.id) : c._id ? String(c._id) : undefined,
      name: name || "Uncategorized",
      slug: slug || "uncategorized",
      description: typeof c.description === "string" ? c.description : undefined,
    };
  }

  const str = String(cat ?? "");
  return {
    name: slugToTitle(str) || "Uncategorized",
    slug: str.toLowerCase().replace(/[^a-z0-9]/g, "-"),
  };
}

// Clean and validate the backend URL
let envBackendUrl = (
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://admin-369manifestation.vercel.app/api"
)
  .trim()
  .replace(/\r/g, "");

// Allow http://, https://, mongodb:// and mongodb+srv://
if (
  !envBackendUrl.startsWith("http://") &&
  !envBackendUrl.startsWith("https://") &&
  !envBackendUrl.startsWith("mongodb://") &&
  !envBackendUrl.startsWith("mongodb+srv://")
) {
  envBackendUrl = "https://admin-369manifestation.vercel.app/api";
}

const BACKEND_URL = envBackendUrl.replace(/\/$/, "");
const isMongo = BACKEND_URL.startsWith("mongodb://") || BACKEND_URL.startsWith("mongodb+srv://");

console.log("Using backend URL:", JSON.stringify(BACKEND_URL), "Mode:", isMongo ? "MongoDB" : "HTTP");

// MongoDB connection caching
let cachedDb: Db | null = null;

async function getDatabase(): Promise<Db> {
  if (cachedDb) return cachedDb;

  // Extract database name from mongodb URI, e.g. mongodb://127.0.0.1:27017/blog-admin -> blog-admin
  let dbName = "blog-admin";
  try {
    const urlParsed = new URL(BACKEND_URL);
    dbName = urlParsed.pathname.replace(/^\//, "") || "blog-admin";
  } catch {
    const match = BACKEND_URL.match(/\/([^/?#]+)(\?|#|$)/);
    if (match) {
      dbName = match[1];
    }
  }

  const client = new MongoClient(BACKEND_URL);
  await client.connect();
  const db = client.db(dbName);

  cachedDb = db;
  return db;
}

/**
 * Normalizes post response structure to support multiple backend formats
 */
export function normalizePost(rawPost: Record<string, unknown>): Post {
  if (!rawPost) return rawPost as unknown as Post;

  // Normalize ID (convert ObjectId to string to prevent serialization errors in RSC)
  const id = String(rawPost.id || (rawPost._id ? String(rawPost._id) : ""));

  // Normalize Cover Image
  const coverImage = String(rawPost.coverImageUrl || rawPost.coverImage || "");

  // Normalize Category
  let category: Category | string = "";
  if (rawPost.category) {
    if (typeof rawPost.category === "object") {
      category = normalizeCategory(rawPost.category);
    } else {
      const catString = String(rawPost.category);
      category = {
        name: slugToTitle(catString) || "Uncategorized",
        slug: catString.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      };
    }
  }

  // Normalize Author
  let author: Author = { name: "Slimora Editors" };
  if (rawPost.author) {
    if (typeof rawPost.author === "object") {
      const rawAuthor = rawPost.author as Record<string, unknown>;
      author = {
        name: String(rawAuthor.name || "Slimora Editors"),
        image: rawAuthor.image ? String(rawAuthor.image) : undefined,
        bio: rawAuthor.bio ? String(rawAuthor.bio) : undefined,
      };
    } else {
      author = {
        name: String(rawPost.author),
      };
    }
  }

  const createdAt = String(rawPost.publishedAt || rawPost.createdAt || new Date().toISOString());
  const updatedAt = String(rawPost.updatedAt || createdAt);

  return {
    id,
    title: String(rawPost.title || ""),
    slug: String(rawPost.slug || ""),
    excerpt: String(rawPost.excerpt || rawPost.metaDescription || rawPost.description || ""),
    description: String(rawPost.metaDescription || rawPost.description || ""),
    content: String(rawPost.content || ""),
    coverImage,
    coverImageAlt: String(rawPost.coverImageAlt || "Slimora article"),
    category,
    author,
    faqs: Array.isArray(rawPost.faqs)
      ? (rawPost.faqs as Record<string, unknown>[]).map((f) => ({
          question: String(f.question || ""),
          answer: String(f.answer || ""),
        }))
      : [],
    createdAt,
    updatedAt,
    featured: Boolean(rawPost.featured),
  };
}

/**
 * Helper to fetch with timeout and standard headers for HTTP mode.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      next: {
        revalidate: 3600, // ISR Caching: 1 hour
        ...(options.next || {}),
      },
    });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch all posts with filters and pagination
 */
export async function getPosts(params: {
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
} = {}): Promise<PaginatedPosts> {
  const { category, page = 1, limit = 10, search } = params;

  if (isMongo) {
    try {
      const db = await getDatabase();
      const query: Record<string, unknown> = { status: "published" };

      if (category) {
        // Support case-insensitive query for category slug/name
        query.category = { $regex: new RegExp("^" + category + "$", "i") };
      }

      if (search && search.trim()) {
        const searchRegex = { $regex: new RegExp(search.trim(), "i") };
        query.$or = [
          { title: searchRegex },
          { excerpt: searchRegex },
          { content: searchRegex },
          { metaDescription: searchRegex },
          { category: searchRegex },
        ];
      }

      const total = await db.collection("posts").countDocuments(query);
      const rawPosts = await db
        .collection("posts")
        .find(query)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();

      return {
        posts: rawPosts.map(normalizePost),
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error("MongoDB: Error fetching posts:", error);
      return { posts: [], total: 0, pages: 1, currentPage: 1 };
    }
  }

  // HTTP Fetch Mode
  try {
    const query = new URLSearchParams();
    if (category) query.append("category", category);
    if (page) query.append("page", String(page));
    if (limit) query.append("limit", String(limit));

    const url = `${BACKEND_URL}/posts?${query.toString()}`;
    const res = await fetchWithTimeout(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.statusText}`);
    }

    const data = await res.json();

    if (Array.isArray(data)) {
      return {
        posts: data.map(normalizePost),
        total: data.length,
        pages: Math.ceil(data.length / limit),
        currentPage: page,
      };
    }

    if (data && Array.isArray(data.posts)) {
      return {
        posts: data.posts.map(normalizePost),
        total: data.total ?? data.posts.length,
        pages: data.pages ?? Math.ceil((data.total ?? data.posts.length) / limit),
        currentPage: data.currentPage ?? page,
      };
    }

    return { posts: [], total: 0, pages: 1, currentPage: 1 };
  } catch (error) {
    console.error("HTTP: Error fetching posts:", error);
    return { posts: [], total: 0, pages: 1, currentPage: 1 };
  }
}

/**
 * Fetch a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (isMongo) {
    try {
      const db = await getDatabase();
      const rawPost = await db.collection("posts").findOne({ slug, status: "published" });
      if (!rawPost) return null;
      return normalizePost(rawPost);
    } catch (error) {
      console.error(`MongoDB: Error fetching post with slug "${slug}":`, error);
      return null;
    }
  }

  // HTTP Fetch Mode
  try {
    const url = `${BACKEND_URL}/posts/${slug}`;
    const res = await fetchWithTimeout(url);

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch post: ${res.statusText}`);
    }

    const data = await res.json();
    if (data && data.post) {
      return normalizePost(data.post);
    }
    return normalizePost(data);
  } catch (error) {
    console.error(`HTTP: Error fetching post with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
  if (isMongo) {
    try {
      const db = await getDatabase();
      let cats: unknown[] = [];

      try {
        // Try querying a dedicated 'categories' collection first
        cats = await db.collection("categories").find().toArray();
      } catch {
        // Collection might not exist, proceed to fallback
      }

      // If categories collection is empty or not present, build dynamically from distinct post categories
      if (cats.length === 0) {
        const distinctCats = await db
          .collection("posts")
          .distinct("category", { status: "published" });

        cats = distinctCats.filter(Boolean);
      }

      return cats.map((cat) => normalizeCategory(cat));
    } catch (error) {
      console.error("MongoDB: Error fetching categories:", error);
      return [];
    }
  }

  // HTTP Fetch Mode
  try {
    const url = `${BACKEND_URL}/categories`;
    const res = await fetchWithTimeout(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }

    const data = await res.json();
    let rawCategories: unknown[] = [];
    if (Array.isArray(data)) {
      rawCategories = data;
    } else if (data && Array.isArray(data.categories)) {
      rawCategories = data.categories;
    }

    return rawCategories.map((cat) => normalizeCategory(cat));
  } catch (error) {
    console.error("HTTP: Error fetching categories:", error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Author utilities
// ---------------------------------------------------------------------------

/** Converts an author name to a URL-safe slug */
export function authorNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Normalize raw MongoDB author document to AuthorFull */
export function normalizeAuthorFull(raw: Record<string, unknown>): AuthorFull {
  const name = String(raw.name || "Unknown Author");
  const slug = String(
    raw.slug ||
    raw.authorSlug ||
    authorNameToSlug(name)
  );

  const social = (raw.socialLinks as Record<string, unknown>) || {};

  return {
    id: String(raw._id || raw.id || ""),
    name,
    slug,
    bio: String(raw.bio || raw.description || ""),
    image: String(raw.image || raw.avatar || raw.photo || raw.profileImage || ""),
    expertise: Array.isArray(raw.expertise)
      ? (raw.expertise as string[])
      : Array.isArray(raw.skills)
      ? (raw.skills as string[])
      : [],
    socialLinks: {
      twitter: String(social.twitter || raw.twitter || ""),
      facebook: String(social.facebook || raw.facebook || ""),
      instagram: String(social.instagram || raw.instagram || ""),
      linkedin: String(social.linkedin || raw.linkedin || ""),
      youtube: String(social.youtube || raw.youtube || ""),
      website: String(social.website || raw.website || ""),
    },
    createdAt: raw.createdAt
      ? typeof raw.createdAt === "string"
        ? raw.createdAt
        : new Date(raw.createdAt as string | number | Date).toISOString()
      : new Date().toISOString(),
  };
}

/**
 * Fetch a single author by their slug.
 * Tries 'authors' collection first; falls back to synthesising from posts data.
 */
export async function getAuthorBySlug(
  slug: string
): Promise<AuthorFull | null> {
  if (isMongo) {
    try {
      const db = await getDatabase();

      // 1) Try dedicated authors collection
      let raw: Record<string, unknown> | null = await db.collection("authors").findOne({ slug });

      // 2) Try matching by authorSlug field
      if (!raw) {
        raw = await db.collection("authors").findOne({ authorSlug: slug });
      }

      // 3) Try matching by name-derived slug
      if (!raw) {
        const allAuthors = await db.collection("authors").find().toArray();
        raw = allAuthors.find(
          (a) => authorNameToSlug(String(a.name || "")) === slug
        ) || null;
      }

      // 4) Synthesise from posts collection if no authors collection
      if (!raw) {
        const post = await db
          .collection("posts")
          .findOne(
            {
              $or: [
                { "author.slug": slug },
                // match by name-derived slug
              ],
            },
            { projection: { author: 1 } }
          );

        // Try name match from posts
        if (!post) {
          const posts = await db
            .collection("posts")
            .find({ status: "published" }, { projection: { author: 1 } })
            .toArray();

          const matchedPost = posts.find((p) => {
            const authorName =
              typeof p.author === "object" ? p.author?.name : p.author;
            return authorName && authorNameToSlug(String(authorName)) === slug;
          });

          if (matchedPost) {
            const authorData =
              typeof matchedPost.author === "object"
                ? matchedPost.author
                : { name: matchedPost.author };
            raw = { ...authorData, slug };
          }
        } else if (post) {
          const authorData =
            typeof post.author === "object"
              ? post.author
              : { name: post.author };
          raw = { ...authorData, slug };
        }
      }

      if (!raw) return null;

      // Count posts for this author
      const allPosts = await db
        .collection("posts")
        .find({ status: "published" }, { projection: { author: 1 } })
        .toArray();

      const postCount = allPosts.filter((p) => {
        const name =
          typeof p.author === "object" ? p.author?.name : p.author;
        return name && authorNameToSlug(String(name)) === slug;
      }).length;

      return { ...normalizeAuthorFull(raw), postCount };
    } catch (error) {
      console.error("MongoDB: Error fetching author:", error);
      return null;
    }
  }

  // HTTP mode — try backend if it supports /authors endpoint
  try {
    const res = await fetchWithTimeout(`${BACKEND_URL}/authors/${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    return normalizeAuthorFull(data?.author || data);
  } catch {
    return null;
  }
}

/**
 * Fetch posts belonging to a specific author (by slug).
 */
export async function getAuthorPosts(
  authorSlug: string,
  params: { page?: number; limit?: number } = {}
): Promise<PaginatedPosts> {
  const { page = 1, limit = 12 } = params;

  if (isMongo) {
    try {
      const db = await getDatabase();

      const allPublished = await db
        .collection("posts")
        .find({ status: "published" })
        .sort({ publishedAt: -1, createdAt: -1 })
        .toArray();

      const matching = allPublished.filter((p) => {
        const name =
          typeof p.author === "object" ? p.author?.name : p.author;
        return name && authorNameToSlug(String(name)) === authorSlug;
      });

      const total = matching.length;
      const sliced = matching.slice((page - 1) * limit, page * limit);

      return {
        posts: sliced.map(normalizePost),
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error("MongoDB: Error fetching author posts:", error);
      return { posts: [], total: 0, pages: 1, currentPage: 1 };
    }
  }

  return { posts: [], total: 0, pages: 1, currentPage: 1 };
}

// ---------------------------------------------------------------------------
// Comments — server-side pre-fetch (for SEO JSON-LD)
// ---------------------------------------------------------------------------

/**
 * Fetch approved comments for a post directly from MongoDB.
 * Used server-side to embed comments in Schema.org JSON-LD.
 */
export async function getInitialComments(
  postSlug: string
): Promise<CommentData[]> {
  if (!isMongo) return [];

  try {
    const db = await getDatabase();
    const raw = await db
      .collection("comments")
      .find({
        postSlug,
        $or: [
          { status: { $in: ["approved", "published"] } },
          { status: { $exists: false } },
        ],
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return raw.map((c) => ({
      id: String(c._id),
      author: String(c.author || "Anonymous"),
      content: String(c.content || ""),
      createdAt:
        c.createdAt instanceof Date
          ? c.createdAt.toISOString()
          : String(c.createdAt || new Date().toISOString()),
      likes: c.likes ?? 0,
      replies: (c.replies || []).map((r: Record<string, unknown>) => ({
        id: String(r._id || r.id || ""),
        author: String(r.author || "Anonymous"),
        content: String(r.content || ""),
        createdAt:
          r.createdAt instanceof Date
            ? r.createdAt.toISOString()
            : String(r.createdAt || new Date().toISOString()),
      })),
    }));
  } catch (error) {
    console.error("MongoDB: Error fetching initial comments:", error);
    return [];
  }
}