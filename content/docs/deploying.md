---
title: Deploying
description: Docker, Kubernetes with the Helm chart, or an exe.dev VM.
weight: 50
---

Each deployment is its own config repo, made from the [config template](https://github.com/metcalfc/popcorn-config-template): it builds an image of Popcorn with that config inside, checks and plans every pull request, and deploys every merge to a Docker host or Kubernetes. **Start there**: the template has [guides](https://github.com/metcalfc/popcorn-config-template/blob/main/deploy/README.md) for a Docker host and for Kubernetes.

## What any deployment needs

- **One instance, one volume.** Run progress lives in the process and the database is SQLite on `/data`; never run two against the same data. A run takes minutes with no inbound HTTP, so keep it always on.
- **Secrets in the environment:** `POPCORN_TOKENS` (Popcorn refuses to listen beyond localhost without it), `ANTHROPIC_API_KEY` (grading), `OPENAI_API_KEY` for OpenAI answerers. Deployed answerers use the APIs: the image has no Claude Code or Codex CLI, and `popcorn check` fails on a config that needs one.
- **Time to stop.** On SIGTERM Popcorn stops starting runs and marks the ones in progress as interrupted; on the next start it resumes them, oldest first, keeping every answer they already had. Give it 30 seconds.
- **Probes:** `GET /healthz` answers `ok` without a token.

## An image per config commit

Popcorn ships as an image, `ghcr.io/metcalfc/popcorn:<version>`, and a Helm chart, `oci://ghcr.io/metcalfc/charts/popcorn`, released together at the same version. The image has no config in it: each deployment builds its own image on top, from its config repo:

```dockerfile
FROM ghcr.io/metcalfc/popcorn:0.1.0
COPY popcorn.toml /config/popcorn.toml
COPY prompt-sets /config/prompt-sets
ARG REVISION=""
ENV POPCORN_CONFIG_REV=$REVISION
```

That image is one artifact per config commit: the same thing runs on a Docker host or Kubernetes, rolling back is deploying the previous tag, and upgrading Popcorn is a reviewed change to the `FROM` line.

## Docker

The image serves on port 3000 with its database on a `/data` volume. It refuses to start without `POPCORN_TOKENS`, since it listens beyond localhost.

Mounting a checkout of your config repo at `/config`, read-only, works too. The image sets `POPCORN_CONFIG=/config/popcorn.toml` and reads the prompt sets from `/config/prompt-sets`. Without the mount it exits at startup with "reading /config/popcorn.toml". From a checkout of Popcorn:

```bash
docker build -t popcorn .
docker run -p 3000:3000 \
  -v popcorn-data:/data \
  -v "$PWD/../your-config:/config:ro" \
  --env-file .env popcorn
```

To mount the config somewhere else, pass `-e POPCORN_CONFIG=/that/path/popcorn.toml` too.

Popcorn reads the config and every prompt set once, at startup, so each deploy runs one consistent version of them; to pick up a change, update the checkout and restart. It won't start on a broken config (a set that doesn't parse, an id used twice), so a bad deploy fails loudly instead of running without part of it; `popcorn check` catches the same problems in the config repo's CI first.

**Which config produced a run.** Each run records the config repo's commit and the Popcorn version. Popcorn takes the commit from `POPCORN_CONFIG_REV`, else a `REVISION` file beside `popcorn.toml`, else the checkout's own `.git` (read directly; the image has no git). A deploy that copies the config without `.git` should set one of the first two.

## Kubernetes with Helm

The chart runs one replica and replaces it rather than rolling, so two never share the database. The values you set:

- `image.repository` and `image.tag`: your deployment's image (required). Deploy an exact tag, so a rollback is redeploying the previous one.
- `existingSecret`: a Secret you create holding `POPCORN_TOKENS`, `ANTHROPIC_API_KEY`, and `OPENAI_API_KEY` if an answerer uses it. The chart never takes keys as values.
- `persistence`: the volume for the database (1Gi by default), or an `existingClaim`.
- `ingress`: off by default.

The plain app image works too, with the config mounted at `/config` by `extraVolumes` and `extraVolumeMounts`. The template's [Kubernetes guide](https://github.com/metcalfc/popcorn-config-template/blob/main/deploy/README.md) walks through it.

## exe.dev

An [exe.dev](https://exe.dev) VM runs Popcorn as a systemd service behind exe.dev's HTTPS proxy, which signs people in by email. Because it's a whole VM, its answerers can be the `claude` and `codex` CLIs on subscriptions (both come installed) as well as the APIs.

**Set up once:**

1. Create the VM. Its proxy serves `https://<vm>.exe.xyz` from port 8000, where Popcorn listens, and is private: only people it's shared with get in, after signing in by email.

   ```bash
   ssh exe.dev "new --name=<vm> --comment='Popcorn'"
   ```

2. Write its secrets to `~/popcorn/popcorn.env` on the VM, readable only by its user. The proxy passes a signed-in person's email as `X-ExeDev-Email`, and nothing reaches the VM except through the proxy, so Popcorn trusts that header; `POPCORN_ALLOWED_EMAILS` narrows it further (emails, or `@domain`). The token is for API and MCP clients, which can't sign in by email.

   ```bash
   { printf 'ANTHROPIC_API_KEY=%s\n' "<key>"
     printf 'POPCORN_AUTH_HEADER=X-ExeDev-Email\n'
     printf 'POPCORN_ALLOWED_EMAILS=%s\n' "you@example.com,@yourcompany.com"
     printf 'POPCORN_TOKENS=%s\n' "$(openssl rand -hex 32)"
   } | ssh <vm>.exe.xyz 'mkdir -p ~/popcorn && umask 077 && cat > ~/popcorn/popcorn.env'
   ```

   Add `OPENAI_API_KEY` if an answerer uses `provider = "openai"`.

3. Log the CLIs in, if your answerers use them. The subscription is whoever logs in.

   ```bash
   ssh -t <vm>.exe.xyz claude                        # /login, then /exit
   ssh -t <vm>.exe.xyz codex login --device-auth
   ```

4. Deploy (below), with `SEED_DB=path/to/popcorn.db` the first time to start from an existing database.

5. Backups and alerts: a nightly copy of the database (the newest 14 kept, in `~/popcorn/backups`), and an hourly check that emails when a run ends partial, failed or out of budget, a fix list fails, or a run stalls. The address must be one exe.dev lets the VM write to: its owner, a teammate, or someone who has signed in to it.

   ```bash
   deploy/exe-dev-ops.sh <vm> you@example.com
   ```

6. Share it with whoever should see it (web access only; they sign in with that email, and get an invitation if they're new to exe.dev):

   ```bash
   ssh exe.dev share add <vm> someone@example.com
   ```

**Every deploy**, from a checkout of Popcorn, with your config repo committed:

```bash
deploy/exe-dev.sh <vm> ../your-config
```

It builds a Linux binary, ships the config as committed (recording its commit on every run), runs `popcorn check` on the VM, swaps both in, restarts, and rolls back to the previous binary and config if Popcorn doesn't come up healthy. Runs in progress resume after the restart.

**Running it:**

| | |
|---|---|
| log | `ssh <vm>.exe.xyz sudo journalctl -u popcorn -f` |
| restart | `ssh <vm>.exe.xyz sudo systemctl restart popcorn` |
| secrets | `~/popcorn/popcorn.env` on the VM; restart after changing it |
| database | `~/popcorn/data`, with `popcorn.db.bak-v<N>` copies from before schema changes |
| backups | `~/popcorn/backups`, nightly at 08:00 UTC; they undo mistakes, not the loss of the VM |
| alerts | `deploy/exe-dev-ops.sh <vm> <email>` again to change who gets them |
| who's in | `ssh exe.dev share show <vm>`, and `POPCORN_ALLOWED_EMAILS` |

To roll back by hand: stop Popcorn, put `bin/popcorn.prev` and `config.prev` back as `bin/popcorn` and `config`, and start it. A database from a newer Popcorn won't open in an older one; restore the `popcorn.db.bak-v<N>` from before the upgrade too.
