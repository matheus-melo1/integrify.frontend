import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import "@/shared/styles/index.css";
import { App } from "@/app/App";

registerSW({ immediate: true });

// Limpa chave legada do auth store (pré-prefixo `integrify:`).
localStorage.removeItem("auth-storage");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
