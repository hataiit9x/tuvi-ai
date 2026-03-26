import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM, clearLLMSettingsCache } from "./_core/llm";
import { getDb } from "./db";
import { tuviReadings, numerologyReadings, llmSettings, tuviStars, tuviCache, numerologyCache, zodiacCache, tetCache } from "../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

// Import services
import { generateTuviChart, getTuviAnalysisPrompt, getPalaceAnalysisPrompt } from "./services/tuvi";
import { calculateNumerology, getNumerologyAnalysisPrompt } from "./services/numerology";
import { NUMBER_MEANINGS } from "@shared/types";
import {
  getZodiacFromYear,
  getElementFromYear,
  getZodiacForecastPrompt,
  getAuspiciousDatesPrompt,
  calculateXongDat,
  calculateLuckyColors,
  calculateLuckyMoney,
  getXongDatPrompt,
  getLunarNewYearPrompt,
  ZODIAC_VIETNAMESE,
} from "./services/fortune";
import { calculateCompatibility, getCompatibilityAnalysisPrompt } from "./services/compatibility";

// 12 Palace Names for batch analysis
const PALACE_NAMES = [
  "Mệnh", "Phụ Mẫu", "Phúc Đức", "Điền Trạch",
  "Quan Lộc", "Nô Bộc", "Thiên Di", "Tật Ách",
  "Tài Bạch", "Tử Tức", "Phu Thê", "Huynh Đệ"
];

// Background job to analyze all palaces
async function preAnalyzeAllPalaces(input: any, chart: any, cacheId: number) {
  console.log(`🚀 Starting background palace analysis for ${input.birthDate} ${input.birthHour}`);

  const db = await getDb();
  if (!db) return;

  let successCount = 0;
  let failCount = 0;

  // Analyze all palaces sequentially (to avoid rate limiting)
  for (const palaceName of PALACE_NAMES) {
    try {
      const prompt = getPalaceAnalysisPrompt(chart, input, palaceName);

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "Bạn là một chuyên gia Tử Vi Đẩu Số hàng đầu Việt Nam. Hãy phân tích chuyên sâu cung chức năng theo yêu cầu." },
          { role: "user", content: prompt },
        ],
      });

      const analysis = String(response.choices[0]?.message?.content || "");

      // Update cache with this palace analysis
      const cached = await db
        .select()
        .from(tuviCache)
        .where(eq(tuviCache.id, cacheId))
        .limit(1);

      if (cached.length > 0) {
        const currentAnalyses = (cached[0].palaceAnalyses as Record<string, string>) || {};
        currentAnalyses[palaceName] = analysis;

        await db
          .update(tuviCache)
          .set({
            palaceAnalyses: currentAnalyses,
            updatedAt: new Date()
          })
          .where(eq(tuviCache.id, cacheId));

        successCount++;
        console.log(`✅ Pre-cached palace ${successCount}/12: ${palaceName}`);
      }

      // Small delay to avoid overwhelming LLM API
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      failCount++;
      console.error(`❌ Failed to pre-cache palace: ${palaceName}`, error);
    }
  }

  console.log(`🎉 Background palace analysis completed! Success: ${successCount}/12, Failed: ${failCount}/12`);
}

// Input schemas
const tuviInputSchema = z.object({
  fullName: z.string().min(1),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  birthHour: z.string(),
  gender: z.enum(["male", "female"]),
  calendarType: z.enum(["lunar", "solar"]),
});

const numerologyInputSchema = z.object({
  fullName: z.string().min(1),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const zodiacInputSchema = z.object({
  animal: z.enum(["rat", "ox", "tiger", "rabbit", "dragon", "snake", "horse", "goat", "monkey", "rooster", "dog", "pig"]),
  year: z.number().optional().default(2026),
});

const auspiciousDateInputSchema = z.object({
  purpose: z.enum(["wedding", "business_opening", "groundbreaking", "travel", "moving_house", "other"]),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  ownerBirthYear: z.number().optional(),
});

const xongDatInputSchema = z.object({
  ownerBirthYear: z.number().min(1900).max(2100),
});

const luckyColorInputSchema = z.object({
  birthYear: z.number().min(1900).max(2100),
});

const luckyMoneyInputSchema = z.object({
  recipientBirthYear: z.number().min(1900).max(2100),
});

const llmSettingsSchema = z.object({
  baseUrl: z.string().url(),
  model: z.string().min(1),
  apiKey: z.string().min(1),
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),

    // Admin login với tài khoản cố định
    adminLogin: publicProcedure
      .input(z.object({
        username: z.string(),
        password: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Tài khoản admin cố định
        const ADMIN_USERNAME = "admin";
        const ADMIN_PASSWORD = "tuvi@2026";

        if (input.username !== ADMIN_USERNAME || input.password !== ADMIN_PASSWORD) {
          throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
        }

        // Import SDK to create session
        const { sdk } = await import("./_core/sdk");
        const { upsertUser } = await import("./db");
        const { ONE_YEAR_MS } = await import("@shared/const");

        // Tạo hoặc cập nhật admin user trong database với role admin
        await upsertUser({
          openId: "admin-fixed-account",
          name: "Admin",
          email: "admin@tuvi.ai",
          loginMethod: "password",
          role: "admin",
          lastSignedIn: new Date(),
        });

        // Tạo session token
        const sessionToken = await sdk.createSessionToken("admin-fixed-account", {
          name: "Admin",
          expiresInMs: ONE_YEAR_MS,
        });

        // Set cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

        return { success: true, message: "Đăng nhập thành công!" };
      }),
  }),

  // Tử Vi Router
  tuvi: router({
    // Generate Tử Vi chart
    generateChart: publicProcedure
      .input(tuviInputSchema)
      .mutation(async ({ input, ctx }) => {
        const chart = generateTuviChart(input);
        return { chart, input };
      }),

    // Get AI analysis for Tử Vi chart
    analyze: publicProcedure
      .input(tuviInputSchema)
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();

        // Extract year from birthDate for cache key
        const birthYear = parseInt(input.birthDate.split('-')[0]);

        // Step 1: Check cache first
        if (db) {
          const cached = await db
            .select()
            .from(tuviCache)
            .where(and(
              eq(tuviCache.birthDate, input.birthDate),
              eq(tuviCache.birthHour, input.birthHour),
              eq(tuviCache.gender, input.gender),
              eq(tuviCache.calendarType, input.calendarType),
              eq(tuviCache.year, birthYear)
            ))
            .limit(1);

          if (cached.length > 0) {
            console.log(`✅ Cache HIT for ${input.birthDate} ${input.birthHour} (${input.gender}, ${input.calendarType}, year: ${birthYear})`);
            return {
              chart: cached[0].chartData,
              analysis: cached[0].aiAnalysis,
              cached: true
            };
          }

          console.log(`❌ Cache MISS for ${input.birthDate} ${input.birthHour} (${input.gender}, ${input.calendarType}, year: ${birthYear})`);
        }

        // Step 2: Generate chart and call LLM API
        const chart = generateTuviChart(input);
        const prompt = getTuviAnalysisPrompt(chart, input);

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Bạn là một chuyên gia Tử Vi Đẩu Số hàng đầu Việt Nam với hơn 30 năm kinh nghiệm. Hãy phân tích lá số tử vi một cách chi tiết, chuyên sâu và dễ hiểu." },
            { role: "user", content: prompt },
          ],
        });

        const analysis = String(response.choices[0]?.message?.content || "");

        // Step 3: Save to cache
        if (db) {
          try {
            const [insertResult] = await db.insert(tuviCache).values({
              birthDate: input.birthDate,
              birthHour: input.birthHour,
              gender: input.gender,
              calendarType: input.calendarType,
              year: birthYear,
              chartData: chart,
              aiAnalysis: analysis,
            });
            console.log(`💾 Cached analysis for ${input.birthDate} ${input.birthHour} (year: ${birthYear})`);

            // Step 3.5: Trigger background palace analysis (fire-and-forget)
            // Get the inserted cache ID
            const cacheId = insertResult.insertId;

            // Start background job (don't await - let it run in background)
            preAnalyzeAllPalaces(input, chart, cacheId).catch(error => {
              console.error("Background palace analysis failed:", error);
            });

          } catch (error) {
            console.error("Failed to cache analysis:", error);
          }
        }

        // Step 4: Save to history if user is logged in
        if (ctx.user && db) {
          try {
            await db.insert(tuviReadings).values({
              userId: ctx.user.id,
              fullName: input.fullName,
              birthDate: input.birthDate,
              birthHour: input.birthHour,
              gender: input.gender,
              calendarType: input.calendarType,
              chartData: chart,
              aiAnalysis: analysis,
            });
          } catch (error) {
            console.error("Failed to save to history:", error);
          }
        }

        return { chart, analysis, cached: false };
      }),

    // Analyze specific palace
    analyzePalace: publicProcedure
      .input(tuviInputSchema.extend({
        palaceName: z.string()
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        const birthYear = parseInt(input.birthDate.split('-')[0]);

        // Step 1: Check if we have cache entry for this person
        if (db) {
          const cached = await db
            .select()
            .from(tuviCache)
            .where(and(
              eq(tuviCache.birthDate, input.birthDate),
              eq(tuviCache.birthHour, input.birthHour),
              eq(tuviCache.gender, input.gender),
              eq(tuviCache.calendarType, input.calendarType),
              eq(tuviCache.year, birthYear)
            ))
            .limit(1);

          if (cached.length > 0 && cached[0].palaceAnalyses) {
            const palaceAnalyses = cached[0].palaceAnalyses as Record<string, string>;

            // Check if this specific palace has been analyzed
            if (palaceAnalyses[input.palaceName]) {
              console.log(`✅ Palace Cache HIT for ${input.palaceName} (${input.birthDate})`);
              return {
                analysis: palaceAnalyses[input.palaceName],
                cached: true
              };
            }
          }

          console.log(`❌ Palace Cache MISS for ${input.palaceName} (${input.birthDate})`);
        }

        // Step 2: Generate chart and call LLM for palace analysis
        const chart = generateTuviChart(input);
        const prompt = getPalaceAnalysisPrompt(chart, input, input.palaceName);

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Bạn là một chuyên gia Tử Vi Đẩu Số hàng đầu Việt Nam. Hãy phân tích chuyên sâu cung chức năng theo yêu cầu." },
            { role: "user", content: prompt },
          ],
        });

        const analysis = String(response.choices[0]?.message?.content || "");

        // Step 3: Update cache with palace analysis
        if (db) {
          try {
            const cached = await db
              .select()
              .from(tuviCache)
              .where(and(
                eq(tuviCache.birthDate, input.birthDate),
                eq(tuviCache.birthHour, input.birthHour),
                eq(tuviCache.gender, input.gender),
                eq(tuviCache.calendarType, input.calendarType),
                eq(tuviCache.year, birthYear)
              ))
              .limit(1);

            if (cached.length > 0) {
              // Update existing cache entry
              const currentAnalyses = (cached[0].palaceAnalyses as Record<string, string>) || {};
              currentAnalyses[input.palaceName] = analysis;

              await db
                .update(tuviCache)
                .set({
                  palaceAnalyses: currentAnalyses,
                  updatedAt: new Date()
                })
                .where(eq(tuviCache.id, cached[0].id));

              console.log(`💾 Cached palace analysis for ${input.palaceName} (${input.birthDate})`);
            } else {
              // No cache entry yet - this shouldn't happen normally as overview analysis should create it first
              console.warn(`⚠️ No cache entry found for ${input.birthDate}, palace analysis not cached`);
            }
          } catch (error) {
            console.error("Failed to cache palace analysis:", error);
          }
        }

        return {
          analysis,
          cached: false
        };
      }),

    // Get user's Tử Vi history
    history: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const readings = await db
        .select()
        .from(tuviReadings)
        .where(eq(tuviReadings.userId, ctx.user.id))
        .orderBy(desc(tuviReadings.createdAt))
        .limit(20);

      return readings;
    }),

    // Delete a Tử Vi reading
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Verify ownership
        const reading = await db
          .select()
          .from(tuviReadings)
          .where(eq(tuviReadings.id, input.id))
          .limit(1);

        if (!reading.length || reading[0].userId !== ctx.user.id) {
          throw new Error("Reading not found or unauthorized");
        }

        await db.delete(tuviReadings).where(eq(tuviReadings.id, input.id));
        return { success: true };
      }),
  }),

  // Numerology Router
  numerology: router({
    // Calculate numerology numbers
    calculate: publicProcedure
      .input(numerologyInputSchema)
      .mutation(async ({ input }) => {
        const result = calculateNumerology(input);
        return { result, input, meanings: NUMBER_MEANINGS };
      }),

    // Get AI analysis for numerology
    analyze: publicProcedure
      .input(numerologyInputSchema)
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        const birthYear = parseInt(input.birthDate.split('-')[0]);

        // Step 1: Check cache first
        if (db) {
          const cached = await db
            .select()
            .from(numerologyCache)
            .where(
              and(
                eq(numerologyCache.fullName, input.fullName),
                eq(numerologyCache.birthDate, input.birthDate),
                eq(numerologyCache.year, birthYear)
              )
            )
            .limit(1);

          if (cached.length > 0) {
            console.log(`🎯 Cache HIT for numerology: ${input.fullName} ${input.birthDate}`);

            // Re-calculate numbers to ensure we have all latest fields (cycles, forecasts, etc.)
            // The cache primarily saves us the expensive AI call
            const result = calculateNumerology(input);

            return {
              result,
              analysis: cached[0].aiAnalysis,
              meanings: NUMBER_MEANINGS,
              cached: true,
            };
          }

          console.log(`❌ Cache MISS for numerology: ${input.fullName} ${input.birthDate}`);
        }

        // Step 2: Calculate numerology
        const result = calculateNumerology(input);

        // Step 3: Get AI analysis
        const prompt = getNumerologyAnalysisPrompt(result, input);

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Bạn là một chuyên gia Thần Số Học (Numerology) hàng đầu với kiến thức sâu rộng về hệ thống Pythagorean. Hãy phân tích chi tiết và đưa ra những lời khuyên thiết thực." },
            { role: "user", content: prompt },
          ],
        });

        const analysis = String(response.choices[0]?.message?.content || "");

        // Step 4: Save to cache
        if (db) {
          try {
            await db.insert(numerologyCache).values({
              fullName: input.fullName,
              birthDate: input.birthDate,
              year: birthYear,
              lifePathNumber: result.lifePathNumber,
              soulNumber: result.soulNumber,
              personalityNumber: result.personalityNumber,
              destinyNumber: result.destinyNumber,
              birthDayNumber: result.birthDayNumber,
              birthChart: result.birthChart,
              aiAnalysis: analysis,
            });
            console.log(`💾 Cached numerology analysis for ${input.fullName} ${input.birthDate}`);
          } catch (error) {
            console.error("Failed to cache numerology analysis:", error);
          }
        }

        // Step 5: Save to history if user is logged in
        if (ctx.user && db) {
          await db.insert(numerologyReadings).values({
            userId: ctx.user.id,
            fullName: input.fullName,
            birthDate: input.birthDate,
            lifePathNumber: result.lifePathNumber,
            soulNumber: result.soulNumber,
            personalityNumber: result.personalityNumber,
            destinyNumber: result.destinyNumber,
            birthDayNumber: result.birthDayNumber,
            birthChart: result.birthChart,
            aiAnalysis: analysis,
          });
        }

        return { result, analysis, meanings: NUMBER_MEANINGS, cached: false };
      }),

    // Get user's numerology history
    history: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const readings = await db
        .select()
        .from(numerologyReadings)
        .where(eq(numerologyReadings.userId, ctx.user.id))
        .orderBy(desc(numerologyReadings.createdAt))
        .limit(20);

      return readings;
    }),

    // Delete a numerology reading
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Verify ownership
        const reading = await db
          .select()
          .from(numerologyReadings)
          .where(eq(numerologyReadings.id, input.id))
          .limit(1);

        if (!reading.length || reading[0].userId !== ctx.user.id) {
          throw new Error("Reading not found or unauthorized");
        }

        await db.delete(numerologyReadings).where(eq(numerologyReadings.id, input.id));
        return { success: true };
      }),

    // Get number meanings
    meanings: publicProcedure.query(() => NUMBER_MEANINGS),

    // Chat with AI about numerology results
    chat: publicProcedure
      .input(z.object({
        // User biography context
        fullName: z.string(),
        birthDate: z.string(),
        numerologyContext: z.object({
          lifePathNumber: z.number(),
          soulNumber: z.number(),
          personalityNumber: z.number(),
          destinyNumber: z.number(),
          birthDayNumber: z.number(),
          pinnacles: z.array(z.number()),
          challenges: z.array(z.number()),
          personalYear: z.number(),
        }),
        // Conversation history
        messages: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })),
        // The new question
        question: z.string().min(1).max(1000),
      }))
      .mutation(async ({ input }) => {
        const { fullName, birthDate, numerologyContext, messages, question } = input;

        const systemPrompt = `Bạn là một chuyên gia Thần Số Học (Pythagorean Numerology) người Việt Nam, tên là "Số Học AI". Bạn đang tư vấn trực tiếp cho ${fullName} (sinh ngày ${birthDate}).

DỮ LIỆU THẦN SỐ HỌC CỦA HỌ:
- Số Chủ Đạo (Life Path): ${numerologyContext.lifePathNumber}
- Số Linh Hồn (Soul): ${numerologyContext.soulNumber}
- Số Nhân Cách (Personality): ${numerologyContext.personalityNumber}
- Số Sứ Mệnh (Destiny/Expression): ${numerologyContext.destinyNumber}
- Số Ngày Sinh: ${numerologyContext.birthDayNumber}
- Năm Cá Nhân Hiện Tại: ${numerologyContext.personalYear}
- 4 Đỉnh Cao (Pinnacles): ${numerologyContext.pinnacles.join(', ')}
- 4 Thách Thức (Challenges): ${numerologyContext.challenges.join(', ')}

HƯỚNG DẪN TRẢ LỜI:
- Luôn dựa vào dữ liệu thần số học ở trên để cá nhân hóa câu trả lời cho ${fullName}
- Trả lời bằng tiếng Việt, giọng văn thân thiện, sâu sắc và thiết thực
- Nếu câu hỏi liên quan đến một con số, hãy giải thích ý nghĩa con số đó trong ngữ cảnh của người dùng
- Độ dài câu trả lời phù hợp với câu hỏi: câu hỏi đơn giản thì trả lời ngắn gọn, câu hỏi phức tạp thì phân tích sâu
- Không bịa đặt thông tin, luôn bám vào nguyên lý Thần Số Học chính thống`;

        const chatHistory = messages.map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            ...chatHistory,
            { role: "user", content: question },
          ],
        });

        const answer = String(response.choices[0]?.message?.content || "");
        return { answer };
      }),
  }),

  // Zodiac Router
  zodiac: router({
    // Get zodiac from year
    fromYear: publicProcedure
      .input(z.object({ year: z.number() }))
      .query(({ input }) => {
        const animal = getZodiacFromYear(input.year);
        const element = getElementFromYear(input.year);
        return {
          animal,
          element,
          vietnameseName: ZODIAC_VIETNAMESE[animal],
        };
      }),

    // Get 2026 forecast
    forecast: publicProcedure
      .input(zodiacInputSchema)
      .mutation(async ({ input }) => {
        const db = await getDb();

        // Step 1: Check cache
        if (db) {
          const cached = await db
            .select()
            .from(zodiacCache)
            .where(
              and(
                eq(zodiacCache.animal, input.animal),
                eq(zodiacCache.year, input.year)
              )
            )
            .limit(1);

          if (cached.length > 0) {
            console.log(`🎯 Cache HIT for zodiac: ${input.animal} ${input.year}`);
            return {
              animal: input.animal,
              vietnameseName: ZODIAC_VIETNAMESE[input.animal],
              year: input.year,
              forecast: cached[0].content,
              cached: true
            };
          }
          console.log(`❌ Cache MISS for zodiac: ${input.animal} ${input.year}`);
        }

        const prompt = getZodiacForecastPrompt(input.animal, input.year);

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Bạn là một chuyên gia phong thủy và tử vi hàng đầu Việt Nam. Hãy dự báo vận mệnh chi tiết và thiết thực." },
            { role: "user", content: prompt },
          ],
        });

        const forecast = String(response.choices[0]?.message?.content || "");

        // Step 2: Save to cache
        if (db) {
          try {
            await db.insert(zodiacCache).values({
              animal: input.animal,
              year: input.year,
              content: forecast,
            });
            console.log(`💾 Cached zodiac forecast for ${input.animal} ${input.year}`);
          } catch (error) {
            console.error("Failed to cache zodiac forecast:", error);
          }
        }

        return {
          animal: input.animal,
          vietnameseName: ZODIAC_VIETNAMESE[input.animal],
          year: input.year,
          forecast: forecast,
          cached: false
        };
      }),

    // Get all zodiac names
    list: publicProcedure.query(() => {
      return Object.entries(ZODIAC_VIETNAMESE).map(([key, value]) => ({
        id: key,
        name: value,
      }));
    }),
  }),

  // Auspicious Dates Router
  auspicious: router({
    // Get auspicious dates
    getDates: publicProcedure
      .input(auspiciousDateInputSchema)
      .mutation(async ({ input }) => {
        const prompt = getAuspiciousDatesPrompt(input);

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Bạn là một chuyên gia phong thủy và lịch vạn niên. Hãy chọn ngày tốt chính xác và giải thích rõ ràng." },
            { role: "user", content: prompt },
          ],
        });

        return {
          purpose: input.purpose,
          dateRange: { start: input.startDate, end: input.endDate },
          result: response.choices[0]?.message?.content || "",
        };
      }),
  }),

  // Lunar New Year Tools Router
  tet: router({
    // Xông đất recommendations
    xongDat: publicProcedure
      .input(xongDatInputSchema)
      .mutation(async ({ input }) => {
        const db = await getDb();
        const CURRENT_YEAR = 2026;

        // Step 1: Check cache
        if (db) {
          const cached = await db
            .select()
            .from(tetCache)
            .where(
              and(
                eq(tetCache.functionName, 'xongDat'),
                eq(tetCache.birthYear, input.ownerBirthYear),
                eq(tetCache.year, CURRENT_YEAR)
              )
            )
            .limit(1);

          if (cached.length > 0) {
            console.log(`🎯 Cache HIT for xongDat: ${input.ownerBirthYear}`);
            const cachedData = cached[0].data as any;
            return {
              ...cachedData,
              aiAdvice: cached[0].aiAdvice,
              cached: true
            };
          }
          console.log(`❌ Cache MISS for xongDat: ${input.ownerBirthYear}`);
        }

        const result = calculateXongDat(input);
        const prompt = getXongDatPrompt(input, result);

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Bạn là một chuyên gia phong thủy. Hãy tư vấn về xông đất một cách chi tiết và dễ hiểu." },
            { role: "user", content: prompt },
          ],
        });

        const aiAdvice = String(response.choices[0]?.message?.content || "");
        const ownerZodiac = ZODIAC_VIETNAMESE[getZodiacFromYear(input.ownerBirthYear)];
        const ownerElement = getElementFromYear(input.ownerBirthYear);

        const fullResult = {
          ...result,
          ownerZodiac,
          ownerElement,
        };

        // Step 2: Save to cache
        if (db) {
          try {
            await db.insert(tetCache).values({
              functionName: 'xongDat',
              birthYear: input.ownerBirthYear,
              year: CURRENT_YEAR,
              data: fullResult,
              aiAdvice: aiAdvice,
            });
            console.log(`💾 Cached xongDat for ${input.ownerBirthYear}`);
          } catch (error) {
            console.error("Failed to cache xongDat:", error);
          }
        }

        return {
          ...fullResult,
          aiAdvice,
          cached: false
        };
      }),

    // Lucky colors
    luckyColors: publicProcedure
      .input(luckyColorInputSchema)
      .query(({ input }) => {
        const result = calculateLuckyColors(input);
        return {
          ...result,
          zodiac: ZODIAC_VIETNAMESE[getZodiacFromYear(input.birthYear)],
        };
      }),

    // Lucky money suggestions
    luckyMoney: publicProcedure
      .input(luckyMoneyInputSchema)
      .query(({ input }) => {
        const result = calculateLuckyMoney(input);
        return {
          ...result,
          zodiac: ZODIAC_VIETNAMESE[getZodiacFromYear(input.recipientBirthYear)],
        };
      }),

    // Combined Tết tools with AI advice
    fullAdvice: publicProcedure
      .input(z.object({ birthYear: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        const CURRENT_YEAR = 2026;

        // Step 1: Check cache
        if (db) {
          const cached = await db
            .select()
            .from(tetCache)
            .where(
              and(
                eq(tetCache.functionName, 'fullAdvice'),
                eq(tetCache.birthYear, input.birthYear),
                eq(tetCache.year, CURRENT_YEAR)
              )
            )
            .limit(1);

          if (cached.length > 0) {
            console.log(`🎯 Cache HIT for fullAdvice: ${input.birthYear}`);
            const cachedData = cached[0].data as any;
            return {
              ...cachedData,
              aiAdvice: cached[0].aiAdvice,
              cached: true
            };
          }
          console.log(`❌ Cache MISS for fullAdvice: ${input.birthYear}`);
        }

        const luckyColors = calculateLuckyColors(input);
        const luckyMoney = calculateLuckyMoney({ recipientBirthYear: input.birthYear });
        const prompt = getLunarNewYearPrompt(luckyColors, luckyMoney, input.birthYear);

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Bạn là một chuyên gia phong thủy. Hãy tư vấn về các công cụ Tết một cách vui vẻ và thiết thực." },
            { role: "user", content: prompt },
          ],
        });

        const aiAdvice = String(response.choices[0]?.message?.content || "");
        const zodiac = ZODIAC_VIETNAMESE[getZodiacFromYear(input.birthYear)];
        const element = getElementFromYear(input.birthYear);

        const fullResult = {
          luckyColors,
          luckyMoney,
          zodiac,
          element,
        };

        // Step 2: Save to cache
        if (db) {
          try {
            await db.insert(tetCache).values({
              functionName: 'fullAdvice',
              birthYear: input.birthYear,
              year: CURRENT_YEAR,
              data: fullResult,
              aiAdvice: aiAdvice,
            });
            console.log(`💾 Cached fullAdvice for ${input.birthYear}`);
          } catch (error) {
            console.error("Failed to cache fullAdvice:", error);
          }
        }

        return {
          ...fullResult,
          aiAdvice,
          cached: false
        };
      }),
  }),

  // Admin LLM Settings Router
  admin: router({
    // Get current LLM settings (admin only)
    getLLMSettings: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) return null;

      const settings = await db
        .select()
        .from(llmSettings)
        .where(eq(llmSettings.isActive, true))
        .limit(1);

      return settings[0] || null;
    }),

    // Update LLM settings (admin only)
    updateLLMSettings: protectedProcedure
      .input(llmSettingsSchema)
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Deactivate all existing settings
        await db.update(llmSettings).set({ isActive: false });

        // Insert new settings
        await db.insert(llmSettings).values({
          baseUrl: input.baseUrl,
          model: input.model,
          apiKey: input.apiKey,
          isActive: true,
        });

        // Clear cache so new settings take effect immediately
        clearLLMSettingsCache();

        return { success: true };
      }),

    // Test LLM connection (admin only)
    testLLMConnection: protectedProcedure
      .input(llmSettingsSchema)
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        try {
          const response = await fetch(`${input.baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${input.apiKey}`,
            },
            body: JSON.stringify({
              model: input.model,
              messages: [{ role: "user", content: "Say hello" }],
              max_tokens: 10,
            }),
          });

          if (!response.ok) {
            const error = await response.text();
            return { success: false, error: `API Error: ${response.status} - ${error}` };
          }

          const data = await response.json();
          return {
            success: true,
            message: "Kết nối thành công!",
            response: data.choices?.[0]?.message?.content || "OK"
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "Kết nối thất bại"
          };
        }
      }),

    // Delete LLM settings (reset to default)
    deleteLLMSettings: protectedProcedure
      .mutation(async ({ ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Deactivate all settings
        await db.update(llmSettings).set({ isActive: false });

        // Clear cache so default settings take effect immediately
        clearLLMSettingsCache();

        return { success: true };
      }),

    // Get Tu Vi cache statistics (admin only)
    getCacheStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) return null;

      const [tuviEntries, numerologyEntries, zodiacEntries, tetEntries] = await Promise.all([
        db.select().from(tuviCache),
        db.select().from(numerologyCache),
        db.select().from(zodiacCache),
        db.select().from(tetCache),
      ]);

      // Group by year (Tu Vi)
      const byYear: Record<number, number> = {};
      tuviEntries.forEach((entry) => {
        byYear[entry.year] = (byYear[entry.year] || 0) + 1;
      });

      // Count palace analyses
      let totalPalaceAnalyses = 0;
      const palaceCount: Record<string, number> = {};
      tuviEntries.forEach((entry) => {
        if (entry.palaceAnalyses) {
          const analyses = entry.palaceAnalyses as Record<string, string>;
          Object.keys(analyses).forEach((palaceName) => {
            totalPalaceAnalyses++;
            palaceCount[palaceName] = (palaceCount[palaceName] || 0) + 1;
          });
        }
      });

      // Tet stats breakdown
      const tetFunctionCount: Record<string, number> = {};
      tetEntries.forEach((entry) => {
        tetFunctionCount[entry.functionName] = (tetFunctionCount[entry.functionName] || 0) + 1;
      });

      return {
        // Tu Vi Stats
        totalEntries: tuviEntries.length,
        totalPalaceAnalyses,
        byYear,
        palaceCount,
        recentEntries: tuviEntries
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10)
          .map(e => ({
            birthDate: e.birthDate,
            birthHour: e.birthHour,
            gender: e.gender,
            year: e.year,
            palaceAnalysesCount: e.palaceAnalyses ? Object.keys(e.palaceAnalyses as Record<string, string>).length : 0,
            createdAt: e.createdAt,
          })),

        // Other Caches Stats
        numerology: {
          total: numerologyEntries.length,
        },
        zodiac: {
          total: zodiacEntries.length,
        },
        tet: {
          total: tetEntries.length,
          byFunction: tetFunctionCount,
        }
      };
    }),

    // Clear Tu Vi cache (admin only)
    clearCache: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Delete all cache entries
      await db.delete(tuviCache);

      return { success: true, message: "Cache đã được xóa thành công!" };
    }),
  }),

  // Stars Router
  stars: router({
    getAll: publicProcedure
      .query(async () => {
        const db = await getDb();
        if (!db) return [];
        return await db.select().from(tuviStars);
      }),

    getByName: publicProcedure
      .input(z.object({ name: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;
        const result = await db
          .select()
          .from(tuviStars)
          .where(eq(tuviStars.vietnameseName, input.name))
          .limit(1);
        return result[0] || null;
      }),
  }),

  // Compatibility Router
  compatibility: router({
    // Calculate compatibility between two people
    calculate: publicProcedure
      .input(z.object({
        person1: z.object({
          fullName: z.string().min(1),
          birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        }),
        person2: z.object({
          fullName: z.string().min(1),
          birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        }),
      }))
      .mutation(async ({ input }) => {
        const result = calculateCompatibility(input.person1, input.person2);
        return result;
      }),

    // Get AI analysis for compatibility
    analyze: publicProcedure
      .input(z.object({
        person1: z.object({
          fullName: z.string().min(1),
          birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        }),
        person2: z.object({
          fullName: z.string().min(1),
          birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        }),
      }))
      .mutation(async ({ input }) => {
        const result = calculateCompatibility(input.person1, input.person2);
        const prompt = getCompatibilityAnalysisPrompt(result);

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Bạn là chuyên gia tử vi và thần số học Việt Nam với hơn 30 năm kinh nghiệm. Hãy phân tích chi tiết và đưa ra lời khuyên hữu ích." },
            { role: "user", content: prompt },
          ],
        });

        const analysis = response.choices[0]?.message?.content || "";
        return { result, analysis };
      }),
  }),
});

export type AppRouter = typeof appRouter;
