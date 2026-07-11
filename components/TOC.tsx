"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";

interface TocItem {
  text: string;
  id: string;
  level: number;
}

interface TOCProps {
  toc: TocItem[];
}

export default function TOC({ toc }: TOCProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!toc || toc.length === 0) return;

    const observers = new Map();
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "-80px 0px -60% 0px", // Trigger when header passes upper-middle screen
      threshold: 0.1,
    });

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) {
        observer.observe(el);
        observers.set(item.id, el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [toc]);

  if (!toc || toc.length === 0) return null;

  return (
    <div className="bg-bg-custom/30 border border-border-custom rounded-xl p-4 sm:p-5">
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border-custom/50">
        <List size={16} className="text-sage" />
        <h3 className="font-serif font-bold text-gray-900 text-sm sm:text-base tracking-tight">
          Table of Contents
        </h3>
      </div>
      <nav aria-label="Table of Contents">
        <ul className="space-y-2">
          {toc.map((item, index) => {
            const isSub = item.level === 3;
            const isActive = activeId === item.id;

            return (
              <li
                key={index}
                className={`${isSub ? "pl-4" : ""} transition-all duration-200`}
              >
                <a
                  href={`#${item.id}`}
                  className={`inline-flex items-start gap-1.5 text-xs sm:text-sm transition-colors duration-150 leading-snug cursor-pointer ${
                    isActive
                      ? "text-sage font-bold"
                      : "text-gray-650 hover:text-sage"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(item.id);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                      window.history.pushState(null, "", `#${item.id}`);
                      setActiveId(item.id);
                    }
                  }}
                >
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 transition-transform mt-1.5 ${
                      isActive ? "bg-sage scale-110" : "bg-gray-300"
                    } ${isSub ? "w-1 h-1" : ""}`}
                  />
                  <span>{item.text}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
