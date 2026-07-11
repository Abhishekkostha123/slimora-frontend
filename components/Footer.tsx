import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "./SocialIcons";
import SubscriberForm from "./SubscriberForm";

const footerLinks = {
  explore: [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "369 Method", href: "/blog?category=369-method" },
    { name: "Spirituality", href: "/blog?category=spirituality" },
    { name: "Mindset", href: "/blog?category=mindset" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Sitemap", href: "/sitemap" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#eae5db] border-t border-[#d5cfc0] mt-10">
      {/* Newsletter section */}
      <div className="border-b border-[#d5cfc0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <SubscriberForm layout="horizontal" />
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <div className="font-serif font-bold text-2xl text-gray-800 tracking-tight">
                Slimora Living
              </div>
              <p className="text-[10px] text-[#c19a6b] tracking-widest uppercase font-bold mt-0.5">
                Manifestation · Spirituality · Mindset
              </p>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
              Your trusted guide to the 369 Manifestation Method, law of
              attraction, and daily spiritual growth practices.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-gray-500 hover:text-sage hover:bg-white transition-colors shadow-xs"
              >
                <FacebookIcon size={14} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-gray-500 hover:text-sage hover:bg-white transition-colors shadow-xs"
              >
                <InstagramIcon size={14} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-gray-500 hover:text-sage hover:bg-white transition-colors shadow-xs"
              >
                <TwitterIcon size={14} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-gray-500 hover:text-sage hover:bg-white transition-colors shadow-xs"
              >
                <YoutubeIcon size={14} />
              </a>
            </div>
          </div>

          {/* Explore links */}
          <div>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-sage transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-sage transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#d5cfc0] py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {currentYear} Slimora Living. All rights reserved.</p>
          <p className="text-center">
            Content is for informational purposes only.{" "}
            <Link href="/terms" className="hover:text-sage underline transition-colors">
              Terms
            </Link>{" "}
            ·{" "}
            <Link href="/privacy" className="hover:text-sage underline transition-colors">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}