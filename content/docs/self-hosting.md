---
title: "Self-hosted AI visibility tracker: Docker and Kubernetes"
description: Run Popcorn, the open-source AI visibility tracker, in Docker, on your own Kubernetes cluster with the Helm chart, or on an exe.dev VM. One container, one SQLite file, and your prompts go only to the model providers you configure.
weight: 47
---

Popcorn is a self-hosted AI visibility tracker you can run in Docker or on your own Kubernetes cluster. It asks Claude and OpenAI models your buyers' questions, grades whether they recommend your brand, and lists the pages to fix. It is free and open source (MIT).

- **Docker:** one container, `ghcr.io/metcalfc/popcorn`, with its database in a single SQLite file on a `/data` volume.
- **Kubernetes:** a Helm chart, `oci://ghcr.io/metcalfc/charts/popcorn`, released at the same version as the image.
- **exe.dev:** a VM behind exe.dev's email sign-in, deployed with one script.
- **No other SaaS vendor:** prompts and answers go only to the model providers you configure. Results stay in your database.

## What it costs

Popcorn itself costs nothing. Run it on your laptop for free, or host it and pay your host. That's the whole bill for Popcorn.

Separately, the model calls are billed by their providers: Claude grades every answer through the Anthropic API (Haiku, a fraction of a cent each) and writes the fix list (Opus, a few cents a run), and API answerers are billed per token. On your own machine, answerers can use your Claude and ChatGPT subscriptions instead ([details](../getting-started/#answering-on-your-subscriptions)). A daily budget caps API spend ([Configuration](../configuration/)).

## Where your data goes

Popcorn sends prompts to the answerers you list in `popcorn.toml` and nowhere else:

- `anthropic` and `openai` answerers call those providers' APIs, which also run the web searches on the search track.
- `claude-code` and `codex` answerers run those CLIs on the same machine, which talk to Anthropic and OpenAI.
- Grading and the fix list go to the Anthropic API, or to the proxy named by `POPCORN_ANTHROPIC_BASE_URL` if you set one.

Those are the only outbound calls in Popcorn's code: there is no telemetry and no Popcorn service in the middle. Answers, grades, citations and fix lists are stored in the SQLite file on your volume, and your prompt sets live in a config repo you own. Whoever hosts the machine (your cloud, your cluster, exe.dev) is the only other party involved.

## Docker

The image serves on port 3000 and keeps its database on `/data`. It reads your config from `/config` and refuses to start without `POPCORN_TOKENS`, since it listens beyond localhost. It's built for linux/amd64 and linux/arm64.

To try it with the example config in Popcorn's repo:

```bash
git clone https://github.com/metcalfc/popcorn && cd popcorn
cp .env.example .env               # fill in ANTHROPIC_API_KEY, and POPCORN_TOKENS (openssl rand -hex 32)
docker run -p 3000:3000 \
  -v popcorn-data:/data \
  -v "$PWD/examples/popcorn-config:/config:ro" \
  --env-file .env \
  ghcr.io/metcalfc/popcorn:0.2.1
```

Open <http://localhost:3000> and enter one of your tokens. To measure your own brand, mount your config repo at `/config` instead (start one from the [config template](https://github.com/metcalfc/popcorn-config-template)). Pin an exact version; the [releases](https://github.com/metcalfc/popcorn/releases) list them.

Run one container per database: progress lives in the process, so never point two at the same volume. Back up with `popcorn backup` ([Deploying](../deploying/#backups)).

## Kubernetes with Helm

The chart runs one replica and replaces it rather than rolling, so two never share the database. It needs your deployment's image (Popcorn with your config copied to `/config`) and a Secret you create; it never takes keys as values.

```dockerfile
# Dockerfile in your config repo: one image per config commit
FROM ghcr.io/metcalfc/popcorn:0.2.1
COPY popcorn.toml /config/popcorn.toml
COPY prompt-sets /config/prompt-sets
ARG REVISION=""
ENV POPCORN_CONFIG_REV=$REVISION
```

```bash
# Build and push that image to your registry, then:
kubectl create secret generic popcorn \
  --from-literal=POPCORN_TOKENS="$(openssl rand -hex 32)" \
  --from-literal=ANTHROPIC_API_KEY="<key>"         # add OPENAI_API_KEY if an answerer uses it

helm install popcorn oci://ghcr.io/metcalfc/charts/popcorn --version 0.2.1 \
  --set image.repository=ghcr.io/acme/popcorn-config \
  --set image.tag=<config commit> \
  --set existingSecret=popcorn

kubectl port-forward svc/popcorn 3000:3000         # or set ingress.enabled and ingress.host
```

The chart creates a 1Gi volume for the database (`persistence.size`, or bring your own with `persistence.existingClaim`). The plain app image works too, with the config mounted at `/config` through `extraVolumes` and `extraVolumeMounts`. [Deploying](../deploying/#kubernetes-with-helm) lists the values; the template's [Kubernetes guide](https://github.com/metcalfc/popcorn-config-template/blob/main/deploy/README.md) adds CI that deploys every merge.

## An exe.dev VM

An [exe.dev](https://exe.dev) VM runs Popcorn as a systemd service behind exe.dev's HTTPS proxy, which signs people in by email. Because it's a whole VM, answerers can also be the `claude` and `codex` CLIs on your subscriptions.

```bash
# 1. Create the VM; https://<vm>.exe.xyz is private to people you share it with
ssh exe.dev "new --name=<vm> --comment='Popcorn'"

# 2. Write its secrets, readable only by its user
{ printf 'ANTHROPIC_API_KEY=%s\n' "<key>"
  printf 'POPCORN_AUTH_HEADER=X-ExeDev-Email\n'
  printf 'POPCORN_ALLOWED_EMAILS=%s\n' "you@example.com,@yourcompany.com"
  printf 'POPCORN_HOSTS=%s\n' "<vm>.exe.xyz"
  printf 'POPCORN_TOKENS=%s\n' "$(openssl rand -hex 32)"
} | ssh <vm>.exe.xyz 'mkdir -p ~/popcorn && umask 077 && cat > ~/popcorn/popcorn.env'

# 3. Deploy, from a checkout of Popcorn, with your config repo committed
deploy/exe-dev.sh <vm> ../your-config

# 4. Nightly backups, and email alerts for failed or stalled runs
deploy/exe-dev-ops.sh <vm> you@example.com

# 5. Share it
ssh exe.dev share add <vm> someone@example.com
```

**Keeping the Anthropic key off the VM.** Add the key as an exe.dev integration, and replace the `ANTHROPIC_API_KEY` line with `POPCORN_ANTHROPIC_BASE_URL=https://anthropic.int.exe.xyz`. Popcorn's own Anthropic calls (grading, the fix list, `anthropic` answerers) then go through that proxy, which adds the key. The `claude` CLI doesn't read this variable, so `claude-code` answerers stay on your subscription.

`deploy/exe-dev.sh` checks the config on the VM, swaps in the new binary and config, and rolls back if Popcorn doesn't come up healthy. [Deploying](../deploying/#exedev) covers logging the CLIs in, connecting Claude Code over MCP, and running it day to day.

## Which to pick

- **Trying it, or one person using it:** run it locally with `go run` ([Getting started](../getting-started/)), or the `docker run` above.
- **A team with a Docker host or a cluster:** the Helm chart, or the image on a Docker host, deployed from your config repo's CI.
- **A team that wants answers on Claude and ChatGPT subscriptions, or email sign-in without running an identity proxy:** exe.dev.
