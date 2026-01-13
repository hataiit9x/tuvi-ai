import "dotenv/config";

console.log("🔍 Debugging Tuvi AI Web Server...");
console.log("📋 Environment Variables:");
console.log("- NODE_ENV:", process.env.NODE_ENV);
console.log("- PORT:", process.env.PORT);
console.log("- DATABASE_URL:", process.env.DATABASE_URL ? "✅ Set" : "❌ Missing");
console.log("- JWT_SECRET:", process.env.JWT_SECRET ? "✅ Set" : "❌ Missing");

// Test database connection
async function testDatabase() {
  try {
    console.log("\n🗄️ Testing database connection...");
    const { getDb } = await import("./db");
    const db = await getDb();

    if (db) {
      console.log("✅ Database connection successful");

      // Test a simple query
      const result = await db.execute("SELECT 1 as test");
      console.log("✅ Database query test passed");
    } else {
      console.log("❌ Database connection failed");
    }
  } catch (error) {
    console.log("❌ Database error:", (error as any).message);
  }
}

// Test imports
async function testImports() {
  try {
    console.log("\n📦 Testing imports...");

    await import("./routers");
    console.log("✅ Router import successful");

    await import("./services/tuvi");
    console.log("✅ Tuvi service import successful");

    await import("./services/numerology");
    console.log("✅ Numerology service import successful");

    await import("./services/fortune");
    console.log("✅ Fortune service import successful");

    await import("./services/compatibility");
    console.log("✅ Compatibility service import successful");

  } catch (error) {
    console.log("❌ Import error:", (error as any).message);
    console.log("Stack:", (error as any).stack);
  }
}

// Test server startup
async function testServer() {
  try {
    console.log("\n🚀 Testing server startup...");

    const express = await import("express");
    const app = express.default();

    console.log("✅ Express app created");

    const { appRouter } = await import("./routers");
    console.log("✅ App router loaded");

    const { createContext } = await import("./_core/context");
    console.log("✅ Context creator loaded");

  } catch (error) {
    console.log("❌ Server startup error:", (error as any).message);
    console.log("Stack:", (error as any).stack);
  }
}

async function runDiagnostics() {
  await testImports();
  await testDatabase();
  await testServer();
  console.log("\n🏁 Diagnostics complete!");
}

runDiagnostics().catch(console.error);
