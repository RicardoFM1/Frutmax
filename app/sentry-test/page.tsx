"use client";

import * as Sentry from "@sentry/nextjs";

export default function SentryTestPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Teste do Sentry</h1>
      <button
        onClick={() => {
          Sentry.captureMessage("Teste manual Sentry no frontend");
          throw new Error("Erro manual de teste do Sentry");
        }}
        style={{
          marginTop: 12,
          padding: "10px 14px",
          border: "1px solid #ccc",
          borderRadius: 8,
        }}
      >
        Enviar evento de teste
      </button>
    </main>
  );
}
