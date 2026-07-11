import { NextRequest } from "next/server";
import { getDatabase } from "@/lib/db";

/** GET /api/posts/[slug]/likes → returns current likes & dislikes count */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await getDatabase();
    const post = await db
      .collection("posts")
      .findOne({ slug }, { projection: { likes: 1, dislikes: 1 } });

    return Response.json({ likes: post?.likes ?? 0, dislikes: post?.dislikes ?? 0 });
  } catch {
    return Response.json({ likes: 0, dislikes: 0 });
  }
}

/** POST /api/posts/[slug]/likes → increment likes by 1 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await getDatabase();
    await db
      .collection("posts")
      .updateOne({ slug }, { $inc: { likes: 1 } });

    const post = await db
      .collection("posts")
      .findOne({ slug }, { projection: { likes: 1, dislikes: 1 } });

    return Response.json({ likes: post?.likes ?? 0, dislikes: post?.dislikes ?? 0 });
  } catch {
    return Response.json({ error: "Failed to like post" }, { status: 500 });
  }
}

/** DELETE /api/posts/[slug]/likes → decrement likes by 1 (toggle off) */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await getDatabase();
    await db
      .collection("posts")
      .updateOne({ slug, likes: { $gt: 0 } }, { $inc: { likes: -1 } });

    const post = await db
      .collection("posts")
      .findOne({ slug }, { projection: { likes: 1, dislikes: 1 } });

    return Response.json({ likes: post?.likes ?? 0, dislikes: post?.dislikes ?? 0 });
  } catch {
    return Response.json({ error: "Failed to unlike post" }, { status: 500 });
  }
}
