# Common Patterns & Examples

## tRPC Patterns

### Service Layer Pattern
```typescript
// server/services/tuvi.ts
export const tuviService = {
  async generateChart(input: TuviInput): Promise<TuviChart> {
    // Validate input
    const validated = tuviInputSchema.parse(input);
    
    // Business logic
    const chart = await calculateTuvi(validated);
    
    // Return result
    return chart;
  },
  
  async analyzeChart(chart: TuviChart): Promise<string> {
    // AI analysis logic
    return analysis;
  }
};
```

### Router Pattern
```typescript
// server/routers/tuvi.ts
export const tuviRouter = router({
  generate: publicProcedure
    .input(tuviInputSchema)
    .query(async ({ input }) => {
      return tuviService.generateChart(input);
    }),
    
  analyze: publicProcedure
    .input(z.object({ chart: tuviChartSchema }))
    .mutation(async ({ input }) => {
      return tuviService.analyzeChart(input.chart);
    }),
});
```

## React Patterns

### Component with tRPC
```typescript
// client/src/components/TuviForm.tsx
import { trpc } from '@/lib/trpc';

export const TuviForm: FC = () => {
  const generateTuvi = trpc.tuvi.generate.useMutation({
    onSuccess: (data) => {
      // Handle success
    },
    onError: (error) => {
      // Handle error
    },
  });

  const handleSubmit = (data: TuviInput) => {
    generateTuvi.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form content */}
    </form>
  );
};
```

### Error Boundary Pattern
```typescript
// client/src/components/ErrorBoundary.tsx
export const ErrorBoundary: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error) => console.error('Error:', error)}
    >
      {children}
    </ReactErrorBoundary>
  );
};
```

## Database Patterns

### Schema Definition
```typescript
// drizzle/schema.ts
export const readings = mysqlTable('readings', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }),
  type: mysqlEnum('type', ['tuvi', 'numerology', 'zodiac']).notNull(),
  inputData: json('input_data').notNull(),
  resultData: json('result_data').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### Service with Database
```typescript
// server/services/readings.ts
export const readingsService = {
  async saveReading(userId: string, reading: ReadingData) {
    return db.insert(readings).values({
      id: generateId(),
      userId,
      type: reading.type,
      inputData: reading.input,
      resultData: reading.result,
    });
  },
  
  async getUserReadings(userId: string) {
    return db.select()
      .from(readings)
      .where(eq(readings.userId, userId))
      .orderBy(desc(readings.createdAt));
  },
};
```

## Validation Patterns

### Zod Schema
```typescript
// shared/schemas.ts
export const tuviInputSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống'),
  birthDate: z.date(),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, 'Định dạng giờ không hợp lệ'),
  gender: z.enum(['male', 'female']),
  isLunar: z.boolean(),
});

export type TuviInput = z.infer<typeof tuviInputSchema>;
```

## Testing Patterns

### Service Test
```typescript
// server/services/tuvi.test.ts
describe('TuviService', () => {
  it('should generate valid chart', async () => {
    const input: TuviInput = {
      name: 'Test User',
      birthDate: new Date('1990-01-01'),
      birthTime: '10:30',
      gender: 'male',
      isLunar: false,
    };
    
    const result = await tuviService.generateChart(input);
    
    expect(result).toBeDefined();
    expect(result.palaces).toHaveLength(12);
  });
});
```

## Error Handling Patterns

### tRPC Error
```typescript
// server/services/base.ts
export class ServiceError extends Error {
  constructor(
    message: string,
    public code: 'BAD_REQUEST' | 'NOT_FOUND' | 'INTERNAL_ERROR' = 'INTERNAL_ERROR'
  ) {
    super(message);
  }
}

// Usage in service
if (!user) {
  throw new ServiceError('User not found', 'NOT_FOUND');
}
```

### Frontend Error Handling
```typescript
// client/src/hooks/useErrorHandler.ts
export const useErrorHandler = () => {
  return (error: unknown) => {
    if (error instanceof TRPCError) {
      toast.error(error.message);
    } else {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    }
  };
};
```
