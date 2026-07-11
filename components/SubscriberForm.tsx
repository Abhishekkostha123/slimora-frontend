"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface SubscriberFormProps {
  layout?: "vertical" | "horizontal";
  title?: string;
  description?: string;
}

export default function SubscriberForm({
  layout = "vertical",
  title,
  description,
}: SubscriberFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_SHEET_WEBHOOK_URL as string;
      console.log("Webhook URL:", webhookUrl); // Debugging line
      if (!webhookUrl) {
        throw new Error("Webhook URL is not configured.");
      }

      const res = await fetch(webhookUrl, {
        method: "POST",
        // Apps Script web apps don't handle preflight well, so we send as
        // text/plain to avoid a CORS preflight request being triggered.
        // NOTE: if you still see a CORS error in the console even though
        // the request shows status 200, the issue is on the Apps Script
        // deployment side (Access -> "Anyone"), not in this fetch call.
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      // Apps Script doPost() should return JSON like { result: "success" }.
      // We try to parse it, but don't hard-fail the UI if parsing fails,
      // since the row is likely already saved in the sheet by this point.
      let data: { result?: string; message?: string } = {};
      try {
        data = await res.json();
      } catch {
        // Response wasn't valid JSON — ignore and treat as success below.
      }

      if (data.result === "error") {
        throw new Error(data.message || "Subscription failed on the server.");
      }

      setStatus("success");
      setMessage("Thank you! You have successfully joined our circle.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error && err.message
          ? err.message
          : "Failed to subscribe. Please try again."
      );
    }
  };

  const isHorizontal = layout === "horizontal";

  if (isHorizontal) {
    return (
      <div className="bg-white/80 backdrop-blur-xs border border-border-custom rounded-xl p-5 md:p-7 shadow-xs w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-center">
          <div className="lg:col-span-3 space-y-2">
            <h3 className="font-serif font-bold text-gray-900 text-lg md:text-xl">
              {title || "Join the Slimora Inner Circle"}
            </h3>
            <p className="text-xs md:text-sm text-gray-550 leading-relaxed">
              {description ||
                "Unlock manifestation guides, chakra healing templates, and mindfulness newsletters delivered directly to your inbox."}
            </p>
          </div>
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="flex gap-2 flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading" || status === "success"}
                className="flex-1 px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-hidden focus:border-sage focus:ring-1 focus:ring-sage transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="px-5 py-2 text-sm font-bold bg-sage hover:bg-sage-hover text-white rounded-full flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 flex-shrink-0 cursor-pointer"
              >
                {status === "loading" ? "Subscribing..." : "Join Circle"}
                <Send size={12} />
              </button>
            </form>
            {message && (
              <p
                className={`text-xs mt-2 font-medium ${
                  status === "success" ? "text-sage" : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default Vertical Layout (Sidebar)
  return (
    <div className="bg-white border border-border-custom rounded-xl p-4 sm:p-5 shadow-xs space-y-3.5 text-center">
      <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center mx-auto text-sage">
        <Send size={18} />
      </div>
      <div className="space-y-1">
        <h3 className="font-serif font-bold text-gray-900 text-base">
          {title || "Inner Circle Newsletter"}
        </h3>
        <p className="text-xs text-gray-550 leading-relaxed">
          {description || "Manifest your desires. Get spiritual guides and ritual templates weekly."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <input
          type="email"
          placeholder="Your email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
          className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-full focus:outline-hidden focus:border-sage focus:ring-1 focus:ring-sage transition-all text-center disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="w-full py-2 text-xs font-bold bg-sage hover:bg-sage-hover text-white rounded-full transition-all disabled:opacity-50 cursor-pointer"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe Now"}
        </button>
      </form>

      {message && (
        <p
          className={`text-[11px] font-medium ${
            status === "success" ? "text-sage" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}