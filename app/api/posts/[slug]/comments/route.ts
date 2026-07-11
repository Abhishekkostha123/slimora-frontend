import { NextRequest } from "next/server";
import { getDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

/**
 * GET /api/posts/[slug]/comments
 * Fetch approved comments for a post. Used for:
 * - Client-side rendering in CommentSection
 * - Server-side pre-fetch for SEO JSON-LD embedding
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await getDatabase();

    const raw = await db
      .collection("comments")
      .find({
        postSlug: slug,
        // Accept approved/published or no status field (legacy)
        $or: [
          { status: { $in: ["approved", "published"] } },
          { status: { $exists: false } },
        ],
      })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    const comments = raw.map((c) => ({
      id: String(c._id),
      author: c.author || "Anonymous",
      content: c.content || "",
      createdAt: c.createdAt instanceof Date
        ? c.createdAt.toISOString()
        : c.createdAt || new Date().toISOString(),
      likes: c.likes ?? 0,
      replies: (c.replies || []).map((r: Record<string, unknown>) => ({
        id: String(r._id || new ObjectId()),
        author: r.author || "Anonymous",
        content: r.content || "",
        createdAt: r.createdAt instanceof Date
          ? r.createdAt.toISOString()
          : r.createdAt || new Date().toISOString(),
      })),
    }));

    return Response.json({ comments });
  } catch (err) {
    console.error("GET /comments error:", err);
    return Response.json({ comments: [] });
  }
}

/**
 * POST /api/posts/[slug]/comments
 * Submit a new comment. Auto-approved so it appears immediately.
 * Dashboard can moderate from MongoDB.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();

    const author = (body.author || "").trim();
    const content = (body.content || "").trim();

    if (!author || !content) {
      return Response.json(
        { error: "Name and comment are required." },
        { status: 400 }
      );
    }
    if (content.length > 2000) {
      return Response.json({ error: "Comment too long." }, { status: 400 });
    }

    const db = await getDatabase();
    const now = new Date().toISOString();

    const doc = {
      postSlug: slug,
      author,
      email: (body.email || "").trim(),
      content,
      createdAt: now,
      likes: 0,
      status: "approved",
      replies: [] as never[],
    };

    const result = await db.collection("comments").insertOne(doc);

    return Response.json({
      comment: { id: String(result.insertedId), ...doc },
    });
  } catch (err) {
    console.error("POST /comments error:", err);
    return Response.json({ error: "Failed to post comment." }, { status: 500 });
  }
}
