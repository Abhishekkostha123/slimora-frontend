/**
 * Returns a relative time string like "3 hours ago", "2 days ago", etc.
 */
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;

  const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

/**
 * Formats a date string to a human-readable US format.
 */
export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

/**
 * Strips HTML tags from a string.
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

interface TocItem {
  text: string;
  id: string;
  level: number;
}

/**
 * Parses H2 and H3 tags from HTML, injects unique IDs, and generates TOC.
 */
export function parseAndInjectIds(html: string): {
  processedHtml: string;
  toc: TocItem[];
} {
  const toc: TocItem[] = [];
  let idCounter = 0;

  const hTagRegex = /<(h2|h3)([^>]*?)>([\s\S]*?)<\/\1>/gi;

  const processedHtml = html.replace(hTagRegex, (match, tag, attrs, content) => {
    const text = content.replace(/<[^>]*>/g, "").trim();
    if (!text) return match;

    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    idCounter++;
    const id = `${slug}-${idCounter}`;

    toc.push({ text, id, level: tag.toLowerCase() === "h2" ? 2 : 3 });

    if (/id=/i.test(attrs)) return match;
    return `<${tag} id="${id}"${attrs}>${content}</${tag}>`;
  });

  return { processedHtml, toc };
}

/**
 * Gets category display name and slug from a post
 */
export function getCategoryInfo(category: unknown): { name: string; slug: string } {
  if (!category) return { name: "General", slug: "general" };
  if (typeof category === "object") {
    const cat = category as Record<string, unknown>;
    return { name: String(cat.name || "General"), slug: String(cat.slug || "general") };
  }
  const name = String(category);
  return {
    name: name.charAt(0).toUpperCase() + name.slice(1),
    slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
  };
}
