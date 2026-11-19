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
      id: u-,
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
        { id: -, sender: "bot", text: replyText }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: err-,
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

  return (
    <>
      <a
        href={https://wa.me/?text=}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="whatsapp-float px-4 py-3.5 rounded-full font-bold text-sm flex items-center gap-2"
      >
        <span>WhatsApp</span>
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
                className={p-3 rounded-2xl max-w-[88%] }
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
