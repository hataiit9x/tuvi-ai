import { drizzle } from "drizzle-orm/mysql2";
import { tuviStars } from "../../drizzle/schema";
import { TUVI_STARS_SEED } from "./tuvi-stars";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL!);

async function seedStars() {
  try {
    console.log("Starting to seed Tử Vi stars...");
    
    // Insert stars
    for (const star of TUVI_STARS_SEED) {
      await db.insert(tuviStars).values(star as any).onDuplicateKeyUpdate({
        set: {
          chineseName: star.chineseName,
          nature: star.nature as any,
          meaning: star.meaning,
          description: star.description,
          influence: star.influence,
          palaceInfluence: star.palaceInfluence as any,
          remedy: star.remedy,
          compatibility: star.compatibility as any,
        },
      });
    }
    
    console.log(`✓ Successfully seeded ${TUVI_STARS_SEED.length} Tử Vi stars!`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding stars:", error);
    process.exit(1);
  }
}

seedStars();
