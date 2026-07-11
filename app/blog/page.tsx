import { Metadata } from "next";
import Link from "next/link";
import { getPosts, getCategories } from "@/lib/api";
import { OverlayCard } from "@/components/PostCards";
import SearchInput from "@/components/SearchInput";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog Archives — Manifestation & Mindfulness Guides | Slimora Living",
  description:
    "Explore our complete archive of manifestation techniques, law of attraction tutorials, mindfulness habits, and spiritual growth blogs.",
  alternates: { canonical: "/blog" },
};

interface PageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { category, q, page: pageStr } = await searchParams;
  const currentPage = pageStr ? parseInt(pageStr, 10) : 1;
  const limit = 9;

  const [{ posts, total, pages }, categories] = await Promise.all([
    getPosts({
      category,
      page: currentPage,
      limit,
      search: q,
    }),
    getCategories(),
  ]);

  const activeCategory = category || "";

  // Helper to build URL query strings
  const getPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (activeCategory) params.append("category", activeCategory);
    if (q) params.append("q", q);
    params.append("page", String(pageNumber));
    return `/blog?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-6 space-y-8 animate-fade-in">
      {/* ── HEADER BANNER ── */}
      <div className="bg-[#eae5db] rounded-2xl p-6 sm:p-10 border border-[#d5cfc0] text-center max-w-5xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif leading-tight">
          {q ? `Search Results for &ldquo;${q}&rdquo;` : "The Slimora Journal"}
        </h1>
        <p className="text-sm sm:text-base text-gray-650 max-w-2xl mx-auto leading-relaxed">
          {q
            ? `Found ${total} articles matching your search query. Explore manifestation guides and tools.`
            : "Explore our archive of articles covering the 369 manifestation method, Law of Attraction guides, chakra balancing rituals, and spiritual awakening."}
        </p>
        
        {/* Mobile Search Widget inside header banner */}
        <div className="max-w-md mx-auto pt-2 block md:hidden">
          <SearchInput size="sm" />
        </div>
      </div>

      {/* ── CATEGORY FILTERS ── */}
      <div className="border-y border-border-custom py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Category links */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <Link
            href="/blog"
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all ${
              !activeCategory
                ? "bg-sage text-white shadow-xs"
                : "text-gray-650 hover:bg-bg-custom hover:text-sage"
            }`}
          >
            All Articles
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog?category=${cat.slug}`}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all ${
                activeCategory === cat.slug
                  ? "bg-sage text-white shadow-xs"
                  : "text-gray-650 hover:bg-bg-custom hover:text-sage"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Desktop search widget */}
        <div className="w-64 hidden md:block">
          <SearchInput size="sm" />
        </div>
      </div>

      {/* ── BLOG POSTS GRID ── */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md mx-auto space-y-3">
          <p className="font-serif font-bold text-gray-800 text-lg">No articles found</p>
          <p className="text-xs text-gray-400">
            We couldn&apos;t find any articles matching your search filters. Try resetting search or checking another category.
          </p>
          <div className="pt-2">
            <Link
              href="/blog"
              className="inline-block px-5 py-2 bg-sage hover:bg-sage-hover text-white text-xs font-bold rounded-full transition-all"
            >
              Reset Filters
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <OverlayCard key={post.id} post={post} size="medium" />
          ))}
        </div>
      )}

      {/* ── PAGINATION CONTROLS ── */}
      {pages > 1 && (
        <nav aria-label="Pagination Navigation" className="flex items-center justify-between border-t border-border-custom pt-6">
          {/* Previous Button */}
          {currentPage > 1 ? (
            <Link
              href={getPageUrl(currentPage - 1)}
              className="px-4 py-2 border border-gray-200 text-xs font-bold text-gray-700 rounded-full hover:border-sage hover:text-sage transition-all cursor-pointer bg-white"
            >
              &larr; Previous
            </Link>
          ) : (
            <span className="px-4 py-2 border border-gray-100 text-xs font-bold text-gray-300 rounded-full select-none bg-gray-50/50">
              &larr; Previous
            </span>
          )}

          {/* Page Info */}
          <span className="text-xs text-gray-400 font-medium">
            Page {currentPage} of {pages}
          </span>

          {/* Next Button */}
          {currentPage < pages ? (
            <Link
              href={getPageUrl(currentPage + 1)}
              className="px-4 py-2 border border-gray-200 text-xs font-bold text-gray-700 rounded-full hover:border-sage hover:text-sage transition-all cursor-pointer bg-white"
            >
              Next &rarr;
            </Link>
          ) : (
            <span className="px-4 py-2 border border-gray-100 text-xs font-bold text-gray-300 rounded-full select-none bg-gray-50/50">
              Next &rarr;
            </span>
          )}
        </nav>
      )}
    </div>
  );
}