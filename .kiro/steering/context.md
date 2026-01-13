# Context & Working Guidelines

## Project Context

Tử Vi AI Web là nền tảng xem bói và tử vi Việt Nam kết hợp phương pháp huyền học truyền thống với AI. Dự án sử dụng React + tRPC + MySQL với mục tiêu phục vụ người dùng Việt Nam.

## Kiro Working Rules

### Code Generation
- Always follow the established patterns in the codebase
- Use existing components and utilities when possible
- Maintain consistency with current naming conventions
- Follow the project's TypeScript strict mode settings

### File Operations
- Check existing file structure before creating new files
- Use proper import paths with `@/` and `@shared/` aliases
- Follow the established folder organization
- Update barrel exports when adding new components

### Database Operations
- Always use Drizzle ORM, never raw SQL
- Check existing schema before proposing changes
- Use proper TypeScript types from schema
- Consider migration impact for schema changes

### API Development
- Follow tRPC patterns established in the project
- Use appropriate procedure types (public/protected/admin)
- Implement proper Zod validation
- Keep business logic in services, not routers

### Testing Approach
- Write tests for new service functions
- Use existing test patterns and utilities
- Mock external dependencies properly
- Test both success and error scenarios

## Communication Style

### Vietnamese Context
- All user-facing content must be in Vietnamese
- Use appropriate Vietnamese terminology for fortune-telling concepts
- Consider Vietnamese cultural context in features
- Maintain respectful tone for spiritual/cultural topics

### Technical Communication
- Use clear, concise explanations
- Provide code examples when helpful
- Explain reasoning behind technical decisions
- Reference existing patterns in the codebase

## Problem-Solving Approach

### Before Making Changes
1. Understand the existing implementation
2. Check for similar patterns in the codebase
3. Consider impact on other parts of the system
4. Verify compatibility with current tech stack

### When Implementing Features
1. Start with the service layer (business logic)
2. Add tRPC endpoints with proper validation
3. Create React components following established patterns
4. Add tests for critical functionality
5. Update documentation if needed

### Error Handling Priority
1. User experience (friendly error messages)
2. System stability (proper error boundaries)
3. Debugging (meaningful error logs)
4. Security (don't expose sensitive information)

## Quality Standards

### Code Review Checklist
- TypeScript types are properly defined
- Error handling is implemented
- Input validation is present
- Performance considerations are addressed
- Security best practices are followed
- Tests cover the main functionality

### Documentation Requirements
- Update README for new features
- Add JSDoc for public APIs
- Comment complex business logic
- Keep steering files updated with new patterns
