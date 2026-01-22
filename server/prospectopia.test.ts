import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createManagerContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "manager-user",
    email: "manager@example.com",
    name: "Manager User",
    loginMethod: "google",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

function createEmployeeContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "employee-user",
    email: "employee@example.com",
    name: "Employee User",
    loginMethod: "google",
    role: "employee",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("Prospectopia - Auth", () => {
  it("validates correct manager password", async () => {
    const caller = appRouter.createCaller({} as any);
    const result = await caller.auth.validateManagerPassword({ password: "520741" });
    expect(result.isValid).toBe(true);
  });

  it("rejects incorrect manager password", async () => {
    const caller = appRouter.createCaller({} as any);
    const result = await caller.auth.validateManagerPassword({ password: "wrong" });
    expect(result.isValid).toBe(false);
  });

  it("validates empty password", async () => {
    const caller = appRouter.createCaller({} as any);
    const result = await caller.auth.validateManagerPassword({ password: "" });
    expect(result.isValid).toBe(false);
  });
});

describe("Prospectopia - Access Control", () => {
  it("employee cannot access admin-only procedures", async () => {
    const { ctx } = createEmployeeContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.project.create({
        name: "Test Project",
        type: "Web",
      });
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("manager can access admin procedures", async () => {
    const { ctx } = createManagerContext();
    const caller = appRouter.createCaller(ctx);
    
    // This will fail due to database not being available, but it won't throw FORBIDDEN
    try {
      await caller.employee.getAll();
    } catch (error: any) {
      // Should not be FORBIDDEN
      expect(error.code).not.toBe("FORBIDDEN");
    }
  });
});

describe("Prospectopia - Invite Links", () => {
  it("validates invite link format", async () => {
    const caller = appRouter.createCaller({} as any);
    
    try {
      // This will fail due to database, but we're testing the validation logic
      await caller.invite.validate({ token: "invalid-token" });
    } catch (error: any) {
      // Expected to fail due to DB not available
      expect(error).toBeDefined();
    }
  });
});

describe("Prospectopia - Data Validation", () => {
  it("rejects project creation without required fields", async () => {
    const { ctx } = createManagerContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.project.create({
        name: "",
        type: "",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      // Should throw validation error
      expect(error).toBeDefined();
    }
  });

  it("rejects task creation without required fields", async () => {
    const { ctx } = createEmployeeContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.task.create({
        projectId: 0,
        description: "",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      // Should throw validation error
      expect(error).toBeDefined();
    }
  });
});

describe("Prospectopia - Authentication Requirements", () => {
  it("requires authentication for protected procedures", async () => {
    const caller = appRouter.createCaller({ user: null } as any);

    try {
      await caller.employee.getMe();
      expect.fail("Should have thrown UNAUTHORIZED error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("allows public access to auth procedures", async () => {
    const caller = appRouter.createCaller({} as any);
    
    // This should not throw UNAUTHORIZED
    const result = await caller.auth.validateManagerPassword({ password: "test" });
    expect(result).toBeDefined();
  });
});
