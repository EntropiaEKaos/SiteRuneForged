import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "RuneForge — Forge Your Legend";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{
      width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden",
      background: "#08090d", color: "#f2eadf", fontFamily: "serif", padding: "72px 84px",
      alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", background: "radial-gradient(circle at 78% 42%, rgba(196,143,72,.34), transparent 34%), radial-gradient(circle at 18% 82%, rgba(84,65,116,.25), transparent 36%)" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "relative", maxWidth: 780 }}>
        <div style={{ display: "flex", fontFamily: "sans-serif", fontSize: 20, letterSpacing: 7, color: "#c89655" }}>PORTAL OFICIAL</div>
        <div style={{ display: "flex", fontSize: 92, lineHeight: 0.9, letterSpacing: -5 }}>RuneForge</div>
        <div style={{ display: "flex", fontSize: 35, color: "#c9bca9" }}>Cartas, regiões, regras e as crônicas da Forja.</div>
        <div style={{ display: "flex", gap: 16, fontFamily: "sans-serif", fontSize: 18, color: "#887e71" }}><span>446 cartas Vanilla</span><span>◆</span><span>6 regiões</span><span>◆</span><span>Alpha</span></div>
      </div>
      <div style={{ display: "flex", width: 210, height: 210, border: "3px solid #bd8847", transform: "rotate(45deg)", alignItems: "center", justifyContent: "center", boxShadow: "0 0 80px rgba(189,136,71,.24)", position: "relative" }}>
        <div style={{ display: "flex", transform: "rotate(-45deg)", fontFamily: "sans-serif", fontWeight: 900, fontSize: 68, color: "#e0af6d" }}>RF</div>
      </div>
    </div>,
    size,
  );
}
