import type { MetadataRoute } from "next";
import { absolutePortalUrl } from "@/lib/portal/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/portal-admin/"] },
    ],
    sitemap: absolutePortalUrl("/sitemap.xml"),
    host: absolutePortalUrl("/"),
  };
}
