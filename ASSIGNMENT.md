# Assignment: REST API Case Study

## Overview

Design and build a REST API for a case study **of your own choosing**, following the same architectural patterns you learned in the Support Desk case study (ticket creation, comments, assignment, SLA escalation). Your case study must model a different domain — do not simply reskin the support desk (e.g. renaming "ticket" to "issue"). Pick a domain you understand well enough to design realistic entities, relationships, and workflows for.

Some starting ideas (pick one, adapt one, or propose your own):

- Gym / fitness studio class booking system
- Library book lending and reservations
- Hotel or venue room booking system
- Restaurant table reservation and ordering system
- Car / equipment rental system
- Hospital or clinic appointment scheduling
- Online course enrolment and assignment submission
- Event ticketing and seating system
- Vehicle service / garage job tracking system
- Landlord/tenant maintenance request system

Whatever you choose, it must be rich enough to naturally require **both** a one-to-many and a many-to-many relationship, and a workflow with meaningful state changes (e.g. booking made → confirmed → cancelled) worth notifying people about.

## Minimum requirements

Your API must include, at minimum:

### 1. Database design

- At least one **1:M** relationship (e.g. a customer has many bookings).
- At least one **M:N** relationship, modelled **explicitly as its own table/model** (not Prisma's implicit shorthand), so its join table can carry its own data if needed — following the `TicketTag` (plain join) and `TicketWatcher` (join table with its own `notifyOnComment` column) pattern from the support desk schema.
- A short ERD (diagram or Prisma schema is fine) explaining your entities and relationships in your README.

### 2. Sending emails and notifications

Demonstrate the same multi-channel notification pattern used in the support desk case study:

- **Email** — via Nodemailer, sent to a local dev inbox (Mailpit or similar), not a real mail provider.
- **In-app notifications** — persisted to a `Notification` table so a user can retrieve their notification history via the API.
- Realtime push (e.g. Socket.io) is optional but encouraged if your case study has an obvious "live update" moment.

You need at least **two distinct workflow moments** that trigger a notification (e.g. "booking confirmed" and "booking cancelled"), each going out on at least two channels (email + in-app).

### 3. Background jobs

At least one notification-sending path must run through a **background job queue** (e.g. BullMQ + Redis), not be sent synchronously inside the request/response cycle. This should run in a **separate worker process** from your API process, the same way `src/worker.js` is separate from `src/server.js` in the support desk project.

This could be:
- A scheduled/repeatable job (like the SLA scan) that scans for something time-based (e.g. "booking starts in 24 hours" reminder, "membership expiring soon", "book overdue").
- Or a queued job triggered by a request (e.g. "send confirmation email" is queued rather than sent inline), if a scheduled job doesn't suit your domain — but you must justify this choice in your README.

### 4. Events driving notifications

Use a **domain events** pattern — services emit events after a state change actually happens, and independent listeners react to trigger notifications — the same separation of concerns as `events/emitter.js` and `events/listeners/*` in the support desk project:

- A service performs its state change and calls `.emit()` on a shared event bus.
- One or more listeners subscribe to that event and are responsible for sending email/in-app notifications.
- Services must **not** call the mailer or notification code directly — that coupling defeats the point of the pattern and will be marked down.

## Suggested tech stack

You may reuse the support desk stack directly, or substitute equivalent tools if you have a good reason (state it in your README):

| Concern | Support desk case study |
|---|---|
| Runtime / framework | Node.js + Express |
| Database / ORM | MySQL + Prisma |
| Auth | JWT, bcrypt password hashing |
| Validation | Zod |
| Domain events | Node's built-in `EventEmitter` |
| Background jobs | BullMQ + Redis |
| Email | Nodemailer + Mailpit (dev SMTP inbox) |
| Realtime (optional) | Socket.io |
| Tests | Jest + Supertest |
| Infra | Docker Compose (db, redis, mailpit, api, worker) |

## Functional requirements

- User authentication (register/login) with at least two roles (e.g. customer/staff, member/admin) and route-level authorisation.
- Full CRUD (as appropriate to your domain) on your core resource(s), with input validation and proper HTTP status codes/error handling.
- At least two domain events, each with at least one listener that sends a notification.
- At least one background job, run in a separate worker process, backed by a real queue (not a bare `setInterval`/`node-cron` timer — justify the choice of a real queue in your README, as PLAN.md does for the support desk project).
- Endpoints to retrieve a user's own in-app notifications.

## Deliverables

1. **Source code** in a Git repository (or zip if Git isn't available to you), with sensible commit history.
2. **README.md** covering:
   - Your chosen domain and why you chose it.
   - ERD / schema explanation, calling out your 1:M and M:N relationships.
   - Which events exist, what triggers them, and what each listener does.
   - Which notification path is backed by a background job, and why.
   - How to run the project locally (env vars, `docker compose up`, migrations/seed, how to start the API and the worker separately).
   - How to view sent emails (e.g. Mailpit URL).
3. **`.env.example`** with all required environment variables documented.
4. **`docker-compose.yml`** bringing up your database, Redis, Mailpit, API, and worker.
5. A short **API reference** (Postman/Insomnia collection, or a table of endpoints in the README) sufficient for a marker to exercise every requirement above.
6. Automated tests (Jest + Supertest or equivalent) covering at least your core CRUD endpoints and one event-triggered notification path.

## Sequence of steps

There's no week-by-week schedule here — work through these steps in order, at whatever pace suits you. Some of you will get through all of them well before the deadline; others may not reach the last one or two, and that's reflected in the marking scheme below rather than being a reason to panic. What matters is that each step actually works before you move on to the next one, not that you reach a particular step by a particular date.

A `student/` starter is provided with the `app.js`/`server.js` split, middleware stack, and Docker Compose infrastructure already in place — step 1 below assumes you're extending that, not starting from a blank folder.

1. **Foundations & REST basics.** Pick your case study domain and write a short paragraph describing its core workflow (who does what, and what changes state — e.g. "a member books a class, a class fills up, a booking gets cancelled"). Sketch your entities and relationships on paper or in a diagram tool — don't write Prisma yet, just identify where your 1:M and M:N relationships will be. Add your first resource's routes (`express.Router()`), controller, and a plain-function service backed by an **in-memory array** — deliberately no database yet, so you can focus on how Express works before worrying about persistence. Reuse the starter's `notFound`/`errorHandler`/`asyncHandler` middleware and `utils/response.js` envelope for your new routes.
   - *Working state:* `GET`/`POST` working against an in-memory store for your core resource, following the starter's existing conventions.

2. **Data modelling & persistence.** Write your full Prisma schema: every entity, your 1:M relationship(s), and your M:N relationship modelled **explicitly** as its own model (not Prisma's implicit shorthand) — see the [Database design](#1-database-design) requirement above. Add MySQL (or your chosen database) to `docker-compose.yml`, matching the pattern already in this project's compose file. Write migrations and a seed script with realistic sample data. Swap your in-memory service from step 1 for one backed by Prisma.
   - *Working state:* schema + seeded dev database; your core resource's endpoints now backed by Prisma instead of an array.

3. **Full CRUD REST API.** Build out full CRUD across your core resources (controllers/services as plain functions, not classes). Add Zod validation middleware for request bodies/params, following the same `{ error: { message, details? } }` shape as the starter's `errorHandler.js`. Add nested routes where they make sense for your domain (e.g. reviews under a booking, comments under a ticket). Add filtering/sorting/pagination to at least one list endpoint. Start your Jest unit test suite now, against services/validators — not at the end — and add to it as you go, so it grows alongside the build rather than being written in a rush right before submission.
   - *Working state:* full CRUD across your core resources; a growing unit test suite; a short note in your README describing your API conventions (response shape, error shape, status codes used).

4. **Auth & authorization.** JWT auth with bcrypt password hashing; register/login endpoints. Role-based middleware for at least two roles, with visibility/permissions that actually differ (e.g. a customer only sees their own bookings; staff see everything or a queue). Scope your existing queries by `req.user` where appropriate.
   - *Working state:* protected routes; role-scoped queries; tests covering both an authorised and an unauthorised/forbidden case.

5. **Event-driven architecture & notifications.** Build a domain events bus with Node's built-in `EventEmitter` (`events/emitter.js` + `events/listeners/*`, mirroring the support desk project). Identify at least two moments in your workflow worth notifying someone about (e.g. "booking confirmed", "booking cancelled") and `.emit()` an event right after each state change actually happens — never before. Write listeners that persist a `Notification` row (in-app) and send an email via Nodemailer against a local Mailpit container. Realtime push via Socket.io is optional here, but a natural fit if your domain has an obvious "live update" moment (e.g. a seat map, a live queue position). Double-check no service or controller calls the mailer or notification code directly — everything must go through `.emit()`.
   - *Working state:* creating/updating your core resource fires events that produce both an in-app notification and an email, fully decoupled from the code that triggered them.

6. **Background jobs, hardening & testing.** Add a BullMQ queue backed by Redis, and move **at least one** of your notification paths from step 5 onto it — either a repeatable scheduled job (like the SLA scan) that scans for something time-based, or a job queued at request time instead of sent inline. Write the worker logic in a separate module and run it via a dedicated `worker` process (`src/worker.js`), never imported by `app.js`/`server.js` — same split as the starter. Add security/logging hardening: `helmet`, `cors`, `express-rate-limit`, request logging. Add endpoint/integration tests with Jest + Supertest against your exported `app` (not a running server), covering auth, core CRUD flows, and your background job's effect. Containerize properly: a production-style multi-stage `Dockerfile` (non-root user, `NODE_ENV=production`), and `api`/`worker` services in `docker-compose.yml` built from that same image, mirroring the starter's setup.
   - *Working state:* a background job running against a real queue, a unit + endpoint test suite, a production-style Docker setup, and a project ready to submit.

If you run out of time before reaching step 5 or 6, submit what you have working rather than something further along but broken — a smaller project that genuinely works is worth more than a larger one that doesn't. See the marking scheme below for how partial completion is credited.

## Use of AI tools

You may use an AI coding assistant to help you **debug** — understanding an error message, narrowing down why something isn't working, checking your understanding of an approach. You should not use one to **write your code for you**. The reason isn't a rule for its own sake: if an agent writes it, you don't learn it, and this assignment exists so you learn this architecture, not so a working API exists.

Because that line isn't visible from the code you submit, this is assessed directly, not policed by inspecting your files — see [Oral code defense](#oral-code-defense) below.

## Oral code defense

After submission, you'll each do a short (10–15 minute), individual, unscripted session with a marker, with no notes, no IDE AI assistance, and no code in front of you except your own project. It has three parts:

1. **Walkthrough.** You'll trace one full workflow through your own code, cold — e.g. "walk me through what happens, from the HTTP request to the email being sent, when a booking is cancelled." You name each piece involved (route → controller → service → event → listener → job) and what it does.
2. **Why questions.** Targeted at decisions that only make sense if you understand the trade-off, not just the syntax — e.g. "why is this relationship modelled as its own join table instead of Prisma's implicit many-to-many?", "why does the service emit an event instead of calling the mailer directly?", "what happens to the other listeners if the email one throws?"
3. **Live micro-task.** You'll make one small, unseen change to your own code on the spot — add a field, fix a seeded bug, add a validation rule — with no AI assistance, in front of the marker.

This isn't designed to catch you out — if you built this yourself (with an AI assistant helping you debug along the way, as permitted above), all three parts should be straightforward. It's designed to be very difficult to pass convincingly if you didn't understand what was built, regardless of how it was built.

## Marking scheme (indicative)

### Submitted code — 60%

| Area | Weight |
|---|---|
| Database design (1:M + M:N modelled correctly, sensible schema) | 12% |
| Core REST API (CRUD, validation, auth, error handling) | 18% |
| Domain events architecture (decoupled emit/listen pattern) | 8% |
| Notifications (email + in-app, correct triggers) | 8% |
| Background job (real queue, separate worker process) | 8% |
| Documentation, tests, and how-to-run instructions | 6% |

### Oral code defense — 40%

| Area | Weight |
|---|---|
| Walkthrough — can trace a request end-to-end through your own architecture | 10% |
| Why questions — can justify the four architectural requirements above | 15% |
| Live micro-task — can navigate and correctly modify your own code unaided | 15% |

Steps you didn't reach (see [Sequence of steps](#sequence-of-steps)) score 0 in both halves for that area rather than being penalised further — there's no separate deduction for incompleteness beyond the marks not being available to earn.

## Constraints

- Your case study must be **your own domain**, not a renamed copy of the support desk ticketing system.
- Services must not call email/notification code directly — it must go through the event bus.
- At least one notification-sending path must go through a background job queue running in a separate process from the API.
- All infrastructure dependencies (database, Redis, mail catcher) must be runnable via `docker compose up`.

## Academic integrity

You may reuse patterns, folder structure, and boilerplate (config, middleware, error handling) from the support desk case study — that is expected. What must be your own work is the domain design (entities, relationships, workflows), the events you define, and the business logic behind them.
