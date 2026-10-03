# Asteria — Modern Mediterranean Restaurant

A full-stack restaurant platform built with Next.js, NestJS, PostgreSQL, and Prisma — featuring a complete customer-facing ordering and reservations experience, plus a full admin dashboard for restaurant staff.

**Live site:** https://asteria-restaurant.vercel.app
**Admin login:** https://asteria-restaurant-git-main-walid-c686.vercel.app/admin/login (demo: `alex@asteria.com` / `password123`)

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeScript, REST API
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT-based, separate systems for customers and staff, role-based permissions
- **Payments:** Stripe (test mode)
- **Email:** Resend
- **Image storage:** Cloudinary
- **Hosting:** Vercel (frontend), Render (backend), Neon (database)

## Features

### Customer-facing
- Home, Menu, Our Story, Gallery, Contact pages
- Dish details with customizable options (extras, spice level, etc.)
- Real-time cart, Stripe checkout, order confirmation with live status tracking
- Reservations with real table-availability checking
- Full account system: order history, reservation history, profile, settings, account deletion

### Admin dashboard
- Role-based staff authentication (Manager / Staff / Kitchen roles)
- Live dashboard with today's orders, reservations, revenue, and table status
- Order management with kitchen status workflow
- Reservation management with table assignment
- Menu management (categories, dishes, customizations) with image upload
- Table management with occupancy tracking
- Customer management with VIP flagging and staff notes
- Staff & permissions management
- Restaurant settings (info, opening hours, gallery)

## Project Structure
asteria/
├── apps/
│ ├── web/ # Next.js frontend (customer site + admin dashboard)
│ └── api/ # NestJS backend (REST API)
├── prisma/ # Database schema, migrations, seed script
└── docker-compose.yml # Local PostgreSQL for development


## Running Locally

```bash
# Install dependencies
npm install

# Start local Postgres
docker compose up -d

# Apply database migrations and seed data
npx prisma migrate dev
npx prisma db seed

# Start the backend (in one terminal)
npm run start:dev --workspace=apps/api

# Start the frontend (in another terminal)
npm run dev --workspace=apps/web
```

You'll need a `.env` file at the root with your own `DATABASE_URL`, `JWT_SECRET`, `ADMIN_JWT_SECRET`, `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`, and `CLOUDINARY_*` credentials.

## Notes

This project was built incrementally as a learning exercise, covering the full lifecycle of a real-world full-stack application: database design, backend API development, frontend implementation, authentication, payments, file uploads, email, mobile responsiveness, security hardening, and production deployment.