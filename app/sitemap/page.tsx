import { Metadata } from "next";
import Link from "next/link";
import { getCategories, getPosts } from "@/lib/api";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Sitemap — Site Directory | Slimora Living",
  description: "Navigate all articles, guides, categories, and static sections of Slimora Living.",
  alternates: { canonical: "/sitemap" },
};

export default async function SitemapPage() {
  const [categories, { posts }] = await Promise.all([
    getCategories(),
    getPosts({ limit: 20 }),
  ]);

  const mainPages = [
    { name: "Home Page", href: "/" },
    { name: "Blog Archives", href: "/blog" },
    { name: "About Us", href: "/about" },
    { name: "Contact Page", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 animate-fade-in space-y-10 font-sans">
      <div className="space-y-2 border-b border-border-custom pb-4 text-center sm:text-left">
        <h1 className="text-3xl font-bold font-serif text-gray-905">Site Map</h1>
        <p className="text-sm text-gray-500">
          A visual directory of all sections, categories, and articles on Slimora Living.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Core Sections */}
        <div className="bg-white border border-border-custom rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-gray-900 text-base border-b border-border-custom/50 pb-2">
            Main Sections
          </h2>
          <ul className="space-y-2.5">
            {mainPages.map((page) => (
              <li key={page.name}>
                <Link
                  href={page.href}
                  className="text-sm text-gray-650 hover:text-sage hover:underline transition-colors"
                >
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div className="bg-white border border-border-custom rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-gray-900 text-base border-b border-border-custom/50 pb-2">
            Categories
          </h2>
          {categories.length === 0 ? (
            <p className="text-xs text-gray-400">No categories found.</p>
          ) : (
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/blog?category=${cat.slug}`}
                    className="text-sm text-gray-650 hover:text-sage hover:underline transition-colors capitalize"
                  >
                    {cat.name} Guides
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Articles */}
        <div className="bg-white border border-border-custom rounded-2xl p-5 shadow-xs space-y-4 md:col-span-1">
          <h2 className="font-serif font-bold text-gray-900 text-base border-b border-border-custom/50 pb-2">
            Recent Articles
          </h2>
          {posts.length === 0 ? (
            <p className="text-xs text-gray-400">No articles available.</p>
          ) : (
            <ul className="space-y-2.5">
              {posts.map((post) => (
                <li key={post.id} className="truncate">
                  <Link
                    href={`/blog/${post.slug}`}
                    title={post.title}
                    className="text-xs text-gray-650 hover:text-sage hover:underline transition-colors"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}