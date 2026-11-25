"use client";

import React from "react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", background: "#f8f6ef", color: "#292f27", fontFamily: "Arial, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px" }}>
          <section style={{ width: "100%", maxWidth: "520px", boxSizing: "border-box", padding: "42px 28px", border: "1px solid #e5dfd1", borderRadius: "24px", background: "#fffdf7", textAlign: "center" }}>
            <div style={{ width: "54px", height: "54px", margin: "0 auto", display: "grid", placeItems: "center", borderRadius: "50%", background: "#244b35", color: "#fffdf7", fontFamily: "Georgia, serif", fontSize: "26px" }}>L</div>
            <p style={{ marginTop: "24px", color: "#8c6048", fontSize: "10px", fontWeight: 700, letterSpacing: ".2em" }}>LADO ORGANICS · LADO LOVE PURE</p>
            <h1 style={{ margin: "12px 0", color: "#244b35", fontFamily: "Georgia, serif", fontSize: "34px", fontWeight: 500 }}>We’ll be right back</h1>
            <p style={{ color: "#777568", fontSize: "14px", lineHeight: 1.8 }}>A technical issue interrupted this page. Please try again. Your saved account and order records are not changed by this screen.</p>
            <button type="button" onClick={() => reset()} style={{ marginTop: "18px", border: 0, borderRadius: "999px", padding: "13px 24px", background: "#244b35", color: "white", fontWeight: 700, cursor: "pointer" }}>Try again</button>
            <p style={{ marginTop: "22px", fontSize: "12px" }}><a href="/" style={{ color: "#8c6048" }}>Return to Lado Organics</a></p>
          </section>
        </main>
      </body>
    </html>
  );
}
