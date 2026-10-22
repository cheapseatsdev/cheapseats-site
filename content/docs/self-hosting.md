---
title: "Self-hosted AI visibility tracker: Docker and Kubernetes"
description: Run Cheap Seats, the open-source AI visibility tracker, in Docker, on your own Kubernetes cluster with the Helm chart, or on an exe.dev VM. One container, one SQLite file, and your prompts go only to the model providers you configure.
weight: 47
---

Cheap Seats is a self-hosted AI visibility tracker you can run in Docker or on your own Kubernetes cluster. It asks Claude and OpenAI models your buyers' questions, grades whether they recommend your brand, and lists the pages to fix. It is free and open source (MIT).

- **Docker:** one container, `ghcr.io/cheapseatsdev/cheapseats`, with its database in a single SQLite file on a `/data` volume.
- **Kubernetes:** a Helm chart, `oci://ghcr.io/cheapseatsdev/charts/cheapseats`, released at the same version as the image.
- **exe.dev:** a VM behind exe.dev's email sign-in, deployed with one script.
- **No other SaaS vendor:** prompts and answers go only to the model providers you configure. Results stay in your database.

## What it costs

Cheap Seats itself costs nothing. Run it on your laptop for free, or host it and pay your host. That's the whole bill for Cheap Seats.

Separately, the models: Claude is required and ChatGPT optional. On a machine or VM with the `claude` and `codex` CLIs, answering, grading and the fix list can all run on your subscriptions, with no API key ([details](../getting-started/#running-on-your-subscriptions)). In a container, which has no CLIs, they go through the APIs and are billed per token: grading with Haiku is a fraction of a cent an answer and the fix list a few cents a run, and a daily budget caps the spend ([Cost and budget](../cost-and-budget/)).

## Where your data goes

Cheap Seats sends prompts to the answerers you list in `cheapseats.toml` and nowhere else:

- `anthropic` and `openai` answerers call those providers' APIs, which also run the web searches on the search track.
- `claude-code` and `codex` answerers run those CLIs on the same machine, which talk to Anthropic and OpenAI.
- Grading and the fix list go to the Anthropic API, or to the proxy named by `CHEAPSEATS_ANTHROPIC_BASE_URL` if you set one.

Those are the only outbound calls in Cheap Seats' code: there is no telemetry and no Cheap Seats service in the middle. Answers, grades, citations and fix lists are stored in the SQLite file on your volume, and your prompt sets live in a config repo you own. Whoever hosts the machine (your cloud, your cluster, exe.dev) is the only other party involved.

## Docker

The image serves on port 3000 and keeps its database on `/data`. It reads your config from `/config` and refuses to start without `CHEAPSEATS_TOKENS`, since it listens beyond localhost. It's built for linux/amd64 and linux/arm64.

To try it with the example config in Cheap Seats' repo:

```bash
git clone https://github.com/cheapseatsdev/cheapseats && cd cheapseats
cp .env.example .env               # fill in ANTHROPIC_API_KEY, and CHEAPSEATS_TOKENS (openssl rand -hex 32)
docker run -p 3000:3000 \
  -v cheapseats-data:/data \
  -v "$PWD/examples/cheapseats-config:/config:ro" \
  --env-file .env \
  ghcr.io/cheapseatsdev/cheapseats:0.2.5
```

Open <http://localhost:3000> and enter one of your tokens. To measure your own brand, mount your config repo at `/config` instead (start one from the [config template](https://github.com/cheapseatsdev/cheapseats-config-template)). Pin an exact version; the [releases](https://github.com/cheapseatsdev/cheapseats/releases) list them.

Run one container per database: progress lives in the process, so never point two at the same volume. Back up with `cheapseats backup` ([Deploying](../deploying/#backups)).

## Kubernetes with Helm

The chart runs one replica and replaces it rather than rolling, so two never share the database. It needs your deployment's image (Cheap Seats with your config copied to `/config`) and a Secret you create; it never takes keys as values.

```dockerfile
# Dockerfile in your config repo: one image per config commit
FROM ghcr.io/cheapseatsdev/cheapseats:0.2.5
COPY cheapseats.toml /config/cheapseats.toml
COPY prompt-sets /config/prompt-sets
ARG REVISION=""
ENV CHEAPSEATS_CONFIG_REV=$REVISION
```

```bash
# Build and push that image to your registry, then:
kubectl create secret generic cheapseats \
  --from-literal=CHEAPSEATS_TOKENS="$(openssl rand -hex 32)" \
  --from-literal=ANTHROPIC_API_KEY="<key>"         # add OPENAI_API_KEY if an answerer uses it

helm install cheapseats oci://ghcr.io/cheapseatsdev/charts/cheapseats --version 0.2.5 \
  --set image.repository=ghcr.io/acme/cheapseats-config \
  --set image.tag=<config commit> \
  --set existingSecret=cheapseats

kubectl port-forward svc/cheapseats 3000:3000         # or set ingress.enabled and ingress.host
```

The chart creates a 1Gi volume for the database (`persistence.size`, or bring your own with `persistence.existingClaim`). The plain app image works too, with the config mounted at `/config` through `extraVolumes` and `extraVolumeMounts`. [Deploying](../deploying/#kubernetes-with-helm) lists the values; the template's [Kubernetes guide](https://github.com/cheapseatsdev/cheapseats-config-template/blob/main/deploy/README.md) adds CI that deploys every merge.

## An exe.dev VM

An [exe.dev](https://exe.dev) VM runs Cheap Seats as a systemd service behind exe.dev's HTTPS proxy, which signs people in by email. Because it's a whole VM, answerers can also be the `claude` and `codex` CLIs on your subscriptions.

```bash
# 1. Create the VM; https://<vm>.exe.xyz is private to people you share it with
ssh exe.dev "new --name=<vm> --comment='Cheap Seats'"

# 2. Write its secrets, readable only by its user
{ printf 'ANTHROPIC_API_KEY=%s\n' "<key>"
  printf 'CHEAPSEATS_AUTH_HEADER=X-ExeDev-Email\n'
  printf 'CHEAPSEATS_ALLOWED_EMAILS=%s\n' "you@example.com,@yourcompany.com"
  printf 'CHEAPSEATS_HOSTS=%s\n' "<vm>.exe.xyz"
  printf 'CHEAPSEATS_TOKENS=%s\n' "$(openssl rand -hex 32)"
} | ssh <vm>.exe.xyz 'mkdir -p ~/cheapseats && umask 077 && cat > ~/cheapseats/cheapseats.env'

# 3. Deploy, from a checkout of Cheap Seats, with your config repo committed
deploy/exe-dev.sh <vm> ../your-config

# 4. Nightly backups, and email alerts for failed or stalled runs
deploy/exe-dev-ops.sh <vm> you@example.com

# 5. Share it
ssh exe.dev share add <vm> someone@example.com
```

**Keeping the Anthropic key off the VM.** Add the key as an exe.dev integration, and replace the `ANTHROPIC_API_KEY` line with `CHEAPSEATS_ANTHROPIC_BASE_URL=https://anthropic.int.exe.xyz`. Cheap Seats' own Anthropic calls (grading, the fix list, `anthropic` answerers) then go through that proxy, which adds the key. The `claude` CLI doesn't read this variable, so `claude-code` answerers stay on your subscription.

`deploy/exe-dev.sh` checks the config on the VM, swaps in the new binary and config, and rolls back if Cheap Seats doesn't come up healthy. [Deploying](../deploying/#exedev) covers logging the CLIs in, connecting Claude Code over MCP, and running it day to day.

## Which to pick

- **Trying it, or one person using it:** run it locally with `go run` ([Getting started](../getting-started/)), or the `docker run` above.
- **A team with a Docker host or a cluster:** the Helm chart, or the image on a Docker host, deployed from your config repo's CI.
- **A team that wants answers on Claude and ChatGPT subscriptions, or email sign-in without running an identity proxy:** exe.dev.
