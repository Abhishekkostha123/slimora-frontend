"use client";

import { useState } from "react";
import { Mail, MapPin, Send, HelpCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatus("error");
      setErrorMsg("All asterisk fields are required.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_SHEET_WEBHOOK_URL as string;
      if (!webhookUrl) {
        throw new Error("Webhook URL is not configured.");
      }

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      let data: { result?: string; message?: string } = {};
      try {
        data = await res.json();
      } catch {
        // ignore parse failure, treat as success
      }

      if (data.result === "error") {
        throw new Error(data.message || "Failed to send message.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong. Please try again later."
      );
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12 animate-fade-in space-y-8">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-sand">
          Connect With Us
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gray-905">
          Contact Slimora Living
        </h1>
        <p className="text-sm sm:text-base text-gray-550 max-w-xl mx-auto leading-relaxed">
          Have questions about the 369 manifestation method, editorial suggestions, or
          advertising opportunities? Drop us a note below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        {/* Contact details */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-border-custom rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-gray-900 text-base border-b border-border-custom/50 pb-2">
              Contact Info
            </h2>
            
            <div className="space-y-4">
              {/* Email */}
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-sage/10 text-sage flex items-center justify-center shrink-0">
                  <Mail size={14} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-700">General & Support</h3>
                  <a href="mailto:hello@slimora.living" className="text-xs text-sage hover:underline">
                    hello@slimora.living
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-sand/10 text-sand flex items-center justify-center shrink-0">
                  <MapPin size={14} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-700">Headquarters</h3>
                  <p className="text-xs text-gray-550 leading-relaxed">
                    Slimora Media Group LLC<br />
                    100 Broadway, 18th Floor<br />
                    New York, NY 10005
                  </p>
                </div>
              </div>

              {/* Inquiries */}
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                  <HelpCircle size={14} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-700">Editorial Submissions</h3>
                  <p className="text-xs text-gray-550 leading-relaxed">
                    editorial@slimora.living
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white border border-border-custom rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-gray-905 text-lg border-b border-border-custom/50 pb-2">
              Send us a Message
            </h2>

            {status === "success" && (
              <div className="p-4 bg-sage/10 border border-sage/30 rounded-xl text-sage text-xs font-medium">
                Thank you! Your message has been sent successfully. We will get back to you within 24-48 hours.
              </div>
            )}

            {status === "error" && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-500 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-bold text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-sage focus:ring-1 focus:ring-sage transition-all disabled:opacity-50"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-sage focus:ring-1 focus:ring-sage transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-xs font-bold text-gray-700 mb-1">
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                placeholder="How can we help you?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={status === "loading"}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-sage focus:ring-1 focus:ring-sage transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-bold text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                placeholder="Write your query or feedback here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === "loading"}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-sage focus:ring-1 focus:ring-sage transition-all resize-y disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-2.5 text-xs font-bold bg-sage hover:bg-sage-hover text-white rounded-full flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              {status === "loading" ? "Sending..." : "Send Message"}
              <Send size={12} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
