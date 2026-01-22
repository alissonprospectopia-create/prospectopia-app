import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { nanoid } from "nanoid";

const MANAGER_PASSWORD = "520741";

const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
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
    validateManagerPassword: publicProcedure
      .input(z.object({ password: z.string() }))
      .mutation(({ input }) => {
        return { isValid: input.password === MANAGER_PASSWORD };
      }),
  }),

  // Funcionários (Employees)
  employee: router({
    getMe: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
      return await db.getEmployeeByUserId(ctx.user.id);
    }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        photo: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
        
        const result = await db.createEmployee({
          userId: ctx.user.id,
          name: input.name,
          photo: input.photo,
          pomodoroWorkTime: 25,
          pomodoroRestTime: 5,
          status: "inactive",
        });
        
        return result;
      }),

    updateSettings: protectedProcedure
      .input(z.object({
        pomodoroWorkTime: z.number().optional(),
        pomodoroRestTime: z.number().optional(),
        specialties: z.string().optional(),
        qualities: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
        const employee = await db.getEmployeeByUserId(ctx.user.id);
        if (!employee) throw new TRPCError({ code: "NOT_FOUND" });
        
        await db.updateEmployee(employee.id, input);
        return { success: true };
      }),

    getAll: adminProcedure.query(async () => {
      return await db.getAllEmployees();
    }),

    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getEmployeeById(input.id);
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        status: z.enum(["inactive", "project", "rest", "meeting"]),
        projectId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
        const employee = await db.getEmployeeByUserId(ctx.user.id);
        if (!employee) throw new TRPCError({ code: "NOT_FOUND" });
        
        await db.updateEmployee(employee.id, {
          status: input.status,
          currentProjectId: input.projectId,
          stateStartTime: new Date(),
        });
        return { success: true };
      }),
  }),

  // Projetos
  project: router({
    getAll: protectedProcedure.query(async () => {
      return await db.getAllProjects();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getProjectById(input.id);
      }),

    create: adminProcedure
      .input(z.object({
        name: z.string(),
        type: z.string(),
        scope: z.string().optional(),
        objectives: z.string().optional(),
        deliverables: z.string().optional(),
        contract: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
        
        await db.createProject({
          name: input.name,
          type: input.type,
          ownerId: ctx.user.id,
          scope: input.scope,
          objectives: input.objectives,
          deliverables: input.deliverables,
          contract: input.contract,
          status: "active",
        });
        
        return { success: true };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        type: z.string().optional(),
        scope: z.string().optional(),
        objectives: z.string().optional(),
        deliverables: z.string().optional(),
        contract: z.string().optional(),
        status: z.enum(["active", "inactive", "completed"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const project = await db.getProjectById(input.id);
        if (!project) throw new TRPCError({ code: "NOT_FOUND" });
        
        const updateData: any = {};
        if (input.name !== undefined) updateData.name = input.name;
        if (input.type !== undefined) updateData.type = input.type;
        if (input.scope !== undefined) updateData.scope = input.scope;
        if (input.objectives !== undefined) updateData.objectives = input.objectives;
        if (input.deliverables !== undefined) updateData.deliverables = input.deliverables;
        if (input.contract !== undefined) updateData.contract = input.contract;
        if (input.status !== undefined) updateData.status = input.status;
        
        await db.updateProject(input.id, updateData);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const project = await db.getProjectById(input.id);
        if (!project) throw new TRPCError({ code: "NOT_FOUND" });
        
        await db.deleteProject(input.id);
        return { success: true };
      }),
  }),

  // Tarefas
  task: router({
    getByProjectId: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await db.getTasksByProjectId(input.projectId);
      }),

    create: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        description: z.string(),
        deadline: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
        
        await db.createTask({
          projectId: input.projectId,
          description: input.description,
          createdBy: ctx.user.id,
          deadline: input.deadline,
          status: "pending",
        });
        
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "completed"]).optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const updateData: any = {};
        if (input.status !== undefined) updateData.status = input.status;
        if (input.description !== undefined) updateData.description = input.description;
        
        await db.updateTask(input.id, updateData);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteTask(input.id);
        return { success: true };
      }),
  }),

  // Notas
  note: router({
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        content: z.string().optional(),
        type: z.enum(["project", "rest", "meeting"]),
        projectId: z.number().optional(),
        deadline: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
        const employee = await db.getEmployeeByUserId(ctx.user.id);
        if (!employee) throw new TRPCError({ code: "NOT_FOUND" });
        
        await db.createNote({
          employeeId: employee.id,
          title: input.title,
          content: input.content,
          type: input.type,
          projectId: input.projectId,
          deadline: input.deadline || new Date(new Date().setHours(18, 0, 0, 0)),
        });
        
        return { success: true };
      }),

    getByEmployeeId: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
      const employee = await db.getEmployeeByUserId(ctx.user.id);
      if (!employee) return [];
      
      return await db.getNotesByEmployeeId(employee.id);
    }),
  }),

  // Links de Convite
  invite: router({
    generate: adminProcedure.mutation(async ({ ctx }) => {
      if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
      
      const token = nanoid(32);
      const result = await db.createInviteLink({
        token,
        createdBy: ctx.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
      
      return {
        token,
        link: `/invite/${token}`,
      };
    }),

    validate: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const link = await db.getInviteLinkByToken(input.token);
        if (!link) return { isValid: false };
        
        const now = new Date();
        const isExpired = link.expiresAt && link.expiresAt < now;
        const isUsed = link.usedBy !== null;
        
        return { isValid: !isExpired && !isUsed };
      }),

    use: publicProcedure
      .input(z.object({
        token: z.string(),
        userId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const link = await db.getInviteLinkByToken(input.token);
        if (!link) throw new TRPCError({ code: "NOT_FOUND" });
        
        const now = new Date();
        const isExpired = link.expiresAt && link.expiresAt < now;
        const isUsed = link.usedBy !== null;
        
        if (isExpired || isUsed) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Link inválido ou expirado" });
        }
        
        await db.updateInviteLink(link.id, { usedBy: input.userId });
        return { success: true };
      }),
  }),

  // Dashboard
  dashboard: router({
    getStats: adminProcedure.query(async () => {
      const allProjects = await db.getAllProjects();
      const allEmployees = await db.getAllEmployees();
      const activeProjects = allProjects.filter(p => p.status === "active");
      const activeEmployees = allEmployees.filter(e => e.status !== "inactive");
      
      return {
        totalProjects: allProjects.length,
        activeProjects: activeProjects.length,
        totalEmployees: allEmployees.length,
        activeEmployees: activeEmployees.length,
      };
    }),

    getEmployeeStats: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
      const employee = await db.getEmployeeByUserId(ctx.user.id);
      if (!employee) return null;
      
      const projects = await db.getAllProjects();
      const tasks = employee.currentProjectId 
        ? await db.getTasksByProjectId(employee.currentProjectId)
        : [];
      
      return {
        employee,
        currentProject: employee.currentProjectId 
          ? projects.find(p => p.id === employee.currentProjectId)
          : null,
        pendingTasks: tasks.filter(t => t.status === "pending").length,
        completedTasks: tasks.filter(t => t.status === "completed").length,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
