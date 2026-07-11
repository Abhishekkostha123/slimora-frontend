import { NextRequest } from "next/server";
import { getDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

/**
 * POST /api/posts/[slug]/comments/[commentId]/like → increment likes
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const db = await getDatabase();

    await db
      .collection("comments")
      .updateOne({ _id: new ObjectId(commentId) }, { $inc: { likes: 1 } });

    const comment = await db
      .collection("comments")
      .findOne({ _id: new ObjectId(commentId) }, { projection: { likes: 1 } });

    return Response.json({ likes: comment?.likes ?? 0 });
  } catch {
    return Response.json({ error: "Failed to like comment" }, { status: 500 });
  }
}

/**
 * DELETE /api/posts/[slug]/comments/[commentId]/like → decrement likes (toggle off)
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const db = await getDatabase();

    await db
      .collection("comments")
      .updateOne(
        { _id: new ObjectId(commentId), likes: { $gt: 0 } },
        { $inc: { likes: -1 } }
      );

    const comment = await db
      .collection("comments")
      .findOne({ _id: new ObjectId(commentId) }, { projection: { likes: 1 } });

    return Response.json({ likes: comment?.likes ?? 0 });
  } catch {
    return Response.json({ error: "Failed to unlike comment" }, { status: 500 });
  }
}
