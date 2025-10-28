export async function GET() {
  const pages = ["/", "/auth/login", "/auth/register", "/bank/1", "/category/1", "/place/1"];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages.map((url) => `<url><loc>https://yourdomain.com${url}</loc></url>`).join("")}
    </urlset>`;
  return new Response(sitemap, { headers: { "Content-Type": "application/xml" } });
}
