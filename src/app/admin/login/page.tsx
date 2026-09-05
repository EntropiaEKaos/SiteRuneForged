"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../editor.module.css";

export default function PortalAdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/portal-admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, ...(totp ? { totp } : {}) }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Falha ao autenticar");
      router.push("/admin");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha ao autenticar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.loginShell}>
      <form className={styles.loginCard} onSubmit={submit}>
        <a className={styles.backLink} href="/">← Portal público</a>
        <span className={styles.kicker}>RUNEFORGE PORTAL CONTROL</span>
        <h1>Entrar na sala de controle.</h1>
        <p>Use o mesmo operador, MFA e permissões administrativas do RuneForge.</p>
        <label>Operador<input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required /></label>
        <label>Senha<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></label>
        <label>MFA <small>opcional quando não configurado</small><input inputMode="numeric" pattern="[0-9]*" value={totp} onChange={(e) => setTotp(e.target.value.slice(0, 8))} autoComplete="one-time-code" /></label>
        {message ? <div className={styles.error}>{message}</div> : null}
        <button className={styles.primaryButton} type="submit" disabled={busy}>{busy ? "Autenticando…" : "Entrar no Portal Control"}</button>
        <small className={styles.securityNote}>A sessão permanece HttpOnly. Credenciais não são armazenadas no frontend.</small>
      </form>
    </main>
  );
}
