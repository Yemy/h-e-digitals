# CPD E-Training & Certification (Next.js + Prisma + Tailwind)

This repository is a scaffolded CPD e-training and certification platform built with Next.js (App Router), Prisma, PostgreSQL, TailwindCSS and TypeScript. It includes core models, authentication (NextAuth), payments (Stripe), certificate generation, quiz handling, and API routes.

## Quick Setup (Windows / PowerShell)

1. Install dependencies

```powershell
npm install
# or
pnpm install
```

2. Create `.env` file (example)

```
DATABASE_URL=postgresql://user:password@localhost:5432/cpd_db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace_with_a_secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Run Prisma migrations and generate client

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

4. Seed example data (if `prisma/seed.ts` exists)

```powershell
node prisma/seed.ts
```

5. Run the dev server

```powershell
npm run dev
```

## Important Endpoints
- `POST /api/courses/create` : Create a course (instructor)
- `POST /api/courses/:id/publish` : Toggle publish/unpublish (instructor/admin)
- `POST /api/courses/:id/update` : Update course metadata (instructor/admin)
- `GET  /api/courses/:courseId/reviews` : Fetch course reviews
- `POST /api/reviews` : Create/update a review
- `GET  /api/notifications` : Get user notifications
- `POST /api/notifications/send` : Create/send a notification (admin/system)
- `POST /api/withdrawals/request` : Request a withdrawal (instructor)
- `POST /api/admin/withdrawals/approve` : Admin approve withdrawal
 - `POST /api/uploads` : Upload a file (dev) — accepts JSON `{ filename, data }` where `data` is base64. Saves to `public/uploads/`.


Notes and next steps
- File upload: The UI includes placeholders for modules/resources. Choose S3 or another storage provider and implement upload endpoints when ready.
 - File upload: The UI includes placeholders for modules/resources. For local dev there's a simple endpoint `POST /api/uploads` that accepts base64-encoded file data and saves to `public/uploads/`. For production, replace with S3 or signed-upload provider.
- Email notifications: There's a placeholder API at `POST /api/notifications/send`. To enable email delivery, add SMTP credentials and implement nodemailer (or a provider) in that route.
- Security: Some server components perform simple server-side queries without session checks for read-only data; ensure you review each page for appropriate authorization in production.

Local development (Windows PowerShell)

```powershell
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

If you want, I will now continue by:
- Implementing the instructor course edit UI (modules/quizzes management)
- Adding email sending in `api/notifications/send` using `nodemailer` (requires SMTP env)
- Adding automated linting and final TypeScript checks
- Configure Stripe webhook endpoint (e.g., `/api/payments/webhook`) and set `STRIPE_WEBHOOK_SECRET`.

If you want, I can now:
- Run `npm install` and add the missing dependencies to `package.json`.
- Add example frontend pages (dashboard, course page, course builder) and shadcn components.
- Create a Postman collection for the API.

Tell me which of the above you'd like me to do next.
"# h-e-digitals" 
