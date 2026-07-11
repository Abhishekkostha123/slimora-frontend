import { NextRequest } from "next/server";
import { getDatabase } from "@/lib/db";

/** POST /api/posts/[slug]/dislikes → increment dislikes by 1 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await getDatabase();
    await db
      .collection("posts")
      .updateOne({ slug }, { $inc: { dislikes: 1 } });

    const post = await db
      .collection("posts")
      .findOne({ slug }, { projection: { likes: 1, dislikes: 1 } });

    return Response.json({ likes: post?.likes ?? 0, dislikes: post?.dislikes ?? 0 });
  } catch {
    return Response.json({ error: "Failed to dislike post" }, { status: 500 });
  }
}

/** DELETE /api/posts/[slug]/dislikes → decrement dislikes by 1 (toggle off) */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await getDatabase();
    await db
      .collection("posts")
      .updateOne({ slug, dislikes: { $gt: 0 } }, { $inc: { dislikes: -1 } });

    const post = await db
      .collection("posts")
      .findOne({ slug }, { projection: { likes: 1, dislikes: 1 } });

    return Response.json({ likes: post?.likes ?? 0, dislikes: post?.dislikes ?? 0 });
  } catch {
    return Response.json({ error: "Failed to remove dislike" }, { status: 500 });
  }
}
