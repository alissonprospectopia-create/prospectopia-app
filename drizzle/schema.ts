import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "employee"]).default("user").notNull(),
  photo: text("photo"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Projetos
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 64 }).notNull(),
  ownerId: int("ownerId").notNull(),
  scope: text("scope"),
  objectives: text("objectives"),
  deliverables: text("deliverables"),
  contract: text("contract"),
  status: mysqlEnum("status", ["active", "inactive", "completed"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// Funcionários (Employees)
export const employees = mysqlTable("employees", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  photo: text("photo"),
  specialties: text("specialties"),
  qualities: text("qualities"),
  pomodoroWorkTime: int("pomodoroWorkTime").default(25).notNull(),
  pomodoroRestTime: int("pomodoroRestTime").default(5).notNull(),
  currentProjectId: int("currentProjectId"),
  status: mysqlEnum("status", ["inactive", "project", "rest", "meeting"]).default("inactive").notNull(),
  stateStartTime: timestamp("stateStartTime"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;

// Tarefas
export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  description: text("description").notNull(),
  createdBy: int("createdBy").notNull(),
  deadline: timestamp("deadline"),
  status: mysqlEnum("status", ["pending", "completed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

// Notas Automáticas
export const notes = mysqlTable("notes", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  type: mysqlEnum("type", ["project", "rest", "meeting"]).notNull(),
  projectId: int("projectId"),
  deadline: timestamp("deadline"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Note = typeof notes.$inferSelect;
export type InsertNote = typeof notes.$inferInsert;

// Links de Convite
export const inviteLinks = mysqlTable("inviteLinks", {
  id: int("id").autoincrement().primaryKey(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdBy: int("createdBy").notNull(),
  usedBy: int("usedBy"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InviteLink = typeof inviteLinks.$inferSelect;
export type InsertInviteLink = typeof inviteLinks.$inferInsert;