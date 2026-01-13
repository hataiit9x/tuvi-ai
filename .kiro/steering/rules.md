# Development Rules & Guidelines

## Code Quality Standards

### TypeScript Rules
- Always use strict type checking
- Prefer interfaces over types for object shapes
- Use proper error handling with Result types or try-catch
- No `any` types unless absolutely necessary
- Use Zod schemas for all input validation

### React Patterns
- Use functional components with hooks
- Implement proper error boundaries
- Use React Query for server state management
- Follow component composition over inheritance
- Keep components small and focused (< 200 lines)

### API Development
- All endpoints must use tRPC with proper input/output types
- Use `publicProcedure`, `protectedProcedure`, or `adminProcedure` appropriately
- Implement proper error handling with tRPC error codes
- Add input validation with Zod schemas
- Keep business logic in service layer, not in routers

### Database Rules
- Use Drizzle ORM for all database operations
- Never write raw SQL unless absolutely necessary
- Always use transactions for multi-table operations
- Add proper indexes for query performance
- Use foreign key constraints for data integrity

## File Organization

### Naming Conventions
- Components: PascalCase (e.g., `TuviChart.tsx`)
- Hooks: camelCase starting with 'use' (e.g., `useTuvi.ts`)
- Services: camelCase (e.g., `tuviService.ts`)
- Types: PascalCase (e.g., `TuviData`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)

### Import Rules
- Use absolute imports with `@/` and `@shared/` aliases
- Group imports: external → internal → relative
- Use barrel exports (`index.ts`) for clean imports
- Avoid circular dependencies

## Testing Requirements

### Unit Tests
- All service functions must have unit tests
- Test both happy path and error cases
- Use descriptive test names
- Mock external dependencies

### Integration Tests
- Test API endpoints with real database
- Test critical user flows
- Use test database, never production data

## Security Guidelines

### Input Validation
- Validate all user inputs with Zod schemas
- Sanitize data before database operations
- Use parameterized queries (Drizzle handles this)

### Authentication
- Use JWT tokens for authentication
- Implement proper session management
- Check permissions on protected routes
- Never expose sensitive data in API responses

## Performance Guidelines

### Frontend
- Use React.memo for expensive components
- Implement proper loading states
- Use code splitting for large components
- Optimize images and assets

### Backend
- Use database indexes for common queries
- Implement caching where appropriate
- Use connection pooling for database
- Monitor query performance

## Error Handling

### Frontend
- Use error boundaries for component errors
- Show user-friendly error messages
- Log errors for debugging
- Implement retry mechanisms for network errors

### Backend
- Use proper HTTP status codes
- Return structured error responses
- Log errors with context
- Don't expose internal errors to users

## Documentation Rules

### Code Comments
- Comment complex business logic
- Explain "why" not "what"
- Keep comments up to date
- Use JSDoc for public APIs

### README Updates
- Update when adding new features
- Include setup instructions
- Document environment variables
- Keep examples current
