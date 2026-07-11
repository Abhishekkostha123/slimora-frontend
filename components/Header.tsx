"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchInput from "./SearchInput";
import type { Category } from "@/lib/api";

interface HeaderProps {
  categories: Category[];
}

export default function Header({ categories }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Build nav dynamically from real DB categories instead of hardcoded slugs.
  // Shows up to 3 top categories in the nav bar; falls back gracefully if none exist yet.
  const navigation = [
    { name: "HOME", href: "/" },
    { name: "BLOG", href: "/blog" },
    ...categories.slice(0, 3).map((cat) => ({
      name: cat.name.toUpperCase(),
      href: `/blog?category=${cat.slug}`,
    })),
    { name: "ABOUT", href: "/about" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]) && (
      href.includes("?")
        ? pathname.includes(href.split("=")[1] || "")
        : !pathname.includes("category=")
    );
  };

  return (
    <header className="w-full bg-white">
      {/* Top Brand Bar */}
      <div className="border-b border-border-custom py-4 px-4 text-center">
        <Link href="/" className="inline-block group">
          <div className="text-3xl md:text-4xl font-bold font-serif text-sage tracking-tight group-hover:text-sage-hover transition-colors">
            Slimora Living
          </div>
          <p className="text-[10px] text-sand tracking-widest uppercase mt-1 font-bold">
            Manifestation · Spirituality · Mindset
          </p>
        </Link>
      </div>

      {/* Light Navigation Bar */}
      <nav className="bg-white border-b border-border-custom sticky top-0 z-50 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center h-full">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 lg:px-4 text-xs font-bold tracking-wide transition-colors duration-150 whitespace-nowrap h-full flex items-center border-b-2 ${
                    isActive(item.href)
                      ? "border-sage text-sage font-bold"
                      : "border-transparent text-gray-600 hover:text-sage hover:border-sage/40"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Search + Contact */}
            <div className="hidden md:flex items-center gap-3">
              <SearchInput size="sm" className="w-48 lg:w-56" />
              <Link
                href="/contact"
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                  pathname === "/contact"
                    ? "bg-sage text-white font-bold"
                    : "text-gray-600 hover:text-sage hover:bg-bg-custom"
                }`}
              >
                CONTACT
              </Link>
            </div>

            {/* Mobile header (logo/menu button) */}
            <div className="md:hidden flex items-center justify-between w-full">
              <Link href="/" className="font-serif font-bold text-sage text-lg">
                Slimora
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-600 hover:text-sage transition-colors"
                aria-label="Toggle menu"
              >
                <span className="block w-5 h-0.5 bg-current mb-1" />
                <span className="block w-5 h-0.5 bg-current mb-1" />
                <span className="block w-4 h-0.5 bg-current" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-border-custom px-4 py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-xs font-bold tracking-wide transition-colors ${
                  isActive(item.href)
                    ? "text-sage border-l-2 border-sage pl-3"
                    : "text-gray-600 hover:text-sage pl-3"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-xs font-bold text-gray-600 hover:text-sage pl-3 tracking-wide transition-colors"
            >
              CONTACT
            </Link>
            <div className="pt-2 pb-1">
              <SearchInput size="sm" />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}