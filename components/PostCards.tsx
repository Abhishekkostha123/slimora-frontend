"use client";

import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/api";
import { getCategoryInfo, timeAgo } from "@/lib/utils";

interface OverlayCardProps {
  post: Post;
  size?: "large" | "medium";
}

export function OverlayCard({ post, size = "medium" }: OverlayCardProps) {
  const cat = getCategoryInfo(post.category);
  const isLarge = size === "large";
  const authorName = post.author?.name || "Slimora Editors";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group relative block w-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-gray-200 ${
        isLarge ? "h-96 md:h-[440px]" : "h-64 sm:h-72"
      }`}
    >
      {/* Background Image / Fallback - fills the ENTIRE card (not just a fixed-height child),
          so even if the grid stretches this card taller, the image always covers it fully and
          the text overlay never lands on empty whitespace below the image. */}
      <div className="absolute inset-0 overflow-hidden">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt || post.title}
            fill
            className="object-cover group-hover:scale-103 transition-transform duration-500"
            sizes={isLarge ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 100vw, 50vw"}
            priority={isLarge}
            loading={isLarge ? undefined : "lazy"}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-sage/80 to-gray-900 flex items-center justify-center">
            <span className="text-white/20 font-black text-3xl font-serif">Slimora</span>
          </div>
        )}
        {/* Soft overlay gradient - ensures text stays readable regardless of image brightness */}
        <div className="absolute inset-0 card-overlay z-10" />
      </div>

      {/* Floating Category Badge */}
      <span className="absolute top-4 left-4 z-20 bg-sage text-black text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
        {cat.name}
      </span>

      {/* Content overlay */}
      <div className="absolute bottom-0 inset-x-0 p-5 z-20 flex flex-col justify-end text-white">
        <span className="text-[10px] text-gray-300 font-semibold tracking-wider mb-1.5 flex items-center gap-1.5">
          <span>{timeAgo(post.createdAt)}</span>
          <span>&bull;</span>
          <span>By {authorName}</span>
        </span>

        <h3 className={`font-serif font-bold text-white group-hover:text-sand transition-colors leading-tight line-clamp-2 ${
          isLarge ? "text-lg sm:text-2xl md:text-3xl" : "text-sm sm:text-base md:text-lg"
        }`}>
          {post.title}
        </h3>

        {isLarge && (post.excerpt || post.description) && (
          <p className="mt-2 text-xs sm:text-sm text-white/90 line-clamp-2 leading-relaxed font-sans max-w-2xl">
            {post.excerpt || post.description}
          </p>
        )}
      </div>
    </Link>
  );
}

interface SmallPostCardProps {
  post: Post;
}

export function SmallPostCard({ post }: SmallPostCardProps) {
  const cat = getCategoryInfo(post.category);
  return (
    <Link href={`/blog/${post.slug}`} className="group flex gap-3.5 items-center py-2 cursor-pointer">
      {/* Image Thumbnail */}
      <div className="relative w-24 h-20 sm:w-28 sm:h-22 rounded-lg overflow-hidden bg-gray-150 flex-shrink-0 shadow-xs">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt || post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="112px"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-sage/50 to-gray-250 flex items-center justify-center">
            <span className="text-white/30 font-bold text-sm font-serif">Slimora</span>
          </div>
        )}
      </div>

      {/* Text Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <span className="text-[9px] font-bold text-sage uppercase tracking-widest mb-1">
          {cat.name}
        </span>
        <h4 className="text-xs sm:text-sm font-bold font-serif text-gray-900 group-hover:text-sage transition-colors leading-snug line-clamp-2">
          {post.title}
        </h4>
        <span className="text-[10px] text-gray-400 mt-1">
          {timeAgo(post.createdAt)}
        </span>
      </div>
    </Link>
  );
}

interface HorizontalCardProps {
  post: Post;
  index: number;
}

export function HorizontalCard({ post, index }: HorizontalCardProps) {
  const cat = getCategoryInfo(post.category);
  // Pad single digits, e.g. 1 -> 01
  const displayIndex = String(index + 1).padStart(2, "0");

  return (
    <Link href={`/blog/${post.slug}`} className="group flex gap-3 items-start py-2.5 border-b border-gray-100 last:border-0 cursor-pointer">
      {/* Index Number */}
      <span className="text-sand/35 group-hover:text-sand font-serif text-2xl font-black w-7 flex-shrink-0 text-left transition-colors pt-0.5">
        {displayIndex}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <span className="text-[9px] font-bold text-sage uppercase tracking-wider">
          {cat.name}
        </span>
        <h4 className="text-xs sm:text-sm font-bold font-serif text-gray-900 group-hover:text-sage transition-colors leading-snug line-clamp-2 mt-0.5">
          {post.title}
        </h4>
        <span className="text-[10px] text-gray-400 mt-0.5 block">
          {timeAgo(post.createdAt)}
        </span>
      </div>
    </Link>
  );
}