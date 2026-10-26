---
title: The web UI
description: Every deployment serves a dashboard for your team, with sign-in, read-only share links and a public read-only copy.
weight: 205
group: Reading what it finds
---

**Is there a dashboard?** Yes. Every Cheap Seats deployment serves one. There is no Cheap Seats-hosted service: your team signs in to your deployment. [demo.cheapseats.dev](https://demo.cheapseats.dev/) is a read-only copy of one.

{{< screenshot name="web-ui-dashboard" format="jpg" alt="The dashboard: a prompt-set table with search recommended, named and rank, recall named, and the latest run date for each set." caption="The demo dashboard on 26 October 2026." >}}

## Pages

| Page | Shows |
| --- | --- |
| Dashboard | each prompt set's latest rates, share-of-voice rank and run |
| Quick wins | the ranked fix list, filtered by status, priority, site, gap or set |
| Rankings | each set's named, recommended or top-pick rate by day, with method changes and fixes marked |
| Run | one run's rates, answers, grades, searches and fixes ([Reading results](../reading-results/)) |
| Checks | search probe, [site audit](../site-audit/) and AI crawlers |

## Sign-in

- **Local:** without `CHEAPSEATS_TOKENS`, `serve` listens only on 127.0.0.1, with no sign-in.
- **Tokens:** with `CHEAPSEATS_TOKENS`, the UI asks for a token once and keeps it in a cookie. Serve it over HTTPS.
- **Your sign-in proxy:** `CHEAPSEATS_AUTH_HEADER` trusts its email header, narrowed by `CHEAPSEATS_ALLOWED_EMAILS`. exe.dev VMs use this.

[Access](../reference/#access) has the details.

## Share with stakeholders

| Audience | Use |
| --- | --- |
| Your team | sign-ins to your deployment |
| Someone without a sign-in | a [share link](../sharing/): one run, read-only, expiring and revocable |
| Anyone | a [public read-only copy](../read-only-copy/); treat its data as public |

The same data is available from the [CLI](../cli-and-ci/), the [JSON API and MCP server](../reference/).
