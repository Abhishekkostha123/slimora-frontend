import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Slimora Living",
  description: "Read our privacy policy. Understand how we collect, store, and safeguard your data at Slimora Living.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const lastUpdated = "July 9, 2026";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12 animate-fade-in space-y-6 font-sans">
      <div className="space-y-2 border-b border-border-custom pb-4">
        <h1 className="text-3xl font-bold font-serif text-gray-905">Privacy Policy</h1>
        <p className="text-xs text-gray-400">Last Updated: {lastUpdated}</p>
      </div>

      <div className="article-content space-y-4 text-sm text-gray-700 leading-relaxed">
        <p>
          At Slimora Living (accessible from <strong>https://www.slimora.living</strong>), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Slimora Living and how we use it.
        </p>

        <h2 className="text-lg font-bold font-serif text-gray-900 pt-3">1. Consent</h2>
        <p>
          By using our website, you hereby consent to our Privacy Policy and agree to its terms.
        </p>

        <h2 className="text-lg font-bold font-serif text-gray-900 pt-3">2. Information We Collect</h2>
        <p>
          The personal info that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>
            <strong>Newsletter Subscriptions:</strong> When you subscribe to our newsletter, we collect your email address and name (optional) to deliver manifestation templates, guides, and spiritual updates.
          </li>
          <li>
            <strong>Comments Section:</strong> When you leave comments on our posts, we collect the name and email address provided in the form, as well as the visitor&apos;s IP address and browser user agent string to help spam detection.
          </li>
          <li>
            <strong>Contact Form:</strong> When you contact us directly, we receive information such as your name, email address, subject of the message, and the contents of the message you send us.
          </li>
        </ul>

        <h2 className="text-lg font-bold font-serif text-gray-900 pt-3">3. How We Use Your Information</h2>
        <p>We use the information we collect in various ways, including to:</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Provide, operate, and maintain our website.</li>
          <li>Improve, personalize, and expand our website templates and content.</li>
          <li>Understand and analyze how you use our website.</li>
          <li>Develop new products, services, features, and functionality.</li>
          <li>Send you emails containing newsletters, articles, and marketing offers (you can unsubscribe at any time).</li>
          <li>Find and prevent spam or fraudulent activity on comments.</li>
        </ul>

        <h2 className="text-lg font-bold font-serif text-gray-900 pt-3">4. Log Files & Analytics</h2>
        <p>
          Slimora Living follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users&apos; movement on the website, and gathering demographic information.
        </p>

        <h2 className="text-lg font-bold font-serif text-gray-900 pt-3">5. Third-Party Links & Affiliate Disclosure</h2>
        <p>
          Our website contains links to other sites. Please note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
        </p>
        <p>
          As an affiliate site, we may recommend products (e.g. journals, meditation cushions, oils, cards) and include affiliate links. If you click on an affiliate link and make a purchase, we may receive a commission. This does not affect our content integrity or increase the cost to you.
        </p>

        <h2 className="text-lg font-bold font-serif text-gray-900 pt-3">6. Contact Information</h2>
        <p>
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <strong>privacy@slimora.living</strong>.
        </p>
      </div>
    </div>
  );
}
