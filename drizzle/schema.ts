import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * LLM Configuration table for admin settings
 */
export const llmSettings = mysqlTable("llm_settings", {
  id: int("id").autoincrement().primaryKey(),
  baseUrl: varchar("baseUrl", { length: 512 }).notNull().default("https://api.openai.com/v1"),
  model: varchar("model", { length: 128 }).notNull().default("gpt-4"),
  apiKey: varchar("apiKey", { length: 256 }).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LLMSetting = typeof llmSettings.$inferSelect;
export type InsertLLMSetting = typeof llmSettings.$inferInsert;

/**
 * Tử Vi readings history
 */
export const tuviReadings = mysqlTable("tuvi_readings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  fullName: varchar("fullName", { length: 256 }).notNull(),
  birthDate: varchar("birthDate", { length: 32 }).notNull(),
  birthHour: varchar("birthHour", { length: 32 }).notNull(),
  gender: mysqlEnum("gender", ["male", "female"]).notNull(),
  calendarType: mysqlEnum("calendarType", ["lunar", "solar"]).notNull(),
  chartData: json("chartData"),
  aiAnalysis: text("aiAnalysis"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TuviReading = typeof tuviReadings.$inferSelect;
export type InsertTuviReading = typeof tuviReadings.$inferInsert;

/**
 * Numerology readings history
 */
export const numerologyReadings = mysqlTable("numerology_readings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  fullName: varchar("fullName", { length: 256 }).notNull(),
  birthDate: varchar("birthDate", { length: 32 }).notNull(),
  lifePathNumber: int("lifePathNumber").notNull(),
  soulNumber: int("soulNumber").notNull(),
  personalityNumber: int("personalityNumber").notNull(),
  destinyNumber: int("destinyNumber").notNull(),
  birthDayNumber: int("birthDayNumber").notNull(),
  birthChart: json("birthChart"),
  aiAnalysis: text("aiAnalysis"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NumerologyReading = typeof numerologyReadings.$inferSelect;
export type InsertNumerologyReading = typeof numerologyReadings.$inferInsert;

export const tuviStars = mysqlTable("tuvi_stars", {
  id: int("id").autoincrement().primaryKey(),
  vietnameseName: varchar("vietnameseName", { length: 128 }).notNull().unique(),
  chineseName: varchar("chineseName", { length: 64 }).notNull(),
  pinyin: varchar("pinyin", { length: 64 }),
  nature: mysqlEnum("nature", ["cat", "hung", "neutral"]).notNull(),
  type: mysqlEnum("type", ["main", "secondary", "auxiliary"]).default("main").notNull(),
  meaning: text("meaning"),
  description: text("description"),
  influence: text("influence"),
  palaceInfluence: json("palaceInfluence"),
  remedy: text("remedy"),
  compatibility: json("compatibility"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TuviStar = typeof tuviStars.$inferSelect;
export type InsertTuviStar = typeof tuviStars.$inferInsert;

/**
 * Tử Vi AI Analysis Cache
 * Cache kết quả phân tích AI để tránh gọi API LLM nhiều lần cho cùng input
 */
export const tuviCache = mysqlTable("tuvi_cache", {
  id: int("id").autoincrement().primaryKey(),
  birthDate: varchar("birthDate", { length: 32 }).notNull(),
  birthHour: varchar("birthHour", { length: 32 }).notNull(),
  gender: mysqlEnum("gender", ["male", "female"]).notNull(),
  calendarType: mysqlEnum("calendarType", ["lunar", "solar"]).notNull(),
  year: int("year").notNull(), // Năm sinh để cache riêng theo năm
  chartData: json("chartData").notNull(), // Lưu chart data đã tính
  aiAnalysis: text("aiAnalysis").notNull(), // Kết quả phân tích AI tổng quan
  palaceAnalyses: json("palaceAnalyses"), // Lưu phân tích chi tiết 12 cung: { "Mệnh": "...", "Phụ Mẫu": "...", ... }
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TuviCache = typeof tuviCache.$inferSelect;
export type InsertTuviCache = typeof tuviCache.$inferInsert;

/**
 * Numerology AI Analysis Cache
 * Cache kết quả phân tích AI để tránh gọi API LLM nhiều lần cho cùng ngày sinh
 */
export const numerologyCache = mysqlTable("numerology_cache", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 256 }).notNull(),
  birthDate: varchar("birthDate", { length: 32 }).notNull(), // YYYY-MM-DD format
  year: int("year").notNull(), // Năm sinh để cache riêng theo năm
  lifePathNumber: int("lifePathNumber").notNull(),
  soulNumber: int("soulNumber").notNull(),
  personalityNumber: int("personalityNumber").notNull(),
  destinyNumber: int("destinyNumber").notNull(),
  birthDayNumber: int("birthDayNumber").notNull(),
  birthChart: json("birthChart").notNull(), // Kết quả tính toán numerology
  aiAnalysis: text("aiAnalysis").notNull(), // Kết quả phân tích AI
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NumerologyCache = typeof numerologyCache.$inferSelect;
export type InsertNumerologyCache = typeof numerologyCache.$inferInsert;

/**
 * Zodiac Forecast Cache
 * Cache dự báo vận mệnh 12 con giáp
 */
export const zodiacCache = mysqlTable("zodiac_cache", {
  id: int("id").autoincrement().primaryKey(),
  animal: varchar("animal", { length: 32 }).notNull(), // rat, ox, ...
  year: int("year").notNull(), // Năm dự báo (2026)
  content: text("content").notNull(), // Nội dung dự báo
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ZodiacCache = typeof zodiacCache.$inferSelect;
export type InsertZodiacCache = typeof zodiacCache.$inferInsert;

/**
 * Tet Tools Cache
 * Cache kết quả các công cụ Tết (Xông đất, Lời khuyên tổng hợp)
 */
export const tetCache = mysqlTable("tet_cache", {
  id: int("id").autoincrement().primaryKey(),
  functionName: varchar("functionName", { length: 32 }).notNull(), // 'xongDat', 'fullAdvice'
  birthYear: int("birthYear").notNull(), // Năm sinh của user
  year: int("year").notNull(), // Năm Tết (2026)
  data: json("data").notNull(), // Kết quả tính toán (JSON)
  aiAdvice: text("aiAdvice").notNull(), // Lời khuyên AI
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TetCache = typeof tetCache.$inferSelect;
export type InsertTetCache = typeof tetCache.$inferInsert;
