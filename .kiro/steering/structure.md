# Project Structure

```
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   └── ui/            # shadcn/ui primitives
│   │   ├── contexts/          # React context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utilities (trpc client, date utils, etc.)
│   │   ├── pages/             # Route page components
│   │   ├── _core/             # Core framework hooks (auth)
│   │   ├── App.tsx            # Root component with routing
│   │   └── main.tsx           # Entry point
│   └── public/                # Static assets
│
├── server/                    # Backend Express + tRPC
│   ├── routers.ts             # Main tRPC router (appRouter)
│   ├── db.ts                  # Database connection
│   ├── storage.ts             # File storage utilities
│   ├── services/              # Business logic services
│   │   ├── tuvi.ts            # Tử Vi chart generation
│   │   ├── numerology.ts      # Numerology calculations
│   │   ├── fortune.ts         # Zodiac and feng shui logic
│   │   └── compatibility.ts   # Compatibility analysis
│   ├── seeds/                 # Database seed scripts
│   └── _core/                 # Core framework (trpc, auth, llm, etc.)
│
├── shared/                    # Shared code between client/server
│   ├── types.ts               # TypeScript types and constants
│   ├── const.ts               # Shared constants
│   └── _core/                 # Core shared utilities
│
├── drizzle/                   # Database schema and migrations
│   ├── schema.ts              # Drizzle table definitions
│   ├── relations.ts           # Table relationships
│   └── meta/                  # Migration metadata
│
└── patches/                   # pnpm package patches
```

## Key Patterns

- **tRPC Routers**: API defined in `server/routers.ts`, organized by domain (tuvi, numerology, zodiac, etc.)
- **Services**: Business logic isolated in `server/services/` with corresponding `.test.ts` files
- **Procedures**: `publicProcedure` for open endpoints, `protectedProcedure` for authenticated, `adminProcedure` for admin-only
- **Schema Types**: Database types exported from `drizzle/schema.ts`, re-exported via `shared/types.ts`
- **UI Components**: shadcn/ui in `client/src/components/ui/`, custom components alongside
- **_core folders**: Framework-provided code, generally avoid modifying
