# Development Workflow

## Git Workflow

### Branch Strategy
```
main                 # Production branch
├── develop          # Development branch
├── feature/xxx      # Feature branches
├── bugfix/xxx       # Bug fix branches
└── hotfix/xxx       # Emergency fixes
```

### Commit Convention
```bash
# Format: type(scope): description

# Types:
feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code restructuring
test: adding tests
chore: maintenance

# Examples:
feat(tuvi): add birth time validation
fix(api): handle invalid date input
docs(readme): update installation guide
```

### Pull Request Process
1. Create feature branch from `develop`
2. Make changes and commit
3. Push branch and create PR
4. Code review and approval
5. Merge to `develop`
6. Deploy to staging for testing
7. Merge `develop` to `main` for production

## Code Standards

### TypeScript Guidelines

#### Naming Conventions
```typescript
// PascalCase for types, interfaces, classes
interface UserProfile {}
type TuviData = {};
class TuviService {}

// camelCase for variables, functions
const userName = 'John';
const calculateNumerology = () => {};

// UPPER_SNAKE_CASE for constants
const MAX_RETRY_ATTEMPTS = 3;
const API_ENDPOINTS = {};
```

#### Type Definitions
```typescript
// Prefer interfaces for object shapes
interface User {
  id: string;
  email: string;
  name?: string;
}

// Use type for unions, primitives
type Status = 'pending' | 'completed' | 'failed';
type ID = string;

// Generic types
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
```

### Code Organization

#### File Structure
```
feature/
├── components/
│   ├── FeatureForm.tsx
│   ├── FeatureList.tsx
│   └── index.ts          # Export barrel
├── hooks/
│   └── useFeature.ts
├── types.ts              # Feature-specific types
└── utils.ts              # Feature utilities
```

#### Import Order
```typescript
// 1. Node modules
import React from 'react';
import { z } from 'zod';

// 2. Internal modules (absolute paths)
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';

// 3. Relative imports
import { FeatureForm } from './FeatureForm';
import { useFeature } from '../hooks/useFeature';
```

### Code Quality Tools

#### ESLint Configuration
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

#### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## Testing Strategy

### Unit Tests
```typescript
// services/tuvi.test.ts
import { describe, it, expect } from 'vitest';
import { calculateTuvi } from './tuvi';

describe('Tuvi Service', () => {
  it('should calculate tuvi chart correctly', () => {
    const input = {
      birthDate: new Date('1990-01-01'),
      birthTime: '10:30',
      gender: 'male' as const,
    };
    
    const result = calculateTuvi(input);
    
    expect(result).toBeDefined();
    expect(result.palaces).toHaveLength(12);
  });
});
```

### Integration Tests
```typescript
// api/tuvi.test.ts
import { createTRPCMsw } from 'msw-trpc';
import { appRouter } from '../routers';

const trpcMsw = createTRPCMsw(appRouter);

describe('Tuvi API', () => {
  it('should generate tuvi chart', async () => {
    const input = {
      name: 'Test User',
      birthDate: new Date(),
      birthTime: '10:30',
      gender: 'male' as const,
      isLunar: false,
    };

    const result = await trpcMsw.tuvi.generate.query(input);
    
    expect(result).toBeDefined();
  });
});
```

### Test Commands
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test tuvi.test.ts
```

## Development Environment

### Required Tools
- Node.js 18+
- pnpm 8+
- MySQL 8.0+
- Git

### VS Code Extensions
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag"
  ]
}
```

### Development Scripts
```bash
# Start development server
pnpm dev

# Type checking
pnpm check

# Linting
pnpm lint
pnpm lint:fix

# Formatting
pnpm format

# Database operations
pnpm db:push        # Apply schema changes
pnpm db:studio      # Open Drizzle Studio
pnpm db:seed        # Run seed scripts
```

## Code Review Guidelines

### Review Checklist
- [ ] Code follows TypeScript best practices
- [ ] Proper error handling implemented
- [ ] Input validation with Zod schemas
- [ ] Tests added for new functionality
- [ ] Documentation updated if needed
- [ ] No console.log statements in production code
- [ ] Proper type safety maintained
- [ ] Performance considerations addressed

### Review Process
1. **Automated Checks**: ESLint, TypeScript, tests must pass
2. **Manual Review**: Code quality, logic, architecture
3. **Testing**: Reviewer tests functionality locally
4. **Approval**: At least one approval required
5. **Merge**: Squash and merge to maintain clean history

## Release Process

### Version Management
```bash
# Update version
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0
```

### Release Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Database migrations tested
- [ ] Environment variables documented
- [ ] Performance impact assessed
- [ ] Security review completed
- [ ] Rollback plan prepared

### Deployment Steps
1. Merge to `main` branch
2. Tag release version
3. Build and test in staging
4. Deploy to production
5. Monitor application health
6. Update release notes

## Troubleshooting

### Common Development Issues

#### Database Connection
```bash
# Check MySQL service
sudo systemctl status mysql

# Reset database
pnpm db:push --force
```

#### TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
pnpm install

# Restart TypeScript server in VS Code
Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

#### Build Issues
```bash
# Clear build cache
rm -rf client/dist server/dist
pnpm build
```
