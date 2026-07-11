import { NextRequest } from "next/server";
import { getDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

/**
 * POST /api/posts/[slug]/comments/[commentId]/replies
 * Push a new reply into a comment's replies array.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const body = await req.json();

    const author = (body.author || "").trim();
    const content = (body.content || "").trim();

    if (!author || !content) {
      return Response.json(
        { error: "Name and reply content are required." },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const now = new Date().toISOString();

    const newReply = {
      _id: new ObjectId(),
      author,
      content,
      createdAt: now,
    };

    const result = await db.collection("comments").updateOne(
      { _id: new ObjectId(commentId) },
      { $push: { replies: newReply as never } }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: "Comment not found." }, { status: 404 });
    }

    return Response.json({
      reply: {
        id: String(newReply._id),
        author: newReply.author,
        content: newReply.content,
        createdAt: newReply.createdAt,
      },
    });
  } catch (err) {
    console.error("POST /replies error:", err);
    return Response.json({ error: "Failed to post reply." }, { status: 500 });
  }
}
