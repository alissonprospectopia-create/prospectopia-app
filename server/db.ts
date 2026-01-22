import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, employees, projects, tasks, notes, inviteLinks, InsertProject, InsertTask, InsertNote, InsertInviteLink } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Employees
export async function getEmployeeByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(employees).where(eq(employees.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createEmployee(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(employees).values(data);
  return result;
}

export async function updateEmployee(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(employees).set(data).where(eq(employees.id, id));
}

export async function getAllEmployees() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(employees);
}

export async function getEmployeeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Projects
export async function getAllProjects() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(projects);
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProject(data: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(projects).values(data);
  return result;
}

export async function updateProject(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(projects).set(data).where(eq(projects.id, id));
}

export async function deleteProject(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(projects).where(eq(projects.id, id));
}

// Tasks
export async function getTasksByProjectId(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tasks).where(eq(tasks.projectId, projectId));
}

export async function createTask(data: InsertTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tasks).values(data);
  return result;
}

export async function updateTask(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(tasks).set(data).where(eq(tasks.id, id));
}

export async function deleteTask(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(tasks).where(eq(tasks.id, id));
}

// Notes
export async function createNote(data: InsertNote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(notes).values(data);
  return result;
}

export async function getNotesByEmployeeId(employeeId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notes).where(eq(notes.employeeId, employeeId));
}

// Invite Links
export async function createInviteLink(data: InsertInviteLink) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(inviteLinks).values(data);
  return result;
}

export async function getInviteLinkByToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(inviteLinks).where(eq(inviteLinks.token, token)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateInviteLink(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(inviteLinks).set(data).where(eq(inviteLinks.id, id));
}
