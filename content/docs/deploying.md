---
title: Deploying
description: Docker, Kubernetes with the Helm chart, or an exe.dev VM.
weight: 420
group: Running it
---

Each deployment is its own config repo, made from the [config template](https://github.com/cheapseatsdev/cheapseats-config-template): it builds an image of Cheap Seats with that config inside, checks and plans every pull request, and deploys every merge to a Docker host or Kubernetes. **Start there**: the template has [guides](https://github.com/cheapseatsdev/cheapseats-config-template/blob/main/deploy/README.md) for a Docker host and for Kubernetes. A Docker-host deploy needs a `DEPLOY_HOST_KEY` secret, the host's own SSH public key, so the workflow hands the run's registry token to that host and no other; a deploy set up without one fails with a message naming it until it's added.

## What any deployment needs

- **One instance, one volume.** Run progress lives in the process and the database is SQLite on `/data`; never run two against the same data. A run takes minutes with no inbound HTTP, so keep it always on.
- **Secrets in the environment:** `CHEAPSEATS_TOKENS` (Cheap Seats refuses to listen beyond localhost without it), `ANTHROPIC_API_KEY` (grading), `OPENAI_API_KEY` for OpenAI answerers, and `TYPESAFE_API_KEY` or `EXA_API_KEY` only with `[typesafe]` or `[exa]` in the config (or their `CHEAPSEATS_*_BASE_URL` proxies; see [Optional providers](../optional-providers/)). Deployed answerers use the APIs: the image has no Claude Code or Codex CLI, and `cheapseats check` fails on a config that needs one.
- **Time to stop.** On SIGTERM Cheap Seats stops starting runs and marks the ones in progress as interrupted; on the next start it resumes them, oldest first, keeping every answer they already had. Give it 30 seconds.
- **Probes:** `GET /healthz` answers `ok` without a token.
- **Share links:** `GET /share/<token>` answers without a token, serving only that link's run ([Sharing a run](../sharing/)). Set `CHEAPSEATS_PUBLIC_URL` to the address people reach Cheap Seats at, such as `https://cheapseats.example.com`, so the links point there. Behind a proxy, without it, a link can point at the address the proxy reaches Cheap Seats on; one that would point at a loopback address gets a warning. A proxy that signs people in must let `/share/` through for links to work.

## An image per config commit

Cheap Seats ships as an image, `ghcr.io/cheapseatsdev/cheapseats:<version>`, and a Helm chart, `oci://ghcr.io/cheapseatsdev/charts/cheapseats`, released together at the same version. The image has no config in it: each deployment builds its own image on top, from its config repo:

```dockerfile
FROM ghcr.io/cheapseatsdev/cheapseats:0.3.0
COPY cheapseats.toml /config/cheapseats.toml
COPY prompt-sets /config/prompt-sets
ARG REVISION=""
ENV CHEAPSEATS_CONFIG_REV=$REVISION
```

That image is one artifact per config commit: the same thing runs on a Docker host or Kubernetes, rolling back is deploying the previous tag, and upgrading Cheap Seats is a reviewed change to the `FROM` line.

## Docker

The image serves on port 3000 with its database on a `/data` volume. It refuses to start without `CHEAPSEATS_TOKENS`, since it listens beyond localhost.

Mounting a checkout of your config repo at `/config`, read-only, works too. The image sets `CHEAPSEATS_CONFIG=/config/cheapseats.toml` and reads the prompt sets from `/config/prompt-sets`. Without the mount it exits at startup with "reading /config/cheapseats.toml". From a checkout of Cheap Seats:

```bash
docker build -t cheapseats .
docker run -p 3000:3000 \
  -v cheapseats-data:/data \
  -v "$PWD/../your-config:/config:ro" \
  --env-file .env cheapseats
```

To mount the config somewhere else, pass `-e CHEAPSEATS_CONFIG=/that/path/cheapseats.toml` too.

Cheap Seats reads the config and every prompt set once, at startup, so each deploy runs one consistent version of them; to pick up a change, update the checkout and restart. It won't start on a broken config (a set that doesn't parse, an id used twice), so a bad deploy fails loudly instead of running without part of it; `cheapseats check` catches the same problems in the config repo's CI first.

**Which config produced a run.** Each run records the config repo's commit and the Cheap Seats version. Cheap Seats takes the commit from `CHEAPSEATS_CONFIG_REV`, else a `REVISION` file beside `cheapseats.toml`, else the checkout's own `.git` (read directly; the image has no git). A deploy that copies the config without `.git` should set one of the first two.

## Kubernetes with Helm

The chart runs one replica and replaces it rather than rolling, so two never share the database. The values you set:

- `image.repository` and `image.tag`: your deployment's image (required). Deploy an exact tag, so a rollback is redeploying the previous one.
- `existingSecret`: a Secret you create holding `CHEAPSEATS_TOKENS`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` if an answerer uses it, and `TYPESAFE_API_KEY` or `EXA_API_KEY` with `[typesafe]` or `[exa]`. The chart never takes keys as values: a value named like one fails the install. `extraEnv` and `extraEnvFrom` pick single keys out of other Secrets.
- `env`: plain environment for values that aren't secrets, such as `CHEAPSEATS_CONFIG_REV` or the key-adding proxies `CHEAPSEATS_ANTHROPIC_BASE_URL`, `CHEAPSEATS_TYPESAFE_BASE_URL` and `CHEAPSEATS_EXA_BASE_URL`.
- `persistence`: the volume for the database (1Gi by default), or an `existingClaim`.
- `ingress`: off by default.

The plain app image works too, with the config mounted at `/config` by `extraVolumes` and `extraVolumeMounts`. The template's [Kubernetes guide](https://github.com/cheapseatsdev/cheapseats-config-template/blob/main/deploy/README.md) walks through it.

## Backups

`cheapseats backup <file>` takes a consistent copy of the live database (SQLite's `VACUUM INTO`). Copying `cheapseats.db` while Cheap Seats runs can miss recent writes still in its write-ahead log.

- Docker: `docker compose exec cheapseats /app/cheapseats backup /data/backup.db`, then `docker compose cp cheapseats:/data/backup.db .`
- Kubernetes: `kubectl exec deploy/cheapseats -- /app/cheapseats backup /data/backup.db`. The image has no shell or `tar`, so copy it off the volume with a pod that mounts the claim.
- exe.dev: `deploy/exe-dev-ops.sh` sets up nightly copies (below).

Cheap Seats also copies the database to `cheapseats.db.bak-v<N>` before any schema change.

## exe.dev

An [exe.dev](https://exe.dev) VM runs Cheap Seats as a systemd service behind exe.dev's HTTPS proxy, which signs people in by email. Because it's a whole VM, its answerers can be the `claude` and `codex` CLIs on subscriptions (both come installed) as well as the APIs.

**Set up once:**

1. Create the VM. Its proxy serves `https://<vm>.exe.xyz` from port 8000, where Cheap Seats listens, and is private: only people it's shared with get in, after signing in by email.

   ```bash
   ssh exe.dev "new --name=<vm> --comment='Cheap Seats'"
   ```

2. Write its secrets to `~/cheapseats/cheapseats.env` on the VM, readable only by its user. The proxy passes a signed-in person's email as `X-ExeDev-Email`, and nothing reaches the VM except through the proxy, so Cheap Seats trusts that header; `CHEAPSEATS_ALLOWED_EMAILS` narrows it further (emails, or `@domain`). `CHEAPSEATS_HOSTS` names the host the proxy serves it as, which MCP needs (see step 7).

   ```bash
   { printf 'ANTHROPIC_API_KEY=%s\n' "<key>"
     printf 'CHEAPSEATS_AUTH_HEADER=X-ExeDev-Email\n'
     printf 'CHEAPSEATS_ALLOWED_EMAILS=%s\n' "you@example.com,@yourcompany.com"
     printf 'CHEAPSEATS_HOSTS=%s\n' "<vm>.exe.xyz"   # and a custom domain, comma-separated
     printf 'CHEAPSEATS_TOKENS=%s\n' "$(openssl rand -hex 32)"
   } | ssh <vm>.exe.xyz 'mkdir -p ~/cheapseats && umask 077 && cat > ~/cheapseats/cheapseats.env'
   ```

   Add `OPENAI_API_KEY` if an answerer uses `provider = "openai"`.

   To keep the Anthropic key off the VM, add it as an exe.dev integration instead, and replace the `ANTHROPIC_API_KEY` line with `CHEAPSEATS_ANTHROPIC_BASE_URL=https://anthropic.int.exe.xyz`. Cheap Seats' own API calls (grading, the fix list, `anthropic` answerers) then go through that proxy, which adds the key. The `claude` CLI doesn't read this variable, so `claude-code` answerers stay on your subscription.

3. Deploy (below), with `SEED_DB=path/to/cheapseats.db` the first time to start from an existing database. The deploy also makes a `cheapseats-cli` user for the `claude` and `codex` CLIs to run as: each is an agent with tools the model drives, and this keeps the VM's env file, database and logins out of a prompt-injected answer's reach whatever a CLI update adds (see [CLI answerers](../reference/#cli-answerers)).

4. Log the CLIs in as that user, if your answerers use them. The subscription is whoever logs in. (Logins made before the CLI user existed move over on the first deploy.)

   ```bash
   ssh -t <vm>.exe.xyz sudo -H -u cheapseats-cli claude                      # /login, then /exit
   ssh -t <vm>.exe.xyz sudo -H -u cheapseats-cli codex login --device-auth
   ```

5. Backups and alerts: a nightly copy of the database (the newest 14 kept, in `~/cheapseats/backups`), and an hourly check that emails when a run ends partial, failed or out of budget, a fix list fails, or a run stalls. The address must be one exe.dev lets the VM write to: its owner, a teammate, or someone who has signed in to it.

   ```bash
   deploy/exe-dev-ops.sh <vm> you@example.com
   ```

6. Share it with whoever should see it (web access only; they sign in with that email, and get an invitation if they're new to exe.dev):

   ```bash
   ssh exe.dev share add <vm> someone@example.com
   ```

   [Share links](../sharing/) use `CHEAPSEATS_HOSTS` (over https) unless `CHEAPSEATS_PUBLIC_URL` is set. While the VM is private, its proxy asks everyone to sign in, so a share link opens only for people the VM is shared with.

7. Connect Claude Code (or any MCP client). The proxy only lets in people who signed in by email, so a client gets through with an exe.dev token scoped to the VM, sent as `X-Exedev-Authorization`; the proxy then passes your email, and Cheap Seats signs you in as usual.

   ```bash
   tok=$(ssh exe.dev ssh-key generate-api-key --vm=<vm> --label=claude-code --exp=90d --json |
     python3 -c 'import json,sys; print(json.load(sys.stdin)["token"])')
   claude mcp add -s user --transport http cheapseats https://<vm>.exe.xyz/api/mcp \
     --header "X-Exedev-Authorization: Bearer $tok"
   unset tok
   ```

   Revoke it with `ssh exe.dev ssh-key remove claude-code`. Without `CHEAPSEATS_HOSTS`, MCP answers `403 invalid Host header`: the proxy reaches Cheap Seats over loopback, and Cheap Seats refuses a loopback request under a name it wasn't told about, against DNS rebinding.

**Every deploy**, from a checkout of Cheap Seats, with your config repo committed:

```bash
deploy/exe-dev.sh <vm> ../your-config
```

It builds a Linux binary, ships the config as committed (recording its commit on every run), runs `cheapseats check` on the VM, swaps both in, restarts, and rolls back to the previous binary and config if Cheap Seats doesn't come up healthy. Runs in progress resume after the restart.

**Running it:**

| | |
|---|---|
| log | `ssh <vm>.exe.xyz sudo journalctl -u cheapseats -f` |
| restart | `ssh <vm>.exe.xyz sudo systemctl restart cheapseats` |
| secrets | `~/cheapseats/cheapseats.env` on the VM; restart after changing it |
| database | `~/cheapseats/data`, with `cheapseats.db.bak-v<N>` copies from before schema changes |
| backups | `~/cheapseats/backups`, nightly at 08:00 UTC; they undo mistakes, not the loss of the VM |
| alerts | `deploy/exe-dev-ops.sh <vm> <email>` again to change who gets them |
| who's in | `ssh exe.dev share show <vm>`, and `CHEAPSEATS_ALLOWED_EMAILS` |

To roll back by hand: stop Cheap Seats, put `bin/cheapseats.prev` and `config.prev` back as `bin/cheapseats` and `config`, and start it. A database from a newer Cheap Seats won't open in an older one; restore the `cheapseats.db.bak-v<N>` from before the upgrade too.
