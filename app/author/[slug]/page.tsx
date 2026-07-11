import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAuthorBySlug,
  getAuthorPosts,
} from "@/lib/api";
import { getCategoryInfo, timeAgo } from "@/lib/utils";
import {
  Globe,
  CalendarDays,
  BookOpen,
  ExternalLink,
} from "lucide-react";

// Inline social SVG icons (lucide-react v1 doesn't ship these)
const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const YoutubeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);


export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return { title: "Author Not Found | Slimora Living" };

  const title = `${author.name} — Author | Slimora Living`;
  const description =
    author.bio ||
    `Read expert articles by ${author.name} on manifestation, spiritual growth, and mindset at Slimora Living.`;

  return {
    title,
    description,
    alternates: { canonical: `/author/${slug}` },
    openGraph: {
      title,
      description,
      type: "profile",
      url: `https://slimora.living/author/${slug}`,
      images: author.image ? [{ url: author.image, alt: author.name }] : [],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: author.image ? [author.image] : [],
    },
  };
}

const SOCIAL_CONFIG: Record<
  string,
  { icon: React.ReactNode; label: string; color: string }
> = {
  twitter: {
    icon: <TwitterIcon />,
    label: "Twitter / X",
    color: "hover:bg-black hover:text-white",
  },
  instagram: {
    icon: <InstagramIcon />,
    label: "Instagram",
    color: "hover:bg-pink-600 hover:text-white",
  },
  facebook: {
    icon: <FacebookIcon />,
    label: "Facebook",
    color: "hover:bg-blue-700 hover:text-white",
  },
  linkedin: {
    icon: <LinkedinIcon />,
    label: "LinkedIn",
    color: "hover:bg-blue-600 hover:text-white",
  },
  youtube: {
    icon: <YoutubeIcon />,
    label: "YouTube",
    color: "hover:bg-red-600 hover:text-white",
  },
  website: {
    icon: <Globe size={15} />,
    label: "Website",
    color: "hover:bg-gray-700 hover:text-white",
  },
};

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;

  const [author, { posts: authorPosts, total: totalPosts }] = await Promise.all([
    getAuthorBySlug(slug),
    getAuthorPosts(slug, { limit: 12 }),
  ]);

  if (!author) notFound();

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

  // Schema.org Person JSON-LD for Google
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `${siteUrl}/author/${slug}`,
    ...(author.image ? { image: author.image } : {}),
    ...(author.bio ? { description: author.bio } : {}),
    ...(author.expertise?.length
      ? { knowsAbout: author.expertise }
      : {}),
    worksFor: {
      "@type": "Organization",
      name: "Slimora Living",
      url: siteUrl,
    },
    ...(author.socialLinks &&
    Object.values(author.socialLinks).some(Boolean)
      ? {
          sameAs: Object.values(author.socialLinks).filter(Boolean),
        }
      : {}),
  };

  const activeSocials = author.socialLinks
    ? Object.entries(author.socialLinks).filter(([, v]) => Boolean(v))
    : [];

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-xs text-gray-500 mb-6"
      >
        <Link href="/" className="hover:text-sage transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-sage transition-colors">
          Blog
        </Link>
        <span>/</span>
        <span className="text-gray-400">Authors</span>
        <span>/</span>
        <span className="text-gray-700 font-medium truncate max-w-[160px]">
          {author.name}
        </span>
      </nav>

      {/* ── Author Profile Card ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        {/* Gradient header banner */}
        <div className="h-28 sm:h-36 bg-gradient-to-r from-sage via-[#8fa084] to-sand relative">
          {/* Subtle pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="px-5 sm:px-8 pb-6">
          {/* Avatar row */}
          <div className="-mt-14 sm:-mt-16 mb-4 flex items-end justify-between gap-4 flex-wrap">
            {/* Profile photo */}
            <div className="relative">
              {author.image ? (
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                  <Image
                    src={author.image}
                    alt={author.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                    priority
                  />
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-sage to-sand flex items-center justify-center">
                  <span className="text-white font-black text-4xl select-none font-serif">
                    {author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-5 pb-2">
              <div className="text-center">
                <div className="text-2xl font-black text-gray-900">
                  {totalPosts}
                </div>
                <div className="text-[11px] text-gray-400 uppercase tracking-wider">
                  Articles
                </div>
              </div>
              {author.expertise && author.expertise.length > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-black text-gray-900">
                    {author.expertise.length}
                  </div>
                  <div className="text-[11px] text-gray-400 uppercase tracking-wider">
                    Specialties
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
            {author.name}
          </h1>

          {/* Expertise tags */}
          {author.expertise && author.expertise.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2.5">
              {author.expertise.map((exp) => (
                <span
                  key={exp}
                  className="bg-sage/10 text-sage text-xs font-semibold px-2.5 py-0.5 rounded-full border border-sage/20"
                >
                  {exp}
                </span>
              ))}
            </div>
          )}

          {/* Bio */}
          {author.bio ? (
            <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              {author.bio}
            </p>
          ) : (
            <p className="mt-4 text-gray-500 text-sm leading-relaxed max-w-2xl">
              Dedicated researcher and writer covering manifestation methods,
              mindset science, and spiritual growth practices at Slimora Living.
            </p>
          )}

          {/* Social links */}
          {activeSocials.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-xs text-gray-400 mr-1">Follow:</span>
              {activeSocials.map(([platform, url]) => {
                const cfg = SOCIAL_CONFIG[platform];
                if (!cfg || !url) return null;
                return (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    title={cfg.label}
                    aria-label={`${author.name} on ${cfg.label}`}
                    className={`w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center transition-all duration-200 ${cfg.color}`}
                  >
                    {cfg.icon}
                  </a>
                );
              })}

              {/* Website link */}
              {author.socialLinks?.website && (
                <a
                  href={author.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-sage font-semibold ml-2 hover:underline"
                >
                  <ExternalLink size={12} />
                  Personal Site
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Author's Articles ───────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <BookOpen size={18} className="text-sage" />
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Articles by {author.name}
          </h2>
          {totalPosts > 0 && (
            <span className="text-xs bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">
              {totalPosts}
            </span>
          )}
        </div>

        {authorPosts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <p className="text-gray-400 text-sm">
              No published articles found for this author yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {authorPosts.map((post) => {
              const cat = getCategoryInfo(post.category);
              return (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col"
                >
                  {/* Cover image */}
                  {post.coverImage ? (
                    <div className="relative h-44 overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image
                        src={post.coverImage}
                        alt={post.coverImageAlt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-sage to-sand flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-black text-2xl font-serif opacity-30">
                        Slimora
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <Link
                      href={`/blog?category=${cat.slug}`}
                      className="text-xs font-semibold text-sage hover:underline"
                    >
                      {cat.name}
                    </Link>
                    <Link href={`/blog/${post.slug}`} className="mt-1">
                      <h3 className="font-bold font-serif text-gray-900 leading-snug group-hover:text-sage transition-colors line-clamp-2 text-sm sm:text-base">
                        {post.title}
                      </h3>
                    </Link>
                    {post.excerpt && (
                      <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed flex-1">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                      <CalendarDays size={11} />
                      <span>{timeAgo(post.createdAt)}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
