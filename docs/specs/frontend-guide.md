# Frontend Development Guide

## Project Structure

```
client/src/
├── components/          # React components
│   ├── ui/             # shadcn/ui primitives
│   ├── forms/          # Form components
│   ├── charts/         # Chart visualization
│   └── layout/         # Layout components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # Utilities
├── pages/              # Route components
├── _core/              # Framework code
├── App.tsx             # Root component
└── main.tsx            # Entry point
```

## Development Workflow

### 1. Component Development

#### Creating New Components
```bash
# Tạo component mới
mkdir client/src/components/tuvi
touch client/src/components/tuvi/TuviChart.tsx
```

#### Component Template
```typescript
import { FC } from 'react';

interface TuviChartProps {
  data: TuviData;
  onAnalyze?: () => void;
}

export const TuviChart: FC<TuviChartProps> = ({ data, onAnalyze }) => {
  return (
    <div className="tuvi-chart">
      {/* Component content */}
    </div>
  );
};
```

### 2. State Management

#### tRPC Hooks
```typescript
import { trpc } from '@/lib/trpc';

// Query data
const { data, isLoading, error } = trpc.tuvi.generate.useQuery({
  name: 'John Doe',
  birthDate: new Date(),
  // ...
});

// Mutation
const generateTuvi = trpc.tuvi.generate.useMutation({
  onSuccess: (data) => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  },
});
```

#### React Query Patterns
```typescript
// Optimistic updates
const updateProfile = trpc.auth.updateProfile.useMutation({
  onMutate: async (newData) => {
    await queryClient.cancelQueries(['auth', 'profile']);
    const previousData = queryClient.getQueryData(['auth', 'profile']);
    queryClient.setQueryData(['auth', 'profile'], newData);
    return { previousData };
  },
  onError: (err, newData, context) => {
    queryClient.setQueryData(['auth', 'profile'], context?.previousData);
  },
});
```

### 3. Routing

#### wouter Router Setup
```typescript
import { Route, Switch } from 'wouter';

function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/tuvi" component={TuviPage} />
      <Route path="/numerology" component={NumerologyPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route>404 Not Found</Route>
    </Switch>
  );
}
```

#### Navigation
```typescript
import { useLocation } from 'wouter';

const [location, setLocation] = useLocation();

// Navigate programmatically
setLocation('/tuvi');
```

### 4. Styling Guidelines

#### Tailwind CSS Classes
```typescript
// Consistent spacing
const spacing = {
  xs: 'p-2',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

// Color scheme
const colors = {
  primary: 'bg-blue-600 text-white',
  secondary: 'bg-gray-100 text-gray-900',
  accent: 'bg-purple-600 text-white',
};
```

#### Component Styling
```typescript
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const Button: FC<ButtonProps> = ({ variant = 'primary', size = 'md', className, ...props }) => {
  return (
    <button
      className={cn(
        'rounded-md font-medium transition-colors',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'secondary',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
};
```

### 5. Form Handling

#### React Hook Form + Zod
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Tên không được để trống'),
  birthDate: z.date(),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, 'Định dạng giờ không hợp lệ'),
});

type FormData = z.infer<typeof schema>;

const TuviForm: FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};
```

### 6. Error Handling

#### Error Boundaries
```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="error-fallback">
      <h2>Có lỗi xảy ra</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Thử lại</button>
    </div>
  );
}

// Usage
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <TuviChart />
</ErrorBoundary>
```

### 7. Performance Optimization

#### Code Splitting
```typescript
import { lazy, Suspense } from 'react';

const TuviPage = lazy(() => import('./pages/TuviPage'));

// Usage
<Suspense fallback={<div>Đang tải...</div>}>
  <TuviPage />
</Suspense>
```

#### Memoization
```typescript
import { memo, useMemo } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return processData(data);
  }, [data]);

  return <div>{/* Render processed data */}</div>;
});
```

## Testing

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';
import { TuviChart } from './TuviChart';

test('renders tuvi chart', () => {
  const mockData = { /* mock data */ };
  render(<TuviChart data={mockData} />);
  
  expect(screen.getByText('Tử Vi Chart')).toBeInTheDocument();
});
```

## Build & Deployment

```bash
# Development
pnpm dev

# Build
pnpm build

# Preview build
pnpm preview
```
