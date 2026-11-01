---
title: "Self-hosted AI visibility tracker: Docker and Kubernetes"
description: Choose Docker, Kubernetes or a VM, try the container locally, and understand where your data goes.
weight: 410
group: Running it
---

Cheap Seats is free, open-source software (MIT). Run one instance with one SQLite database:

| Platform | Best fit |
| --- | --- |
| [Go with subscriptions](../getting-started/#go-with-subscriptions) | Local use with a logged-in `claude` CLI; `codex` is optional |
| [Docker with API keys](../getting-started/#docker-with-api-keys) | The quickest local setup with an Anthropic API key; no Go or CLI installation |
| Docker host or Kubernetes with Helm | A team with existing infrastructure and API keys |
| [exe.dev](https://exe.dev) VM | Subscription CLIs or email sign-in without running an identity proxy |

[Deploying](../deploying/) covers production setup, backups and operations.

## What it costs

Pay your host and the providers you use. On a machine or VM with a logged-in `claude` CLI, answering, grading and fixes can use your Claude subscription; `codex` adds OpenAI answers on a ChatGPT subscription. These calls incur no API spend and share your plan's allowance. The Docker image has neither CLI and uses paid APIs instead.

Set a [daily admission budget](../cost-and-budget/#the-daily-budget), and provider-side spending limits: reservations are checked before calls, but actual costs can exceed them.

## Where your data goes

- **Answers:** the Anthropic/OpenAI APIs, or their logged-in local CLIs, including provider web tools on the search track.
- **Grades and fixes:** Anthropic's API (direct or through your configured proxy), or the `claude` CLI when those roles use `claude-code`.
- **Optional analysis:** Jev receives selected names, phrases, answers, page metadata, fixes and prompts; Exa receives searches and page-read requests when enabled. See [Optional providers](../optional-providers/).
- **Site checks:** HTTP requests go to audited sites, cited pages and discovered website metadata.

Cheap Seats has no telemetry or service in the middle. Answers, grades, citations and fixes stay in your SQLite file; prompt sets stay in your config repo. Your host and the configured providers still handle the data sent to them. Keep private material out of prompts and public brand facts; [Data and privacy](../reference/#data-and-privacy) gives the details.

## Docker

The image serves on port 3000 and keeps its database on `/data`. It reads your config from `/config` and refuses to start without `CHEAPSEATS_TOKENS`, since it listens beyond localhost. It's built for linux/amd64 and linux/arm64.

For a first run, follow [Docker with API keys](../getting-started/#docker-with-api-keys): it uses the prebuilt `ghcr.io/cheapseatsdev/cheapseats:0.7.2` image with the config template, an Anthropic API key and a sign-in token. An OpenAI API key is optional. No app checkout, Go installation or image build is needed.

Keep the published port on `127.0.0.1` for local access. To serve it further, put a TLS-terminating proxy in front rather than publishing the port, since every request carries an access token. To measure your own brand, edit the config template and mount it at `/config`. Pin an exact version; the [releases](https://github.com/cheapseatsdev/cheapseats/releases) list them.

Run one container per database: progress lives in the process, so never point two at the same volume. Back up with `cheapseats backup` ([Deploying](../deploying/#backups)).

## Kubernetes with Helm

Use the versioned chart `oci://ghcr.io/cheapseatsdev/charts/cheapseats`. It runs one replica with replacement updates so two instances never share the database. Build an image containing your config, supply secrets separately, and use TLS for ingress.

Follow [Kubernetes deployment](../deploying/#kubernetes-with-helm) for commands, storage and chart values.

## An exe.dev VM

An [exe.dev](https://exe.dev) VM runs Cheap Seats as a systemd service behind HTTPS and email sign-in. It can use API providers or the subscription CLIs. The deploy script checks the config, swaps binary and config, and rolls back if health checks fail.

Follow [exe.dev deployment](../deploying/#exedev) for setup, isolated CLI logins, backups and access.

## Which to pick

Start with [Go for subscriptions](../getting-started/#go-with-subscriptions) or [Docker for API keys](../getting-started/#docker-with-api-keys). For an always-on instance, [deploy from your config repo](../deploying/).
