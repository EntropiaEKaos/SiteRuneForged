"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";

type AnalyticsPayload = {
  type: "page_view" | "interaction" | "web_vital";
  path: string;
  name?: string;
  value?: number;
  rating?: string;
};

function enabled() {
  return process.env.NEXT_PUBLIC_PORTAL_ANALYTICS !== "false";
}

function send(payload: AnalyticsPayload) {
  if (!enabled() || typeof window === "undefined") return;
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/public/portal/analytics", new Blob([body], { type: "application/json" }));
    return;
  }
  void fetch("/api/public/portal/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

export default function PortalAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    send({ type: "page_view", path: `${pathname}${search ? `?${search}` : ""}`.slice(0, 500) });
  }, [pathname, search]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-analytics]") : null;
      const name = target?.dataset.analytics?.trim();
      if (!name || pathname.startsWith("/admin")) return;
      send({ type: "interaction", path: pathname, name: name.slice(0, 120) });
    };
    document.addEventListener("click", onClick, { passive: true });
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  useReportWebVitals((metric) => {
    if (pathname.startsWith("/admin")) return;
    send({
      type: "web_vital",
      path: pathname,
      name: metric.name,
      value: Number(metric.value.toFixed(3)),
      rating: "rating" in metric ? String(metric.rating) : undefined,
    });
  });

  return null;
}
