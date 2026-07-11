import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getPosts, getCategories, FAQ } from "@/lib/api";
import { getCategoryInfo, timeAgo } from "@/lib/utils";
import { OverlayCard, HorizontalCard, SmallPostCard } from "@/components/PostCards";
import FAQAccordion from "@/components/FAQAccordion";
import SearchInput from "@/components/SearchInput";
import SubscriberForm from "@/components/SubscriberForm";
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from "@/components/SocialIcons";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "369 Manifestation Method & Spiritual Growth | Slimora Living",
  description:
    "Discover how to unlock your true potential using the 369 Manifestation Method. Explore law of attraction guides, mindfulness rituals, and spiritual awakening blogs.",
  alternates: { canonical: "/" },
};

const HOMEPAGE_FAQS: FAQ[] = [
  {
    question: "What is the 369 Manifestation Method?",
    answer:
      "The 369 Manifestation Method is a structured journaling ritual that draws its inspiration from Nikola Tesla's famous belief that the numbers 3, 6, and 9 hold the key to understanding the universe. In practice, the 369 Manifestation Method asks you to write down a single, clearly worded intention or affirmation three times in the morning, six times in the afternoon, and nine times before you go to sleep at night. The repetition is intentional: each round is designed to gradually shift your subconscious mind away from doubt and toward genuine belief in the outcome you are working to create. Unlike vague wishing or one-time affirmations, the 369 Manifestation Method combines timing, repetition, and handwriting to build a consistent daily practice that many people use for goals ranging from financial abundance and career growth to relationships, health, and personal confidence.",
  },
  {
    question: "How long should I perform the 369 Manifestation ritual?",
    answer:
      "Most practitioners commit to the 369 Manifestation Method for either 33 or 45 consecutive days, since these cycles are commonly believed to give the subconscious mind enough repetition to fully absorb a new belief. That said, the exact number of days is far less important than showing up consistently and doing the ritual with genuine emotional engagement rather than treating it as a mechanical checklist. If you miss a day partway through your 33 or 45 day 369 Manifestation Method cycle, most teachers recommend simply restarting from day one rather than continuing, since an unbroken streak reinforces the discipline and focus the method depends on. What matters most throughout the process is maintaining a felt sense of gratitude and already having the outcome, rather than focusing on its absence.",
  },
  {
    question: "Can I manifest multiple intentions at the same time?",
    answer:
      "While it is technically possible to work on more than one goal, most experienced practitioners of the 369 Manifestation Method strongly recommend focusing on a single, well-defined intention at a time. Splitting your attention across several affirmations dilutes your emotional energy and makes it harder for your subconscious mind to lock onto one clear outcome. Instead, choose the goal that feels most urgent or meaningful to you right now, whether that is attracting a new job opportunity, improving a relationship, or building financial security, and give it your full focus for the entire 33 or 45 day cycle. Once that intention manifests or the cycle completes, you can then start a fresh round of the 369 Manifestation Method for your next goal, building momentum one intention at a time rather than scattering your energy.",
  },
  {
    question: "What do the numbers 3, 6, and 9 represent spiritually?",
    answer:
      "Nikola Tesla is widely quoted as saying that if you knew the magnificence of the numbers 3, 6, and 9, you would hold the key to the universe, and this idea forms the philosophical backbone of the 369 Manifestation Method. Within the practice, the number 3 is associated with creation, new beginnings, and a direct connection to source or universal energy, representing the spark of an idea coming into form. The number 6 is tied to balance, harmony, and nurturing, reflecting the inner emotional alignment needed to sustain belief in your intention throughout the day. Finally, the number 9 symbolizes completion, release, and manifestation, marking the point where your intention is fully surrendered to the universe before rest. Together, these three numbers create the rhythmic structure, three repetitions, six repetitions, and nine repetitions, that gives the 369 Manifestation Method its name and its distinctive morning, afternoon, and evening cadence.",
  },
  {
    question: "Do I need to write my 369 affirmations by hand?",
    answer:
      "Yes, handwriting is considered an essential part of the 369 Manifestation Method rather than an optional detail. Physically writing out your affirmation engages fine motor skills and creates a stronger neuromuscular connection between your hand, your eyes, and your brain than typing ever could, which many practitioners believe helps the intention embed more deeply into the subconscious mind. The slower, more deliberate pace of handwriting also naturally encourages you to slow down and genuinely feel each word rather than rushing through the words on autopilot. While some people do keep a digital note as a backup, the recommended approach for the 369 Manifestation Method is to use a dedicated journal or notebook, writing each affirmation clearly and with intention during all three sessions of the day.",
  },
  {
    question: "What if my manifestation doesn't happen in 33 days?",
    answer:
      "It is completely normal for a desired outcome not to appear by the end of your 33 or 45 day 369 Manifestation Method cycle, and this does not mean the practice has failed. Divine or universal timing frequently operates on a different schedule than our own expectations, and many practitioners report that their manifestation arrived weeks or even months after they finished the ritual, often once they had let go of attachment to a specific deadline. If your cycle ends without visible results, use the time that follows to reflect honestly on any limiting beliefs or subconscious resistance that may still be blocking your goal, continue expressing gratitude for what you already have, and then begin a fresh 369 Manifestation Method cycle after a short break of several days. Many people find that their second or third cycle produces stronger results simply because their emotional alignment and belief have deepened with practice.",
  },
];

export default async function HomePage() {
  const [{ posts }, categories] = await Promise.all([
    getPosts({ limit: 9 }),
    getCategories(),
  ]);

  let siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://slimora.living").trim().replace(/\r/g, "");
  if (!siteUrl.startsWith("http://") && !siteUrl.startsWith("https://")) siteUrl = "https://slimora.living";

  const featuredPost = posts[0] || null;
  const gridPosts = posts.slice(1, 5);
  const trendingPosts = posts.slice(0, 6);
  const latestPosts = posts.slice(0, 8);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Slimora Living",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/blog?search={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOMEPAGE_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-4 space-y-6">

        {/* ── HERO / INTRO SECTION ── */}
        <div className="relative rounded-xl overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 -z-10">
            <Image
              src="/hero-background.jpg"
              alt="Peaceful night sky representing the 369 manifestation method"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/75" />
          </div>

          <div className="relative z-10 px-6 py-16 sm:py-20 md:py-28 text-center max-w-3xl mx-auto">
            <span
              style={{ color: "#d4c49a" }}
              className="inline-block text-xs font-semibold tracking-widest uppercase mb-3"
            >
              Law of Attraction &middot; Manifestation &middot; Spiritual Growth
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              The 369 Manifestation Method: Your Guide to Attracting the Life You Want
            </h1>
            <p className="mt-4 text-sm sm:text-base text-gray-200 leading-relaxed max-w-2xl mx-auto">
              Rooted in Nikola Tesla&apos;s belief in the power of numbers, the 369 manifestation
              method is a simple journaling ritual trusted by thousands to manifest love, money,
              and purpose. At Slimora Living, we break down the exact steps, rituals, and mindset
              shifts you need to turn your intentions into reality — no fluff, just practical
              spiritual guidance.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/blog?category=369-method"
                style={{ backgroundColor: "#8ba178" }}
                className="px-6 py-2.5 text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-black/30"
              >
                Start the 369 Method
              </Link>
              <Link
                href="/blog"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                className="px-6 py-2.5 backdrop-blur text-white text-sm font-semibold rounded-full border border-white/40 hover:bg-white/25 transition-colors"
              >
                Explore All Guides
              </Link>
            </div>
          </div>
        </div>

        {/* ── FEATURED POSTS GRID ── */}
        {posts.length === 0 ? (
          <div className="bg-white rounded p-10 text-center text-gray-500">
            <p className="font-semibold">Content is loading...</p>
            <p className="text-sm mt-1">Articles will appear here once the backend is connected.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Large featured post */}
            {featuredPost && (
              <div className="md:col-span-1">
                <OverlayCard post={featuredPost} size="large" />
              </div>
            )}

            {/* 2x2 grid of smaller posts */}
            {gridPosts.length > 0 && (
              <div className="md:col-span-2 grid grid-cols-2 gap-3">
                {gridPosts.map((post) => (
                  <OverlayCard key={post.id} post={post} size="medium" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MAIN CONTENT + SIDEBAR ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Column (2/3 width) */}
          <main className="lg:col-span-2 space-y-6">

            {/* Trending Now */}
            {trendingPosts.length > 0 && (
              <section className="bg-white rounded shadow-sm p-4">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                  <h2 className="text-base font-bold text-gray-900 section-title">Trending Now</h2>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <Link href="/blog" className="hover:text-accent font-semibold text-accent">All</Link>
                    {categories.slice(0, 4).map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/blog?category=${cat.slug}`}
                        className="hover:text-accent"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Big trending post */}
                  {trendingPosts[0] && (
                    <div className="sm:row-span-2">
                      <OverlayCard post={trendingPosts[0]} size="large" />
                    </div>
                  )}
                  {/* Smaller trending posts */}
                  <div className="space-y-3">
                    {trendingPosts.slice(1, 4).map((post) => (
                      <SmallPostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* What's New — Latest articles */}
            {latestPosts.length > 0 && (
              <section className="bg-white rounded shadow-sm p-4">
                <h2 className="text-base font-bold text-gray-900 section-title mb-4">What&apos;s New</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {latestPosts.slice(0, 6).map((post) => {
                    const cat = getCategoryInfo(post.category);
                    return (
                      <article key={post.id} className="group">
                        <Link href={`/blog/${post.slug}`}>
                          <div className="relative h-44 w-full overflow-hidden rounded bg-gray-200 mb-2">
                            {post.coverImage ? (
                              <Image
                                src={post.coverImage}
                                alt={post.coverImageAlt || post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                                sizes="(max-width: 640px) 100vw, 50vw"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-[#eef0e9] to-gray-200" />
                            )}
                            <span className="absolute bottom-2 left-2 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded">
                              {cat.name}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-400">{timeAgo(post.createdAt)}</p>
                            <h3 className="text-sm font-bold text-gray-900 group-hover:text-accent transition-colors leading-snug line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {post.excerpt || post.description}
                            </p>
                          </div>
                        </Link>
                      </article>
                    );
                  })}
                </div>

                <div className="mt-4 text-center">
                  <Link
                    href="/blog"
                    className="inline-flex items-center px-5 py-2 bg-accent text-white text-sm font-semibold rounded hover:bg-accent-hover transition-colors"
                  >
                    View All Articles &rarr;
                  </Link>
                </div>
              </section>
            )}
          </main>

          {/* Sidebar (1/3 width) */}
          <aside className="space-y-5">
            {/* Search Widget */}
            <div className="bg-white rounded shadow-sm p-4 space-y-3">
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide section-title">
                Search Articles
              </h2>
              <SearchInput />
            </div>

            {/* Subscriber Form Widget */}
            <SubscriberForm />

            {/* Recent Posts Sidebar Widget */}
            {latestPosts.length > 0 && (
              <div className="bg-white rounded shadow-sm p-4">
                <div className="flex gap-4 border-b border-gray-100 mb-3 text-sm font-semibold">
                  <h2 className="text-accent border-b-2 border-accent pb-2">Recent</h2>
                </div>
                <div className="space-y-3">
                  {latestPosts.slice(0, 5).map((post, i) => (
                    <HorizontalCard key={post.id} post={post} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Categories Sidebar Widget */}
            {categories.length > 0 && (
              <div className="bg-white rounded shadow-sm p-4">
                <h2 className="text-sm font-bold text-gray-900 section-title mb-4">Categories</h2>
                <ul className="space-y-1">
                  {categories.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/blog?category=${cat.slug}`}
                        className="flex items-center justify-between py-1.5 text-sm text-gray-700 hover:text-accent transition-colors group"
                      >
                        <span className="flex items-center gap-1">
                          <span className="text-gray-400 group-hover:text-accent">&rsaquo;</span>
                          {cat.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* About Widget */}
            <div className="bg-white rounded shadow-sm p-4 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#e5e8dc] flex items-center justify-center mx-auto">
                <span className="text-accent font-bold text-xl">SL</span>
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-sm">Slimora Living</h2>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Your guide to the 369 Manifestation Method, law of attraction, and spiritual growth.
                </p>
              </div>

              {/* Social profiles follow widget */}
              <div className="flex justify-center gap-3.5 py-1 text-gray-400">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  <FacebookIcon size={16} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors">
                  <InstagramIcon size={16} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-500 transition-colors">
                  <TwitterIcon size={16} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-650 transition-colors">
                  <YoutubeIcon size={16} />
                </a>
              </div>

              <Link
                href="/about"
                className="inline-block w-full py-1.5 border border-accent text-accent text-xs font-semibold rounded hover:bg-accent hover:text-white transition-colors"
              >
                About Us
              </Link>
            </div>
          </aside>
        </div>

        {/* ── FAQ Section ── */}
        <section className="bg-white rounded shadow-sm p-5">
          <FAQAccordion faqs={HOMEPAGE_FAQS} title="369 Manifestation Method — FAQ" />
        </section>

      </div>
    </div>
  );
}