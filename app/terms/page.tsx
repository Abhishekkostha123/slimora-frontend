import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Slimora Living",
  description: "Read our terms of service. Understand the rules and regulations for using the Slimora Living website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const lastUpdated = "July 9, 2026";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12 animate-fade-in space-y-6 font-sans">
      <div className="space-y-2 border-b border-border-custom pb-4">
        <h1 className="text-3xl font-bold font-serif text-gray-905">Terms of Service</h1>
        <p className="text-xs text-gray-400">Last Updated: {lastUpdated}</p>
      </div>

      <div className="article-content space-y-4 text-sm text-gray-700 leading-relaxed">
        <p>
          Welcome to Slimora Living. These Terms of Service outline the rules and regulations for the use of our Website, located at <strong>https://www.slimora.living</strong>.
        </p>

        <h2 className="text-lg font-bold font-serif text-gray-900 pt-3">1. Acceptance of Terms</h2>
        <p>
          By accessing this website, we assume you accept these terms of service in full. Do not continue to use Slimora Living if you do not agree to all of the terms of service stated on this page.
        </p>

        <h2 className="text-lg font-bold font-serif text-gray-900 pt-3">2. Intellectual Property Rights</h2>
        <p>
          Unless otherwise stated, Slimora Living and/or its licensors own the intellectual property rights for all material on Slimora Living. All intellectual property rights are reserved. You may access this from Slimora Living for your own personal use subjected to restrictions set in these terms of service.
        </p>
        <p>You must not:</p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>Republish material from Slimora Living without written consent.</li>
          <li>Sell, rent, or sub-license material from Slimora Living.</li>
          <li>Reproduce, duplicate, or copy material from Slimora Living.</li>
          <li>Redistribute content from Slimora Living (unless content is specifically made for redistribution, like downloadable journals).</li>
        </ul>

        <h2 className="text-lg font-bold font-serif text-gray-900 pt-3">3. User-Generated Content & Comments</h2>
        <p>
          Parts of this website offer users the opportunity to post comments and exchange opinions in the discussion section. Slimora Living does not filter, edit, publish, or review comments prior to their presence on the website. Comments do not reflect the views and opinions of Slimora Living, its agents, or affiliates. Comments reflect the views and opinions of the person who posts their views.
        </p>
        <p>
          Slimora Living reserves the right to monitor all comments and to remove any comments which can be considered inappropriate, offensive, or cause a breach of these Terms of Service.
        </p>

        <h2 className="text-lg font-bold font-serif text-gray-900 pt-3">4. Spiritual & Manifestation Disclaimer</h2>
        <p>
          The content provided on Slimora Living (including articles on the 369 manifestation method, Law of Attraction, chakras, meditation, and rituals) is for informational and educational purposes only. It is not intended to substitute for professional medical, psychological, financial, or legal advice. 
        </p>
        <p>
          We make no guarantees regarding the results of performing manifestation methods or rituals discussed on this site. Your success depends on your own efforts, mindset, and external variables.
        </p>

        <h2 className="text-lg font-bold font-serif text-gray-900 pt-3">5. Disclaimer of Warranties & Limitation of Liability</h2>
        <p>
          This website is provided &ldquo;as is,&rdquo; with all faults, and Slimora Living expresses no representations or warranties of any kind related to this website or the materials contained on it. In no event shall Slimora Living, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website.
        </p>

        <h2 className="text-lg font-bold font-serif text-gray-900 pt-3">6. Governing Law</h2>
        <p>
          These Terms will be governed by and interpreted in accordance with the laws of the State of New York, USA, and you submit to the non-exclusive jurisdiction of the state and federal courts located in New York for the resolution of any disputes.
        </p>
      </div>
    </div>
  );
}