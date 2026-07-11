import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — Our Mission & Spiritual Philosophy | Slimora Living",
  description:
    "Learn about Slimora Living. We provide practical, step-by-step guides on the 369 manifestation method, Law of Attraction, and spiritual awakening.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 space-y-10 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-sand">
          Our Philosophy & Story
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-gray-900 leading-tight">
          About Slimora Living
        </h1>
        <p className="text-base sm:text-lg text-gray-650 max-w-2xl mx-auto leading-relaxed">
          Demystifying spiritual habits and manifestation methods with practical,
          grounded guidance to help you design a life aligned with your highest purpose.
        </p>
        <div className="w-16 h-0.5 bg-sand mx-auto mt-4" />
      </div>

      {/* Narrative Section with Image placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-gray-905">
            Why Slimora Was Created
          </h2>
          <p className="text-sm text-gray-650 leading-relaxed font-sans">
            In a fast-paced world filled with stress and disconnected routines, finding alignment can feel like an impossible task. Slimora Living was founded to bridge the gap between traditional spirituality and modern lifestyle design.
          </p>
          <p className="text-sm text-gray-650 leading-relaxed font-sans">
            We believe that manifestation is not magic; it is a discipline. By combining neuro-linguistic principles with ancient energetic rituals, we provide you with practical tools to re-code your subconscious mind and achieve clarity.
          </p>
        </div>
        <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-md bg-gray-150">
          <Image
            src="/hero-background.jpg"
            alt="Meditation space representing spiritual growth at Slimora Living"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      </div>

      {/* Core Topics */}
      <div className="bg-white border border-border-custom rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-gray-905 text-center">
          What We Focus On
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-sage/10 text-sage flex items-center justify-center mx-auto text-sm font-bold font-serif">
              369
            </div>
            <h3 className="font-serif font-bold text-gray-900 text-sm">Manifestation</h3>
            <p className="text-xs text-gray-550 leading-relaxed">
              Step-by-step guides on Nikola Tesla&apos;s 369 method, scripting routines, and subconscious re-wiring.
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-sand/10 text-sand flex items-center justify-center mx-auto text-sm font-bold font-serif">
              OM
            </div>
            <h3 className="font-serif font-bold text-gray-900 text-sm">Spirituality</h3>
            <p className="text-xs text-gray-550 leading-relaxed">
              Understanding chakra clearing, solar and lunar rituals, mindfulness habits, and energy fields.
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#8fa084]/15 text-[#8fa084] flex items-center justify-center mx-auto text-sm font-bold font-serif">
              🧠
            </div>
            <h3 className="font-serif font-bold text-gray-900 text-sm">Mindset Science</h3>
            <p className="text-xs text-gray-550 leading-relaxed">
              Breaking down limiting beliefs, daily journaling practices, and neuroplasticity studies.
            </p>
          </div>
        </div>
      </div>

      {/* Editorial Principles */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-gray-905">
          Our Editorial Integrity
        </h2>
        <p className="text-sm text-gray-650 leading-relaxed font-sans">
          All articles published under the Slimora Living circle undergo rigorous review. We research historical spiritual practices and consult clinical psychological concepts like Cognitive Behavioral Therapy (CBT) to ensure our articles offer genuine value, practical frameworks, and zero scientific distortion.
        </p>
        <p className="text-sm text-gray-650 leading-relaxed font-sans">
          We may earn affiliate commissions on specific recommendations, but we only feature products we have thoroughly reviewed or used personally. Read our full{" "}
          <Link href="/privacy" className="text-sage hover:underline font-semibold">
            Privacy Policy
          </Link>{" "}
          for more information.
        </p>
      </div>

      {/* CTA Button */}
      <div className="text-center pt-4">
        <Link
          href="/blog"
          className="inline-block px-7 py-3 bg-sage hover:bg-sage-hover text-white text-sm font-bold rounded-full transition-all shadow-md cursor-pointer"
        >
          Explore Our Guides
        </Link>
      </div>
    </div>
  );
}