---
title: A public read-only copy
description: "Show your Cheap Seats dashboard to anyone, without sign-ins or credentials: a read-only copy on its own machine, refreshed from your deployment, rate-limited."
weight: 340
group: Acting on it
---

A read-only copy shows your dashboard to anyone: prospects, a team without accounts, the public. It serves every page and the JSON API from a copy of your database, and it can't change anything or call a model. [demo.cheapseats.dev](https://demo.cheapseats.dev) is one, a copy of Cheap Seats measuring itself.

Run it on a separate machine that holds no API keys, no tokens and nothing that can reach your deployment. Your deployment sends the copy a fresh database on a schedule, never the other way round. Someone who breaks into the copy gets only what it already shows.

## What read-only means

Set `CHEAPSEATS_READONLY=1` and `cheapseats serve`:

- serves pages and the JSON API (GET and HEAD) to anyone, with no sign-in;
- answers 403 to every other request, so no runs, re-grades, audits, fix marks, share links or sign-ins;
- refuses MCP, whose tools include changes;
- hides the controls that would make a change, and shows a banner saying it's a read-only copy;
- doesn't resume or schedule runs, so it needs no API keys or CLIs;
- may listen beyond localhost without `CHEAPSEATS_TOKENS`.

Share links (`/share/<token>`) from your deployment work on the copy too, until the next refresh after you revoke one.

## Run one

On the copy's machine, with the same Cheap Seats binary, your config checkout and a copy of your database:

```bash
CHEAPSEATS_READONLY=1 \
CHEAPSEATS_CONFIG=/srv/demo/config/cheapseats.toml \
CHEAPSEATS_DATA_DIR=/srv/demo/data \
CHEAPSEATS_PUBLIC_URL=https://demo.example.com \
cheapseats serve -addr 127.0.0.1:3000
```

Use the same version as your deployment. A newer binary would upgrade the copy's database (harmless: the next refresh replaces it); an older one refuses a newer database. Sending the binary with each refresh keeps them in step.

## Keep it current

From your deployment, on a schedule (hourly is plenty):

1. Take a consistent copy of the database while Cheap Seats runs: `sqlite3 data/cheapseats.db ".backup '/tmp/cheapseats.db'"`, or `cheapseats backup /tmp/cheapseats.db`.
2. Send it, the binary and the config to the copy's machine.
3. There, stop the read-only service, swap the files in, and start it again. A restart takes a second or two.

Give your deployment a key that reaches only the copy's machine, so the arrangement stays one-way. On [exe.dev](../deploying/#exedev), a VM-scoped SSH key does exactly that: make one on your deployment's VM and register it for the copy's VM only.

```bash
# on your deployment's VM
ssh-keygen -t ed25519 -N "" -C demo-sync -f ~/cheapseats/demo-key
# on your machine, with the public key it printed
ssh exe.dev "ssh-key add --vm=<copy-vm> 'ssh-ed25519 AAAA… demo-sync'"
```

A sync then pipes a tarball to a small script on the copy that swaps the files and restarts the service:

```bash
work=$(mktemp -d)
cp ~/cheapseats/bin/cheapseats "$work/" && cp -R ~/cheapseats/config "$work/config"
sqlite3 ~/cheapseats/data/cheapseats.db ".backup '$work/cheapseats.db'"
tar -C "$work" -cf - cheapseats config cheapseats.db |
  ssh -i ~/cheapseats/demo-key -o IdentitiesOnly=yes <copy-vm>.exe.xyz demo/bin/receive
rm -rf "$work"
```

Run it from a systemd timer or cron on your deployment. Make the copy's exe.dev proxy public (`ssh exe.dev "share set-public <copy-vm>"`), and add your domain to it as for any [custom domain](../deploying/#exedev).

## Rate-limit it

The copy is public, and every dashboard page is database work, so put a per-visitor rate limit in front. Caddy does it with the [caddy-ratelimit](https://github.com/mholt/caddy-ratelimit) plugin, built in with `xcaddy build --with github.com/mholt/caddy-ratelimit`:

```caddyfile
{
	servers {
		# A proxy on this machine (exe.dev's, here) adds the visitor's address;
		# read X-Forwarded-For right to left so a visitor can't forge it.
		trusted_proxies static 127.0.0.1/32 ::1/128
		trusted_proxies_strict
		client_ip_headers X-Forwarded-For
	}
	order rate_limit before basic_auth
}

http://demo.example.com:8000 {
	rate_limit {
		zone demo {
			key {client_ip}
			events 60
			window 1m
		}
	}
	reverse_proxy 127.0.0.1:3000
}
```

Each visitor gets 60 requests a minute; past that they get 429 for the rest of the minute. Key the limit on the visitor's address, not the connection's: behind a proxy every connection comes from the proxy, and one busy visitor would lock everyone out. Check what your proxy sends before trusting it.

A per-visitor limit stops one client from hogging the copy. It doesn't stop a flood from many addresses; that's for your host or a CDN.

## AI crawler logs, too

If the copy's machine also serves your site, its access log is where AI crawlers show up. Pull the log in the same sync, before the database copy, and import it on your deployment, so the AI crawlers page fills on both:

```bash
ssh -i ~/cheapseats/demo-key -o IdentitiesOnly=yes <copy-vm>.exe.xyz 'cat /var/log/caddy/site.log' |
  head -c 100000000 >"$work/site.log"
cheapseats crawl import "$work/site.log"
```

The public copy is the less trusted machine, so take one file's bytes into a name you chose, capped at 100 MB, rather than unpacking an archive whose paths and size it decides.

[Importing on a schedule](../site-audit/#on-a-schedule) has more.
