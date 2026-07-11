import { NextResponse } from "next/server";
import { getPosts } from "@/lib/api";
import { stripHtml } from "@/lib/utils";

export const revalidate = 3600;

export async function GET() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://slimora.living")
    .trim()
    .replace(/\r/g, "");
  const { posts } = await getPosts({ limit: 20 });

  const feedItemsXml = posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.createdAt).toUTCString();
      const descriptionText = post.excerpt || post.description || stripHtml(post.content).slice(0, 160) + "...";

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${descriptionText}]]></description>
    </item>`;
    })
    .join("");

  const rssFeedXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Slimora Living | 369 Manifestation Method &amp; Spirituality</title>
    <link>${siteUrl}</link>
    <description>Explore the power of the 369 Manifestation Method, law of attraction, mindfulness, and spiritual growth on Slimora Living. Unlock your full potential today.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${feedItemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssFeedXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
