"use client";

import React, { useState } from "react";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
}

interface ConciergeWidgetProps {
  whatsappNumber: string;
}

const QUICK_PROMPTS = [
  "A2 Bilona Ghee pricing",
  "Deep Work Bhunga Stay",
  "Adopt a calf (Tara, Roshni)"
];

export default function ConciergeWidget({ whatsappNumber }: ConciergeWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Namaste! Ask about A2 Bilona Ghee, Tharparkar Dhoop, Pure Kechua Khad, Bhunga stays, or our Pilani calves."
    }
  ]);

  const askQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed })
      });
      const data = await res.json();
      const replyText =
        res.ok && typeof data.reply === "string"
          ? data.reply
          : data.error || "Please try again or reach us on WhatsApp.";

      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, sender: "bot", text: replyText }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: "bot",
          text: "Connection issue. Please tap WhatsApp on the bottom-left for immediate help."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void askQuestion(input);
  };

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;

  return (
    <>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Lado Organics on WhatsApp"
        className="fixed bottom-6 left-6 z-50 flex flex-col items-center gap-2 text-[#777] no-underline"
      >
        <span className="relative flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(0,0,0,0.22)] transition-transform duration-200 hover:scale-105">
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-35 animate-ping motion-reduce:animate-none" aria-hidden="true" />
          <svg viewBox="0 0 32 32" className="relative z-10 h-9 w-9 fill-current" aria-hidden="true">
            <path d="M16.02 3C8.85 3 3.02 8.76 3.02 15.86c0 2.28.61 4.5 1.77 6.44L3 29l6.9-1.8a13.1 13.1 0 0 0 6.12 1.5h.01c7.17 0 13-5.77 13-12.86C29.03 8.75 23.2 3 16.02 3Zm0 23.52h-.01a10.9 10.9 0 0 1-5.55-1.51l-.4-.24-4.1 1.07 1.1-3.97-.26-.41a10.62 10.62 0 0 1-1.66-5.6c0-5.91 4.88-10.72 10.88-10.72 2.9 0 5.63 1.12 7.68 3.15a10.57 10.57 0 0 1 3.18 7.57c0 5.91-4.88 10.72-10.86 10.72Zm5.97-8.03c-.33-.16-1.94-.95-2.24-1.06-.3-.11-.52-.16-.74.16-.22.33-.85 1.06-1.04 1.28-.19.22-.38.25-.71.08-.33-.16-1.38-.5-2.63-1.59-.97-.84-1.62-1.88-1.81-2.2-.19-.33-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.74-1.75-1.01-2.4-.27-.63-.54-.54-.74-.55h-.63c-.22 0-.57.08-.87.41-.3.33-1.14 1.11-1.14 2.7 0 1.59 1.17 3.13 1.33 3.35.16.22 2.3 3.48 5.58 4.88.78.33 1.39.53 1.86.68.78.24 1.49.21 2.05.13.63-.09 1.94-.79 2.21-1.56.27-.77.27-1.43.19-1.56-.08-.14-.3-.22-.63-.38Z"/>
          </svg>
        </span>
        <span className="text-xs font-medium tracking-wide">Talk to us?</span>
      </a>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle Lado AI Concierge"
        className="fixed bottom-6 right-6 z-50 bg-[var(--terracotta)] text-white px-4 py-3.5 rounded-full font-bold text-sm shadow-xl cursor-pointer"
      >
        {isOpen ? "Close Chat" : "Lado AI"}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Lado AI Concierge"
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-[var(--surface)] text-[var(--mud)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="bg-[var(--mud)] text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">Lado AI Concierge</p>
              <p className="text-[11px] opacity-80">Grounded Pilani & Catalog Assistant</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="p-4 h-64 overflow-y-auto flex flex-col gap-3 text-xs leading-relaxed">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-2xl max-w-[88%] ${
                  m.sender === "user"
                    ? "self-end bg-[var(--terracotta)] text-white"
                    : "self-start bg-[var(--bg)]"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="text-[11px] opacity-70 self-start">Checking verified farm details...</div>
            )}
          </div>

          <div className="px-3 py-2 border-t border-[var(--border)] flex gap-1.5 overflow-x-auto">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => void askQuestion(q)}
                className="text-[11px] px-2.5 py-1 rounded-full border border-[var(--border)] whitespace-nowrap hover:border-[var(--terracotta)] cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t border-[var(--border)] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about ghee, stays, calves..."
              className="flex-1 text-xs px-3 py-2 rounded-full border border-[var(--border)] bg-transparent focus:outline-none focus:border-[var(--terracotta)]"
            />
            <button
              type="submit"
              disabled={loading}
              className="primary-btn px-4 py-2 rounded-full text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
