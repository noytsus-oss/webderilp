```markdown
# StreamHub — Static Streaming Demo (US / English)

This repo contains a static streaming-style demo site (index + player) that uses TheMovieDB (TMDB) API to list movies and TV shows. It includes:

- index.html — search, popular, trending, list view (fast & responsive)
- player.html — player-like page with season/episode listing for TV
- assets/styles.css — polished professional CSS
- assets/script.js — main UI + TMDB calls
- assets/player.js — player page logic + dynamic OG meta updates
- sitemap.xml and robots.txt
- .htaccess sample for Apache hosting (NOT used by GitHub Pages)

Important notes
1. TMDB API Key
   - The API key is present in the client-side code per your request:
     `22be462e6d3de1dbab03d1ca50847b5a`
   - This is visible to anyone. For production, use serverless proxy or backend.

2. Open Graph / Social sharing
   - Player page updates OG meta tags client-side. Many social platforms require server-side rendered OG tags for consistent previews.
   - For best results, use server-side rendering or prerendering (prerender.io or headless Chromium) for player URLs, or generate static share pages for top content.

3. Sitemap & Indexing
   - sitemap.xml contains main URLs. When you generate many player pages, you must update the sitemap with full player URLs for indexing.
   - To target page 1 on Google: quality content, structured data, fast page speed, backlinks, valid sitemap and robots, and follow SEO best practices.

4. .htaccess vs GitHub Pages
   - .htaccess works only on Apache servers. GitHub Pages ignores .htaccess.
   - For Netlify use a `_redirects` file to redirect all routes to index.html (single page fallback).

5. Ads (Terra CPM) & CPA
   - You can paste Terra CPM ad script in the ad placeholders.
   - CPA link already included and used for CTA redirect on first organic click and play button redirect.

6. Deployment (GitHub Pages)
   - Create a repository, push files to `main` branch.
   - Go to Settings → Pages → Set source to `main` branch / root and save.
   - Your site will be available at `https://<username>.github.io/<repo>/` or your custom domain.
   - Update `sitemap.xml` URL and `robots.txt` accordingly.

7. Improving OG & SEO
   - Option A: Generate static share pages for top N items (player_xxx.html) with prepopulated OG tags and include them in sitemap.
   - Option B: Use a prerender service or serverless function that returns pre-rendered HTML to social crawlers.

8. Enhancements you can request
   - Serverless proxy to hide TMDB API key (Netlify Functions, Vercel).
   - GitHub Action script to generate sitemap by crawling TMDB selected IDs and write sitemap.xml automatically.
   - Add structured data JSON-LD for Movies (schema.org).
   - Add login / favorites / watchlist (requires backend).

If you want, I can:
- Add a GitHub Action to auto-generate sitemap for a list of TMDB IDs.
- Convert OG meta generation to a pre-render flow (example using Netlify functions or Vercel).
- Add sample Terra CPM script integrated into ad slots if you provide the ad code.

```