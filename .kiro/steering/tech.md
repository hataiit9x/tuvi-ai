# Tech Stack

## Frontend
- React 19 with TypeScript
- Vite 7 for bundling and dev server
- Tailwind CSS 4 for styling
- shadcn/ui components (New York style, Radix UI primitives)
- wouter for client-side routing
- React Query + tRPC for data fetching
- Framer Motion for animations
- Recharts for data visualization

## Backend
- Express.js server with TypeScript
- tRPC for type-safe API layer
- Drizzle ORM with MySQL database
- Zod for input validation
- LLM integration via OpenAI-compatible API

## Shared
- TypeScript throughout (strict mode)
- superjson for serialization
- Path aliases: `@/` (client/src), `@shared/` (shared)

## Common Commands

```bash
# Development
pnpm dev              # Start dev server with hot reload

# Build & Production
pnpm build            # Build client (Vite) and server (esbuild)
pnpm start            # Run production server

# Code Quality
pnpm check            # TypeScript type checking
pnpm format           # Prettier formatting
pnpm test             # Run tests with Vitest

# Database
pnpm db:push          # Generate and run Drizzle migrations
```

## Environment Variables

- `DATABASE_URL`: MySQL connection string (required)
- LLM settings configured via admin panel and stored in database

## Testing

- Vitest for unit tests
- Test files: `server/**/*.test.ts`
- Run single execution with `vitest run`
