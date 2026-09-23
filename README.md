# Assignment starter

A minimal starting point that follows the same architecture as the support
desk case study — the `app.js`/`server.js` split, a separate `worker.js`
process, and the same Docker Compose infrastructure (MySQL, Mailpit, Redis)
— but with none of the domain logic. Build your own case study (see
[ASSIGNMENT.md](./ASSIGNMENT.md)) on top of this.

Right now it does two things:

- The API exposes a single `GET /welcome` endpoint that returns `hello world`.
- The worker process starts up and logs a message, but doesn't process any
  jobs or listen for any events yet.

## Running locally (without Docker)

```bash
npm install
cp .env.example .env
npm run dev       # API on http://localhost:3000
npm run worker    # in a second terminal
```

## Running with Docker Compose

```bash
docker compose up -d --build
```

This brings up MySQL, Mailpit, Redis, the API (`http://localhost:3000`), and
the worker. This project uses the same host ports as the support desk case
study (3000, 3306, 1025, 8025, 6379) — don't run both projects' Docker
Compose stacks at the same time.

`docker-compose.override.yml` is picked up automatically alongside
`docker-compose.yml` and turns this into a live-reloading dev setup: it
bind-mounts `src/` into the `api`/`worker` containers and runs them with
`nodemon --legacy-watch` instead of the plain `node` command the image's
`CMD` uses. That means once the containers are up, editing anything under
`src/` restarts the affected process automatically — no `--build`, and no
`docker compose up` at all, needed for a code change to take effect.

You only need `--build` again when `package.json`/`package-lock.json` or the
`Dockerfile` change (e.g. you add a new dependency).

## Where to go from here

As you build out your own case study, you'll likely add (mirroring the
support desk project's structure):

- `prisma/schema.prisma` + `src/config/db.js` — your database schema and a
  shared Prisma client.
- `src/events/emitter.js` + `src/events/listeners/*` — domain events and the
  listeners that react to them (email, in-app notifications, ...).
- `src/config/mailer.js` — a Nodemailer transport pointed at Mailpit.
- `src/jobs/*` — a BullMQ queue/job pair, processed by `src/worker.js`.
- `src/routes`, `src/controllers`, `src/services`, `src/middleware/validate.js`
  — your actual resource endpoints.

See [ASSIGNMENT.md](./ASSIGNMENT.md) for the full requirements.
