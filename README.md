# Accountant Portal

A secure client portal for a tax-advisory / audit firm (Wirtschaftsprüfungs- &
Steuerberatungsgesellschaft), built with **Next.js**, **Clerk** (authentication)
and **Supabase** (Postgres database + private document storage).

## What it does

- **Public site** – a professional landing page describing the firm's services.
- **Client portal** (`/portal`) – clients sign in and download the tax returns,
  annual reports and other documents the accountant has prepared for them.
- **Admin / accountant portal** (`/admin`):
  - **Approve new sign-ups** – every new registration lands in a *pending* state
    and cannot see anything until the accountant approves it.
  - **Upload documents to the right client** – assign each file to a specific
    client; the file lands in a private Supabase Storage bucket and only that
    client (and admins) can download it via short-lived signed URLs.

## Architecture

| Concern            | Tool        | Notes                                                        |
| ------------------ | ----------- | ------------------------------------------------------------ |
| Authentication     | Clerk       | Sign-in / sign-up, sessions, `clerkMiddleware`.              |
| Data               | Supabase    | `profiles` + `documents` tables (see `supabase/schema.sql`). |
| File storage       | Supabase    | Private `documents` bucket, accessed via signed URLs.        |
| Authorization      | App server  | Every DB/storage call runs server-side with the service-role |
|                    |             | key **after** the caller's Clerk identity + role is checked. |

Access to Supabase is intentionally routed through Next.js server code
(server components, server actions, route handlers) using the **service-role
key**. Row Level Security is enabled with no public policies, so nothing is
reachable with the anon key — the app is the single trusted gatekeeper.

### Roles & approval flow

- On first sign-in a `profiles` row is created for the Clerk user.
- Emails listed in `ADMIN_EMAILS` become **admins** and are auto-approved.
- Everyone else becomes a **client** with status `pending` → sees the
  "waiting for approval" screen until an admin approves them.

## Setup

### 1. Install

```bash
npm install
```

### 2. Clerk

1. Create an application at <https://dashboard.clerk.com>.
2. Copy the Publishable key and Secret key into `.env.local`.

### 3. Supabase

1. Create a project at <https://supabase.com>.
2. Open the SQL editor and run [`supabase/schema.sql`](supabase/schema.sql).
   This creates the `profiles` and `documents` tables and the private
   `documents` storage bucket.
3. Copy the Project URL and the **service-role** key into `.env.local`.

### 4. Environment variables

```bash
cp .env.example .env.local
# then fill in the values, and set ADMIN_EMAILS to your own email
```

### 5. Run

```bash
npm run dev
```

- Visit `/sign-up`, register with the email you put in `ADMIN_EMAILS` → you land
  in the **admin** portal.
- Register with any other email → you land on the **pending** screen until the
  admin approves you from `/admin`.

## Project structure

```
src/
  app/
    page.tsx                     Public landing page
    sign-in/ sign-up/            Clerk auth pages
    pending/                     "Awaiting approval" screen
    portal/                      Client portal (approved clients)
    admin/                       Accountant portal
      actions.ts                 Server actions: approve, upload, delete
      clients/[id]/              Per-client document management
    api/documents/[id]/download  Signed-URL download handler
  lib/
    profile.ts                   Clerk ↔ Supabase profile + role logic
    supabase/admin.ts            Service-role Supabase client
  components/                    Nav, upload form, delete button
supabase/schema.sql              Database + storage bucket definition
```
