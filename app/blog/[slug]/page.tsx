import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getPosts,
  getInitialComments,
  authorNameToSlug,
} from "@/lib/api";
import {
  formatDate,
  timeAgo,
  getCategoryInfo,
  parseAndInjectIds,
} from "@/lib/utils";
import { SmallPostCard } from "@/components/PostCards";
import FAQAccordion from "@/components/FAQAccordion";
import TOC from "@/components/TOC";
import ShareButtons from "@/components/ShareButtons";
import SubscriberForm from "@/components/SubscriberForm";
import CommentSection from "@/components/CommentSection";
import PostLikeDislike from "@/components/PostLikeDislike";
import { Info } from "lucide-react";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const title = `${post.title} | Slimora Living`;
  const description =
    post.description ||
    post.excerpt ||
    `Read about ${post.title} on Slimora Living.`;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://slimora.living/blog/${post.slug}`,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [
        typeof post.author === "object"
          ? post.author?.name || "Slimora"
          : String(post.author || "Slimora"),
      ],
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch post + comments in parallel
  const [post, initialComments] = await Promise.all([
    getPostBySlug(slug),
    getInitialComments(slug),
  ]);

  if (!post) notFound();

  let siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://slimora.living"
  )
    .trim()
    .replace(/\r/g, "");
  if (
    !siteUrl.startsWith("http://") &&
    !siteUrl.startsWith("https://")
  ) {
    siteUrl = "https://slimora.living";
  }

  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const cat = getCategoryInfo(post.category);
  const authorName =
    typeof post.author === "object"
      ? post.author?.name || "Slimora Editors"
      : String(post.author || "Slimora Editors");
  const authorSlug = authorNameToSlug(authorName);

  const { posts: relatedRaw } = await getPosts({
    category: cat.slug,
    limit: 6,
  });
  const relatedPosts = relatedRaw
    .filter((p) => p.id !== post.id)
    .slice(0, 4);

  const { processedHtml, toc } = parseAndInjectIds(post.content);

  // ── Schema.org JSON-LD ─────────────────────────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  // BlogPosting with embedded Comment schema — Google reads these for rich results
  const articleSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: [
      {
        "@type": "Person",
        name: authorName,
        url: `${siteUrl}/author/${authorSlug}`,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "Slimora Living",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.ico`,
      },
    },
    description: post.excerpt || post.description || post.title,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    // Embed comments for Google — improves DiscussionForumPosting signals
    commentCount: initialComments.length,
    ...(initialComments.length > 0
      ? {
          comment: initialComments.slice(0, 10).map((c) => ({
            "@type": "Comment",
            "@id": `${postUrl}#comment-${c.id}`,
            dateCreated: c.createdAt,
            text: c.content,
            upvoteCount: c.likes,
            author: {
              "@type": "Person",
              name: c.author,
            },
          })),
        }
      : {}),
  };

  const faqSchema =
    post.faqs && post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : null;

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
        <Link href="/" className="hover:text-sage">
          Home
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-sage">
          Blog
        </Link>
        <span>/</span>
        <Link
          href={`/blog?category=${cat.slug}`}
          className="hover:text-sage"
        >
          {cat.name}
        </Link>
        <span>/</span>
        <span className="text-gray-400 truncate max-w-xs">{post.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Article main column ──────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Cover image */}
          <div className="bg-white rounded shadow-sm overflow-hidden">
            <div className="relative h-64 sm:h-80 w-full bg-gray-200">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.coverImageAlt || post.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-sage/90 to-gray-900 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl font-serif">
                    Slimora Living
                  </span>
                </div>
              )}
            </div>

            {/* Post header */}
            <div className="p-5">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Link
                  href={`/blog?category=${cat.slug}`}
                  className="bg-sage text-white text-xs font-bold px-2.5 py-0.5 rounded hover:bg-sage-hover"
                >
                  {cat.name}
                </Link>
                <span className="text-xs text-gray-400">
                  {timeAgo(post.createdAt)}
                </span>
                <span className="text-xs text-gray-400">
                  &bull; By{" "}
                  <Link
                    href={`/author/${authorSlug}`}
                    className="hover:text-sage font-semibold transition-colors"
                  >
                    {authorName}
                  </Link>
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {post.title}
              </h1>

              {(post.excerpt || post.description) && (
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  {post.excerpt || post.description}
                </p>
              )}
            </div>
          </div>

          {/* ── Affiliate Disclosure (FTC-compliant for US audience) ── */}
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800">
            <Info size={14} className="mt-0.5 flex-shrink-0 text-amber-600" />
            <p>
              <strong>Disclosure:</strong> This article may contain affiliate
              links. If you click and make a purchase, Slimora Living may earn a
              small commission at no extra cost to you. We only recommend
              products we genuinely believe in.{" "}
              <Link href="/disclosure" className="underline hover:text-amber-900">
                Learn more
              </Link>
              .
            </p>
          </div>

          {/* Table of Contents */}
          {toc.length > 0 && (
            <div className="bg-white rounded shadow-sm p-4">
              <TOC toc={toc} />
            </div>
          )}

          {/* Article body */}
          <div className="bg-white rounded shadow-sm p-5 sm:p-7">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />
          </div>

          {/* Like / Dislike */}
          <PostLikeDislike postSlug={post.slug} />

          {/* Share Buttons */}
          <ShareButtons postUrl={postUrl} postTitle={post.title} />

          {/* Horizontal Newsletter */}
          <SubscriberForm
            layout="horizontal"
            title="Accelerate Your Manifestation Power"
            description="Sign up for our free circle and receive 369 manifestation journal templates, chakra guides, and reviews on the best spiritual tools."
          />

          {/* Author Box */}
          <div className="bg-white rounded shadow-sm p-4 flex items-start gap-4">
            {typeof post.author === "object" && post.author?.image ? (
              <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                <Image
                  src={post.author.image}
                  alt={authorName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sage font-bold text-lg">
                  {authorName.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                Author
              </p>
              <Link
                href={`/author/${authorSlug}`}
                className="font-bold font-serif text-gray-905 hover:text-sage transition-colors"
              >
                {authorName}
              </Link>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {typeof post.author === "object" && post.author?.bio
                  ? post.author.bio
                  : "Dedicated researcher and writer covering manifestation methods, mindset science, and spiritual growth practices at Slimora Living."}
              </p>
              <Link
                href={`/author/${authorSlug}`}
                className="mt-2 inline-flex text-xs font-semibold text-sage hover:underline"
              >
                View all articles →
              </Link>
            </div>
          </div>

          {/* Post FAQs */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="bg-white rounded shadow-sm p-5">
              <FAQAccordion
                faqs={post.faqs}
                title={`${post.title} — FAQ`}
              />
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="bg-white rounded shadow-sm p-4">
              <h2 className="text-base font-bold text-gray-900 section-title mb-4">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map((related) => {
                  const relCat = getCategoryInfo(related.category);
                  return (
                    <article
                      key={related.id}
                      className="group flex gap-3"
                    >
                      {related.coverImage && (
                        <div className="relative w-20 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                          <Image
                            src={related.coverImage}
                            alt={related.coverImageAlt || related.title}
                            fill
                            className="object-cover"
                            loading="lazy"
                            sizes="80px"
                          />
                        </div>
                      )}
                      <div>
                        <span className="text-xs text-sage font-semibold">
                          {relCat.name}
                        </span>
                        <Link href={`/blog/${related.slug}`}>
                          <h3 className="text-sm font-bold font-serif text-gray-909 group-hover:text-sage transition-colors line-clamp-2 leading-snug mt-0.5">
                            {related.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {timeAgo(related.createdAt)}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* Comments Section — initialComments for SSR, then fetches live */}
          <CommentSection
            postSlug={post.slug}
            postTitle={post.title}
            initialComments={initialComments}
          />
        </div>

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Post meta */}
          <div className="bg-white rounded shadow-sm p-4 text-sm">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-3 section-title">
              Post Info
            </h3>
            <div className="space-y-2 text-xs text-gray-600 mt-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Published</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
              {post.updatedAt !== post.createdAt && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Updated</span>
                  <span>{formatDate(post.updatedAt)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Category</span>
                <Link
                  href={`/blog?category=${cat.slug}`}
                  className="text-sage font-semibold hover:underline"
                >
                  {cat.name}
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Author</span>
                <Link
                  href={`/author/${authorSlug}`}
                  className="font-semibold text-sage hover:underline"
                >
                  {authorName}
                </Link>
              </div>
              {initialComments.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Comments</span>
                  <a
                    href="#comments"
                    className="font-semibold text-sage hover:underline"
                  >
                    {initialComments.length}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Subscriber Widget */}
          <SubscriberForm />

          {/* Related sidebar posts */}
          {relatedPosts.length > 0 && (
            <div className="bg-white rounded shadow-sm p-4">
              <h3 className="text-sm font-bold text-gray-900 section-title mb-4">
                More in {cat.name}
              </h3>
              <div className="space-y-3">
                {relatedPosts.map((p) => (
                  <SmallPostCard key={p.id} post={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
