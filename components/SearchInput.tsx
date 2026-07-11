"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  size?: "sm" | "md";
  className?: string;
  placeholder?: string;
}

export default function SearchInput({
  size = "md",
  className = "",
  placeholder = "Search articles, manifestation...",
}: SearchInputProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputRef.current?.value.trim();
    if (q) router.push(`/blog?q=${encodeURIComponent(q)}`);
  };

  const isSmall = size === "sm";

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="search"
        placeholder={isSmall ? "Search..." : placeholder}
        className={`w-full rounded-full border border-gray-200 bg-gray-50 pr-8 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-sage focus:ring-1 focus:ring-sage transition-colors ${
          isSmall ? "py-1.5 pl-3 text-xs" : "py-2 pl-4"
        }`}
      />
      <button
        type="submit"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sage transition-colors"
        aria-label="Search"
      >
        <Search size={isSmall ? 13 : 16} />
      </button>
    </form>
  );
}
