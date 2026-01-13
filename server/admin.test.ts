import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("admin.getLLMSettings", () => {
  it("allows admin to get LLM settings", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Should not throw for admin
    const result = await caller.admin.getLLMSettings();
    // Result can be null if no settings exist
    expect(result === null || typeof result === "object").toBe(true);
  });

  it("rejects non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.getLLMSettings()).rejects.toThrow("Unauthorized");
  });
});

describe("admin.updateLLMSettings", () => {
  it("rejects non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.admin.updateLLMSettings({
        baseUrl: "https://api.openai.com/v1",
        model: "gpt-4",
        apiKey: "sk-test",
      })
    ).rejects.toThrow("Unauthorized");
  });

  it("validates input schema", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Invalid URL should fail validation
    await expect(
      caller.admin.updateLLMSettings({
        baseUrl: "not-a-url",
        model: "gpt-4",
        apiKey: "sk-test",
      })
    ).rejects.toThrow();
  });
});

describe("admin.testLLMConnection", () => {
  it("rejects non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.admin.testLLMConnection({
        baseUrl: "https://api.openai.com/v1",
        model: "gpt-4",
        apiKey: "sk-test",
      })
    ).rejects.toThrow("Unauthorized");
  });
});

describe("admin.deleteLLMSettings", () => {
  it("rejects non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.deleteLLMSettings()).rejects.toThrow("Unauthorized");
  });
});
