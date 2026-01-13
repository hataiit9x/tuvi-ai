# Database Schema

## Tables Overview

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Readings Table
```sql
CREATE TABLE readings (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  type ENUM('tuvi', 'numerology', 'zodiac', 'compatibility') NOT NULL,
  input_data JSON NOT NULL,
  result_data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### LLM Config Table
```sql
CREATE TABLE llm_configs (
  id VARCHAR(255) PRIMARY KEY,
  provider VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  api_key VARCHAR(500),
  base_url VARCHAR(500),
  temperature DECIMAL(3,2) DEFAULT 0.7,
  max_tokens INT DEFAULT 1000,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Sessions Table (Optional)
```sql
CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Relationships

```
users (1) ──── (n) readings
users (1) ──── (n) sessions
```

## Indexes

### Performance Indexes
```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);

-- Reading queries
CREATE INDEX idx_readings_user_id ON readings(user_id);
CREATE INDEX idx_readings_type ON readings(type);
CREATE INDEX idx_readings_created_at ON readings(created_at);

-- Session management
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- LLM config
CREATE INDEX idx_llm_configs_is_active ON llm_configs(is_active);
```

## Data Types

### JSON Structures

#### Tử Vi Input Data
```typescript
{
  name: string;
  birthDate: string; // ISO date
  birthTime: string; // "HH:mm"
  gender: "male" | "female";
  isLunar: boolean;
}
```

#### Tử Vi Result Data
```typescript
{
  chart: {
    palaces: Palace[];
    stars: Star[];
    elements: Element[];
  };
  analysis?: string;
  generatedAt: string;
}
```

#### Numerology Result Data
```typescript
{
  lifePathNumber: number;
  soulNumber: number;
  personalityNumber: number;
  destinyNumber: number;
  meanings: {
    [key: string]: string;
  };
}
```

## Migration Strategy

### Drizzle Migrations
- Migrations stored in `drizzle/meta/`
- Run with `pnpm db:push`
- Schema changes tracked automatically

### Data Migration Scripts
- Located in `server/seeds/`
- Run manually for data updates
- Include rollback procedures

## Backup Strategy

### Daily Backups
- Automated MySQL dumps
- Stored in cloud storage
- 30-day retention policy

### Point-in-time Recovery
- Binary log enabled
- 7-day retention for binlogs
