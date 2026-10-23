---
title: "Free site checks: audit, citations, AI crawlers"
description: "Three free checks that call no model: what AI crawlers can read on your sites, which cited pages name you, and AI crawler counts from your access logs."
weight: 320
group: Acting on it
---

**Can AI assistants read my site?** `cheapseats audit` checks what an AI crawler sees on each of your sites: whether robots.txt or a firewall blocks it, whether there's an llms.txt and a fresh sitemap, and whether each page has its content in the HTML or is empty without JavaScript. Two more checks sit beside it: the **citation check**, of which pages the answers cite name you and which name only competitors, and **AI crawler** counts from your own access logs.

None of the three calls a model. They're plain HTTP requests and your own logs, so they cost nothing, on any setup, and don't count against the [daily budget](../cost-and-budget/).

## Site audit

```bash
cheapseats audit                 # every site in [[brand.sites]] (and brand.domains)
cheapseats audit example.com     # just one, which needn't be yours (not kept)
cheapseats audit -pages 20 -info # more sitemap pages; list info findings too
cheapseats audit -json           # the findings as JSON
```

Also **Site audit** in the web UI (`/audit`, "Audit now"), `POST /api/audit` to run one and `GET /api/audit` for the latest, and the MCP tool `audit_sites`.

For each site it fetches robots.txt, the home page, `/llms.txt`, the sitemap and up to 10 pages from the sitemap, spread through it. It fetches as `Mozilla/5.0 (compatible; CheapSeats-Audit/<version>; +https://cheapseats.dev)`, 4 requests at a time, with a 15-second timeout and a 2 MB cap per page, and reads the raw HTML, as a crawler that runs no JavaScript does.

- A host/path site (`github.com/example`) gets its robots.txt rules checked for that path, but no llms.txt or sitemap check: those belong to the host.
- Sites of kind `code` or `community` (your GitHub, a forum) raise no robots.txt, firewall, llms.txt, sitemap or markup findings: none of that is yours to fix. Which crawlers the host blocks is still recorded on the site's `blocked` line, so you know it, without a fix you can't apply.
- The newest audit of your own sites is kept. If it's less than 30 days old, its errors and warnings go to the analyst with the next fix list, so a fix can say "this page is empty without JavaScript" rather than only "this page wasn't cited".

Each finding has a severity, a check id, what it found and a fix.

### Crawling rules

| check | severity | what it means | fix |
| --- | --- | --- | --- |
| `robots.blocks-ai-search` | error | robots.txt blocks an assistant's search or user fetcher (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User) | allow it: `User-agent: <bot>` and `Allow: /` |
| `robots.blocks-search-engine` | error | robots.txt blocks Googlebot or Bingbot, whose indexes Gemini, ChatGPT and Copilot search | allow it the same way |
| `robots.blocks-training` | info | robots.txt blocks a training crawler (GPTBot, ClaudeBot, anthropic-ai, Google-Extended, Applebot-Extended, CCBot, Meta-ExternalAgent, Bytespider) | nothing, unless you want future models to learn from these pages. It keeps pages out of training data, not out of search answers |
| `robots.server-error` | error | robots.txt answers 5xx, which crawlers read as "fetch nothing" | serve it with a 200, or a 404 if you don't want one |
| `robots.unreachable` | warning | robots.txt couldn't be fetched at all | make sure `/robots.txt` answers quickly over HTTPS |
| `robots.missing` | info | no robots.txt: everything is allowed | optional; add one to point crawlers at your sitemap |
| `waf.blocks-ai-bot` | error | the home page answers 401, 403 or 429, or a challenge page, to an AI fetcher's user agent while a browser's gets 200 | allow the bot in your firewall or CDN bot settings (on Cloudflare, Security > Bots, AI Crawl Control) |

**The firewall check only sends each bot's user agent, from Cheap Seats' address.** A firewall that lets verified bots through by IP may block this check and still admit the real crawler. Confirm in the firewall's log, or with the [crawler counts](#ai-crawlers) below, before changing rules.

### llms.txt and the sitemap

| check | severity | what it means | fix |
| --- | --- | --- | --- |
| `llms.missing` | warning | no `/llms.txt`, or a catch-all route serving HTML there | publish one: `# <site name>`, a one-line summary in a `>` quote, then sections of `[title](url): description` links to your key pages |
| `llms.content-type` | warning | llms.txt isn't served as text/plain or text/markdown | serve it as one of those |
| `llms.heading` | warning | llms.txt doesn't start with `# ` | start it with `# <site name>` |
| `llms.no-links` | warning | llms.txt has no markdown links | list your key pages as `[title](url)` links |
| `sitemap.missing` | warning | no sitemap in robots.txt and none at `/sitemap.xml` | publish `/sitemap.xml` with each page's `<lastmod>`, and add `Sitemap: <url>` to robots.txt |
| `sitemap.invalid` | error | the sitemap doesn't parse | serve valid sitemap XML: a `<urlset>` of `<url><loc>` entries, or a `<sitemapindex>` |
| `sitemap.empty` | warning | it lists no pages | list every public page |
| `sitemap.stale` | warning | its newest `<lastmod>` is over 180 days old | regenerate it when pages change, with each page's real `<lastmod>` |
| `sitemap.no-lastmod` | info | it gives no `<lastmod>` dates | add `<lastmod>` to each `<url>`, from the page's real last change |

### Pages

| check | severity | what it means | fix |
| --- | --- | --- | --- |
| `page.unreachable` | error | the page couldn't be fetched | make sure it answers over HTTPS within a few seconds |
| `page.status` | error | the page didn't answer 200 | serve it with a 200, or drop it from the sitemap if it's gone |
| `page.challenge` | error | the page served a bot challenge instead of its content | let crawlers and plain HTTP clients through to public pages |
| `page.needs-js` | error | under 200 characters of text in the HTML and an app mount point (`#root`, `#app`, `#__next`...): empty without JavaScript | render on the server or pre-render at build time (SSR or SSG) |
| `page.thin` | warning | under 200 characters of text in the HTML | put the content in the HTML, not loaded by JavaScript afterwards |
| `page.noindex` | error | a robots meta tag or `X-Robots-Tag` says noindex | remove noindex from public pages |
| `page.jsonld-invalid` | error | a JSON-LD block doesn't parse | fix the JSON in each `<script type="application/ld+json">` |
| `page.jsonld-missing` | warning | no JSON-LD | add schema.org JSON-LD: Organization and WebSite on the home page, SoftwareApplication or Product for the product, Article or TechArticle for guides, FAQPage for FAQs |
| `page.title-missing` | warning | no `<title>` | give it a title in the words buyers search with |
| `page.title-long` | warning | a `<title>` over 60 characters | shorten it, key words first |
| `page.description-missing` | warning | no meta description | add a 50–160 character summary |
| `page.description-length` | warning | a meta description outside 50–160 characters | rewrite it to 50–160 characters |
| `page.h1` | warning | not exactly one `<h1>` | give it exactly one |
| `page.lang` | warning | no `lang` on `<html>` | add `lang="en"`, or the page's language |
| `page.canonical` | warning | no canonical link | add `<link rel="canonical" href="<its URL>">` |
| `page.open-graph` | warning | no `og:title` or `og:description` | add both |

A site listed in a form Cheap Seats can't read gets `site.invalid` (error): list it as a host (`example.com`) or a host and path (`github.com/example`).

## Citation check

```bash
cheapseats check-citations <run-id>         # the 25 most-cited third-party pages
cheapseats check-citations -n 50 <run-id>
```

Also on the **Site audit** page ("Check citations", for any finished run), `POST /api/runs/{id}/citation-check` (`?n=`, default 25) to run one and `GET` for the run's latest, and the MCP tool `check_citations`.

It takes the run's third-party pages, most cited first, then most surfaced in searches, and fetches each one as Cheap Seats, where its robots.txt allows `CheapSeats-Audit`. Each page is fetched at most once a day and kept for a month. It reads the page's visible text and says whether it names your brand or an alias, and which of the set's competitors.

A page that names competitors but not you is marked **outreach**: the answers read it, and it leaves you out. That's the same idea as the run page's [Cited without your brand](../metrics/#buckets-outreach-and-found-but-not-cited) list, checked against the page itself rather than the answers.

Matching is by whole word, ignoring case. That's stricter than the grader's own check, so a short alias doesn't match inside another word.

## AI crawlers

```bash
cheapseats crawl import access.log access.log.1.gz        # nginx, Apache
cheapseats crawl import -host docs.example.com docs.log   # the site, for lines that don't record one
cheapseats crawl import cloudflare-*.json caddy.json -    # - reads stdin
cheapseats crawl report -days 30
```

Also **AI crawlers** in the web UI (`/crawlers`), `GET /api/crawlers?days=30`, and the MCP tool `get_crawlers`.

It reads:

- **common and combined log format**, the nginx and Apache defaults, with or without a leading virtual host;
- **Caddy's JSON access log**;
- **Cloudflare Logpush JSON** (`ClientRequestUserAgent`, `ClientRequestURI`, `ClientRequestHost`, `EdgeStartTimestamp`, `ClientIP`, `EdgeResponseStatus`, `ClientRequestReferer`).

Lines with no host (common and combined) count under `-host`, or your first site. Requests for CSS, scripts, images and fonts are skipped. Gzipped logs are read as they are.

Each request is classed by its user agent:

| class | what | bots |
| --- | --- | --- |
| **assistant** | fetched because someone asked | ChatGPT-User, Claude-User, Perplexity-User, MistralAI-User |
| **AI search** | building an assistant's search index | OAI-SearchBot, Claude-SearchBot, PerplexityBot, DuckAssistBot |
| **training** | collecting training data | GPTBot, ClaudeBot, anthropic-ai, CCBot, Meta-ExternalAgent, Bytespider, Amazonbot, cohere-ai |
| **engine** | a web search engine some assistants search through | Googlebot, Bingbot |
| **AI referral** | a person, arriving from an assistant's answer | a Referer from chatgpt.com, chat.openai.com, claude.ai, perplexity.ai, copilot.microsoft.com or gemini.google.com, or `utm_source=` one of them |

**Unverified: user agent only.** Anyone can send a crawler's user agent, and nothing here checks the request's IP against the operator's published ranges. Read the counts as what the logs claim.

Cheap Seats keeps only daily counts per host, page, class and bot, not log lines, plus a hash of each counted request, so importing the same log twice, or one that overlaps it, counts nothing twice.

### On a schedule

Because a repeated import counts nothing twice, a schedule can simply re-import the current log and the last rotated one every hour. On the machine that has both the logs and Cheap Seats' data directory:

```bash
# crontab -e
0 * * * * CHEAPSEATS_CONFIG=/srv/cheapseats/config/cheapseats.toml CHEAPSEATS_DATA_DIR=/srv/cheapseats/data /usr/local/bin/cheapseats crawl import /var/log/nginx/access.log /var/log/nginx/access.log.1
```

The import needs no API keys: it reads the config for your sites and writes only to the database. It's safe beside a running `cheapseats serve`. When the logs live on another machine, as with a site served from its own server, copy them over first in the same job; [a public read-only copy](../read-only-copy/#ai-crawler-logs-too) does that over SSH. A site on GitHub Pages or another host without access logs has nothing to import.

The page lists each of your pages' fetches by class, and AI referrals, beside how often the latest finished run of each set cited and surfaced it, and flags:

- **crawled, never cited**: AI crawlers fetched it, but no answer in the latest runs cited it;
- **cited, never crawled by search bots**: answers cite it, but no assistant or AI search crawler fetched it in the window. Only for hosts your logs cover.

## Where to start

Run `cheapseats audit` before your first paid run. It's free, it takes a minute, and an error there, such as a firewall that blocks ChatGPT-User or a docs site that's empty without JavaScript, explains a lot of "never cited" before you've asked a single question. Then read [Reading results](../reading-results/) for what a run adds.
