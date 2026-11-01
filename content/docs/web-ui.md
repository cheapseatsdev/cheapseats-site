---
title: The web UI
description: Every deployment serves a dashboard for your team, with sign-in, read-only share links and a public read-only copy.
weight: 205
group: Reading what it finds
---

**Is there a dashboard?** Yes. Every Cheap Seats deployment serves one. There is no Cheap Seats-hosted service: your team signs in to your deployment. [demo.cheapseats.dev](https://demo.cheapseats.dev/) is a read-only copy of one.

{{< screenshot name="web-ui-dashboard" format="jpg" width="928" height="300" mobilename="web-ui-dashboard-mobile" mobilewidth="480" mobileheight="400" alt="The dashboard's prompt-set performance table sorted by search recommended rate, with the head-to-head set first." caption="Two rows from the [demo dashboard](https://demo.cheapseats.dev/), sorted by search recommended rate, on 26 October 2026." >}}

## Pages

| Page | Shows |
| --- | --- |
| Dashboard | each prompt set's latest rates, share-of-voice rank and run |
| Next steps | verified actions, bounded investigations and market findings; actions retain work-status, priority, site, gap and set filters |
| Rankings | each set's named, recommended or top-pick rate by day, with method changes and fixes marked |
| Run | one run's rates, answers, grades, searches and fixes ([Reading results](../reading-results/)) |
| Checks | search probe, [site audit](../site-audit/) and AI crawlers |

The [Evaluation preview](../evaluation/) (0.7.0 and later) adds **Checks → Evaluation**
for reviewing saved answers, batch-checking judgments and comparing grader prompts.
It is off by default: set `CHEAPSEATS_EVALUATION=1`. Read-only mode turns it off,
so the public demo does not show it.

## Sign-in

Cheap Seats has no built-in user accounts or per-user roles. Everyone who signs in has the same access to the deployment. If you need user management built into the product, consider a [hosted SaaS option](/compare/).

- **Local:** by default, `serve` listens on 127.0.0.1 with no sign-in.
- **Tokens:** with `CHEAPSEATS_TOKENS`, the UI asks for a token once and keeps it in a cookie. Serve it over HTTPS.
- **Your sign-in proxy:** `CHEAPSEATS_AUTH_HEADER` trusts its email header, narrowed by `CHEAPSEATS_ALLOWED_EMAILS`. exe.dev VMs use this.

[Access](../reference/#access) has the details.

## Share with stakeholders

| Audience | Use |
| --- | --- |
| Your team | tokens or your sign-in proxy |
| Someone without a sign-in | a [share link](../sharing/): one run, read-only, expiring and revocable |
| Anyone | a [public read-only copy](../read-only-copy/); treat its data as public |

The same data is available from the [CLI](../cli-and-ci/), the [JSON API and MCP server](../reference/).
