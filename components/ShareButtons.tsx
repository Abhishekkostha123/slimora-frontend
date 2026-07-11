"use client";

import { useState } from "react";
import { Link2, Check, Share2 } from "lucide-react";

interface ShareButtonsProps {
  postUrl: string;
  postTitle: string;
}

// SVGs for social media declared outside of render to prevent ESLint errors
const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const PinterestIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.4 7.63 11.16-.1-.95-.2-2.4.04-3.43.22-.93 1.4-5.93 1.4-5.93s-.36-.72-.36-1.77c0-1.66.96-2.9 2.11-2.9 1 0 1.48.75 1.48 1.65 0 1-.64 2.5-.97 3.89-.28 1.18.6 2.13 1.76 2.13 2.1 0 3.73-2.22 3.73-5.43 0-2.84-2.04-4.83-4.96-4.83-3.38 0-5.37 2.54-5.37 5.16 0 1.02.4 2.12.89 2.72.1.12.11.23.08.35-.1.38-.3 1.2-.35 1.37-.06.24-.2.32-.45.2-1.67-.78-2.72-3.2-2.72-5.16 0-4.2 3.05-8.06 8.8-8.06 4.62 0 8.2 3.3 8.2 7.7 0 4.6-2.9 8.3-6.93 8.3-1.35 0-2.62-.7-3.05-1.52l-.83 3.18c-.3 1.15-1.1 2.58-1.63 3.45C9.48 23.6 10.72 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z" />
  </svg>
);

const WhatsappIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.118-2.905-6.993-1.876-1.875-4.357-2.908-6.994-2.91-5.447 0-9.87 4.417-9.873 9.861-.001 1.702.463 3.364 1.34 4.82L1.93 21.053l4.717-1.237zM17.43 14.59c-.295-.148-1.748-.862-2.016-.962-.268-.099-.463-.148-.658.148-.195.297-.757.962-.928 1.16-.17.197-.341.221-.637.073-.295-.148-1.25-.46-2.38-1.47-1.01-1.03-1.5-1.92-1.7-2.22-.2-.295-.02-.455.127-.602.133-.132.296-.347.444-.52.149-.17.197-.297.296-.495.1-.198.05-.371-.025-.52-.075-.148-.658-1.587-.903-2.18-.238-.574-.482-.496-.658-.504-.17-.008-.365-.01-.56-.01s-.512.073-.78.37c-.268.297-1.024 1.002-1.024 2.445 0 1.443 1.049 2.84 1.196 3.037.147.198 2.062 3.149 4.996 4.413.698.301 1.243.482 1.668.617.701.223 1.34.191 1.845.115.563-.083 1.748-.713 1.992-1.402.244-.689.244-1.278.171-1.402-.073-.124-.268-.198-.563-.346z" />
  </svg>
);

export default function ShareButtons({ postUrl, postTitle }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postTitle)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(postUrl)}&description=${encodeURIComponent(postTitle)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${postTitle} - ${postUrl}`)}`,
  };

  return (
    <div className="bg-white border border-border-custom rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Share2 size={16} className="text-sage" />
        <span className="font-serif font-bold text-gray-800 text-sm">Share Article</span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Facebook */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer nofollow"
          title="Share on Facebook"
          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-500 hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2] transition-all"
        >
          <FacebookIcon />
        </a>

        {/* Twitter */}
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer nofollow"
          title="Share on X"
          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all"
        >
          <TwitterIcon />
        </a>

        {/* Pinterest */}
        <a
          href={shareLinks.pinterest}
          target="_blank"
          rel="noopener noreferrer nofollow"
          title="Share on Pinterest"
          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-500 hover:bg-[#bd081c] hover:text-white hover:border-[#bd081c] transition-all"
        >
          <PinterestIcon />
        </a>

        {/* WhatsApp */}
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer nofollow"
          title="Share on WhatsApp"
          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-500 hover:bg-[#25d366] hover:text-white hover:border-[#25d366] transition-all"
        >
          <WhatsappIcon />
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          title="Copy Link to Clipboard"
          className="px-3.5 h-8 rounded-full border border-gray-150 flex items-center justify-center text-xs font-bold text-gray-600 hover:border-sage hover:text-sage transition-all gap-1.5 cursor-pointer bg-transparent"
        >
          {copied ? (
            <>
              <Check size={13} className="text-sage" />
              <span className="text-sage">Copied</span>
            </>
          ) : (
            <>
              <Link2 size={13} />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
