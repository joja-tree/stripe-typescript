# Stripe Subscription Next.js App

This project is a Next.js application using TypeScript, set up for Stripe subscription integration. It uses Next.js API routes for backend logic and is focused on subscription workflows only (not one-time payments).

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Visit [http://localhost:3000](http://localhost:3000) to view the app.

## Next Steps
- Implement subscription UI and logic using Stripe Elements and API routes.
- See `/src/app/page.tsx` for the main page scaffold.
- See `/src/pages/api/` for backend logic (to be implemented).

---

For more details, see the official Next.js and Stripe documentation.
