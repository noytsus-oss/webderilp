```markdown
# Streamly — Static Landing + Player (CPA-ready)

This repo contains a frontend-only landing page and player to be hosted as static files (e.g., GitHub Pages). It is made to encourage users to sign up via your CPA affiliate link.

IMPORTANT SECURITY NOTE:
- You provided an API key which is already placed in `config.js`. This file contains a plaintext key. Do NOT commit `config.js` to a public repository if you want to keep the key private.
- Recommended: implement a serverless proxy (Netlify/Vercel/Cloudflare Worker) to keep the API key secret in production.

Files:
- `index.html` — Landing / catalogue
- `player.html` — Player + CTA
- `css/styles.css` — Styling
- `js/app.js`, `js/player.js` — Frontend logic
- `config.js` — Config with API key (you provided)
- `sitemap.xml`, `robots.txt` — SEO helpers
- `assets/` — placeholders (images). Replace with your own.

Quick start:
1. Replace domain placeholders (https://yourdomain.com/) in HTML meta tags and sitemap with your real domain.
2. Replace `assets/` images with your own. Make sure `assets/og-image.jpg` is 1200x630 for best social previews.
3. Push to GitHub and enable Pages (branch: main or gh-pages).
4. Submit `sitemap.xml` to Google Search Console and Bing Webmaster Tools.
5. OPTIONAL but recommended: move API calls to a serverless function to hide your API key.

If you want, I can:
- Generate a Netlify/Vercel function to proxy API requests (keeps key secret).
- Adapt code to a specific real API (e.g., TMDB) by mapping endpoints and fields.
- Create editable OG image SVG template.
```