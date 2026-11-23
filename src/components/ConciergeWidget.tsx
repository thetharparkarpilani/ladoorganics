"use client";

import React, { useEffect, useRef, useState } from "react";

type SuggestedAction = { label: string; href: string };
interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  actions?: SuggestedAction[];
}
interface ConciergeWidgetProps { whatsappNumber: string; }

const STARTERS = [
  "What products do you have?",
  "Tell me about your A2 Bilona Ghee",
  "How does delivery work?",
  "How can I check my order?",
  "Tell me about Bhunga stays",
  "How does Gau Seva work?",
];

const WELCOME: ChatMessage = {
  id: "welcome",
  sender: "bot",
  text: "Namaste! 🌿 I’m Lado AI. Ask me about our products, prices, farm practices, stays, Gau Seva, orders, payments or anything on this website. If I can’t verify an answer, I’ll say so and help you reach our team.",
};

export default function ConciergeWidget({ whatsappNumber }: ConciergeWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const askQuestion = async (question: string) => {
    const text = question.trim();
    if (!text || loading || text.length > 1500) return;
    const priorHistory = messages
      .filter((m) => m.id !== "welcome")
      .slice(-8)
      .map((m) => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text }));
    const userMessage: ChatMessage = { id: `user-${Date.now()}`, sender: "user", text };
    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: priorHistory }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "Please try again in a moment.");
      const actions = Array.isArray(data.actions)
        ? data.actions.filter((item: unknown): item is SuggestedAction =>
            !!item && typeof item === "object" &&
            typeof (item as SuggestedAction).label === "string" &&
            typeof (item as SuggestedAction).href === "string" &&
            (item as SuggestedAction).href.startsWith("/") &&
            !(item as SuggestedAction).href.startsWith("//")
          ).slice(0, 4)
        : [];
      setMessages((previous) => [...previous, {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: typeof data.reply === "string" ? data.reply : "I couldn't prepare an answer. Please contact our team.",
        actions,
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([WELCOME]);
    setInput("");
    setError("");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void askQuestion(input);
  };

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent("Namaste Lado Organics, I need help with a question from the website.")}`;

  return (
    <>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Lado Organics on WhatsApp"
        className="lado-whatsapp-float"
      >
        <span className="lado-whatsapp-icon" aria-hidden="true">
          <svg viewBox="0 0 32 32" className="h-8 w-8 fill-current">
            <path d="M16.02 3C8.85 3 3.02 8.76 3.02 15.86c0 2.28.61 4.5 1.77 6.44L3 29l6.9-1.8a13.1 13.1 0 0 0 6.12 1.5h.01c7.17 0 13-5.77 13-12.86C29.03 8.75 23.2 3 16.02 3Zm0 23.52h-.01a10.9 10.9 0 0 1-5.55-1.51l-.4-.24-4.1 1.07 1.1-3.97-.26-.41a10.62 10.62 0 0 1-1.66-5.6c0-5.91 4.88-10.72 10.88-10.72 2.9 0 5.63 1.12 7.68 3.15a10.57 10.57 0 0 1 3.18 7.57c0 5.91-4.88 10.72-10.86 10.72Zm5.97-8.03c-.33-.16-1.94-.95-2.24-1.06-.3-.11-.52-.16-.74.16-.22.33-.85 1.06-1.04 1.28-.19.22-.38.25-.71.08-.33-.16-1.38-.5-2.63-1.59-.97-.84-1.62-1.88-1.81-2.2-.19-.33-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.74-1.75-1.01-2.4-.27-.63-.54-.54-.74-.55h-.63c-.22 0-.57.08-.87.41-.3.33-1.14 1.11-1.14 2.7 0 1.59 1.17 3.13 1.33 3.35.16.22 2.3 3.48 5.58 4.88.78.33 1.39.53 1.86.68.78.24 1.49.21 2.05.13.63-.09 1.94-.79 2.21-1.56.27-.77.27-1.43.19-1.56-.08-.14-.3-.22-.63-.38Z"/>
          </svg>
        </span>
        <span className="lado-whatsapp-label">WhatsApp</span>
      </a>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="lado-ai-panel"
        aria-label={isOpen ? "Close Lado AI" : "Open Lado AI assistant"}
        className="lado-ai-launcher"
      >
        <span className="lado-ai-launcher-mark" aria-hidden="true">L</span>
        <span>{isOpen ? "Close" : "Ask Lado AI"}</span>
        {!isOpen && <span className="lado-ai-online-dot" aria-label="Assistant available" />}
      </button>

      {isOpen && (
        <section id="lado-ai-panel" role="dialog" aria-modal="false" aria-label="Lado AI customer assistant" className="lado-ai-panel">
          <header className="lado-ai-header">
            <div className="lado-ai-avatar" aria-hidden="true">L</div>
            <div className="min-w-0 flex-1">
              <p className="lado-ai-title">Lado AI</p>
              <p className="lado-ai-subtitle"><span /> Your Lado Organics guide · Pilani</p>
            </div>
            <button type="button" onClick={resetChat} className="lado-ai-header-action" title="Start a new conversation">New chat</button>
            <button type="button" onClick={() => setIsOpen(false)} className="lado-ai-close" aria-label="Close chat">×</button>
          </header>

          <div ref={scrollRef} className="lado-ai-messages" aria-live="polite" aria-relevant="additions text">
            <div className="lado-ai-day-label"><span /> A LITTLE FARM WISDOM <span /></div>
            {messages.map((message) => (
              <div key={message.id} className={`lado-ai-message-row ${message.sender === "user" ? "is-user" : "is-assistant"}`}>
                {message.sender === "bot" && <span className="lado-ai-mini-avatar" aria-hidden="true">L</span>}
                <div className="lado-ai-message-content">
                  <div className="lado-ai-bubble">{message.text}</div>
                  {message.actions && message.actions.length > 0 && (
                    <div className="lado-ai-actions">
                      {message.actions.map((action) => (
                        <a key={action.href} href={action.href}>{action.label} <span aria-hidden="true">↗</span></a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="lado-ai-message-row is-assistant">
                <span className="lado-ai-mini-avatar" aria-hidden="true">L</span>
                <div className="lado-ai-typing" aria-label="Lado AI is thinking"><i /><i /><i /></div>
              </div>
            )}
            {error && <p role="alert" className="lado-ai-error">{error}</p>}
          </div>

          {messages.length === 1 && (
            <div className="lado-ai-starters">
              <p>WHAT CAN I HELP YOU WITH?</p>
              <div>
                {STARTERS.map((starter) => (
                  <button key={starter} type="button" onClick={() => void askQuestion(starter)} disabled={loading}>{starter} <span>↗</span></button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="lado-ai-composer">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask me anything about Lado..."
              aria-label="Your question for Lado AI"
              maxLength={1500}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Send message">
              {loading ? <span className="lado-ai-send-spinner" /> : <span aria-hidden="true">↑</span>}
            </button>
          </form>
          <footer className="lado-ai-footer">
            <span>AI can make mistakes. Never share OTPs, passwords or UPI PINs.</span>
            <a href="/contact">Human support</a>
          </footer>
        </section>
      )}
    </>
  );
}
