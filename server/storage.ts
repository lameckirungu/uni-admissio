import { db } from "@db";
import { 
  users, 
  profiles, 
  applications, 
  documents, 
  InsertUser, 
  User, 
  Application,
  Document
} from "@shared/schema";
import { and, eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "@db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  sessionStore: session.Store;
  // User methods
  createUser(userData: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  
  // Application methods
  createApplication(userId: number, formData: any): Promise<Application>;
  getApplicationByUserId(userId: number): Promise<Application | undefined>;
  updateApplication(id: number, formData: any): Promise<Application | undefined>;
  updateApplicationStatus(id: number, status: string): Promise<Application | undefined>;
  getApplications(filters?: { status?: string }): Promise<Application[]>;
  
  // Document methods
  uploadDocument(data: { applicationId: number, documentType: string, fileName: string, storagePath: string }): Promise<Document>;
  getDocumentsByApplicationId(applicationId: number): Promise<Document[]>;
  verifyDocument(id: number): Promise<Document | undefined>;
}

class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      tableName: 'user_sessions',
      createTableIfMissing: true 
    });
  }

  // User methods
  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  // Application methods
  async createApplication(userId: number, formData: any): Promise<Application> {
    const [application] = await db.insert(applications)
      .values({
        userId,
        formData,
        status: 'draft'
      })
      .returning();
    return application;
  }

  async getApplicationByUserId(userId: number): Promise<Application | undefined> {
    // Query to get the most recent application for a specific user
    const result = await db.select()
      .from(applications)
      .where(eq(applications.userId, userId))
      .orderBy(applications.updatedAt) // Order by updatedAt
      .limit(1); // Only get one result
    
    return result.length > 0 ? result[0] : undefined;
  }

  async updateApplication(id: number, formData: any): Promise<Application | undefined> {
    const [application] = await db.update(applications)
      .set({
        formData,
        updatedAt: new Date()
      })
      .where(eq(applications.id, id))
      .returning();
    return application;
  }

  async updateApplicationStatus(id: number, status: string): Promise<Application | undefined> {
    const updates: any = { status, updatedAt: new Date() };
    
    // If status is 'submitted', also update the submission date
    if (status === 'submitted') {
      updates.submittedAt = new Date();
    }
    
    const [application] = await db.update(applications)
      .set(updates)
      .where(eq(applications.id, id))
      .returning();
    return application;
  }

  async getApplications(filters?: { status?: string }): Promise<Application[]> {
    // Create a base query first
    let baseQuery = db.select().from(applications);
    
    // Apply filter conditions if provided
    if (filters?.status) {
      baseQuery = baseQuery.where(eq(applications.status, filters.status));
    }
    
    // Execute the query with ordering
    return await baseQuery.orderBy(applications.updatedAt);
  }

  // Document methods
  async uploadDocument(data: { applicationId: number, documentType: string, fileName: string, storagePath: string }): Promise<Document> {
    const [document] = await db.insert(documents)
      .values(data)
      .returning();
    return document;
  }

  async getDocumentsByApplicationId(applicationId: number): Promise<Document[]> {
    return await db.select()
      .from(documents)
      .where(eq(documents.applicationId, applicationId));
  }

  async verifyDocument(id: number): Promise<Document | undefined> {
    const [document] = await db.update(documents)
      .set({ verified: true })
      .where(eq(documents.id, id))
      .returning();
    return document;
  }
}

export const storage = new DatabaseStorage();
