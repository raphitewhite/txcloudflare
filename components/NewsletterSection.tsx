"use client";

import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && businessName.trim()) {
      setIsSubscribed(true);
      setEmail("");
      setBusinessName("");
      // Reset message after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }
  };

  return (
    <section className="mt-20 bg-slate-900 px-4 py-16 text-white sm:px-6 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row">
        <div className="flex-1 space-y-4">
          <h2 className="text-3xl font-semibold">Get the latest updates from Meta for business.</h2>
          <p className="text-sm text-slate-300">
            Receive personalized updates to enter the digital economy from Meta technologies, trends, events, webinars,
            and email updates.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-4"
          aria-label="Subscribe to Meta for Business updates"
        >
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-2xl bg-slate-800 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline focus:outline-2 focus:outline-metaBlue"
          />
          <input
            type="text"
            placeholder="Business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            className="rounded-2xl bg-slate-800 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline focus:outline-2 focus:outline-metaBlue"
          />
          {isSubscribed ? (
            <div className="rounded-2xl bg-green-500/20 px-4 py-3 text-sm text-green-400">
              Thank you for subscribing to our updates!
            </div>
          ) : (
            <button
              type="submit"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Subscribe
            </button>
          )}
        </form>
      </div>
    </section>
  );
}
