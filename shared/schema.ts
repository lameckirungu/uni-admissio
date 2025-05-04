import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table (authentication)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("student"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// User profiles with additional information
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  fullName: text("full_name"),
  email: text("email"),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Applications table
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  status: text("status").notNull().default("draft"),
  formData: jsonb("form_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  submittedAt: timestamp("submitted_at")
});

// Documents table for file uploads
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applications.id).notNull(),
  documentType: text("document_type").notNull(),
  fileName: text("file_name").notNull(),
  storagePath: text("storage_path").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  verified: boolean("verified").default(false)
});

// Define relationships
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  applications: many(applications)
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] })
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  user: one(users, { fields: [applications.userId], references: [users.id] }),
  documents: many(documents)
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  application: one(applications, { fields: [documents.applicationId], references: [applications.id] })
}));

// Create Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  username: (schema) => schema.email("Please provide a valid email address"),
  password: (schema) => schema.min(8, "Password must be at least 8 characters")
});

export const loginUserSchema = z.object({
  username: z.string().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required")
});

export const insertProfileSchema = createInsertSchema(profiles);
export const insertApplicationSchema = createInsertSchema(applications);
export const insertDocumentSchema = createInsertSchema(documents);

// Form data validation schema based on Karatina University admission forms
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  nationalIdOrBirthCertNo: z.string().min(1, "National ID or Birth Certificate number is required"),
  hudumaNo: z.string().optional(),
  nhifNo: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  religion: z.string().optional(),
  nationality: z.string().min(1, "Nationality is required"),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"]),
  physicalImpairment: z.boolean().default(false),
  impairmentDetails: z.string().optional()
});

export const contactInfoSchema = z.object({
  postalAddress: z.string().min(1, "Postal address is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  town: z.string().min(1, "Town is required"),
  mobilePhone: z.string().min(1, "Mobile phone is required"),
  email: z.string().email("Please provide a valid email address"),
  county: z.string().min(1, "County is required")
});

export const familyInfoSchema = z.object({
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherAlive: z.boolean().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherAlive: z.boolean().optional(),
  numberOfSiblings: z.number().int().nonnegative().optional(),
  spouseName: z.string().optional(),
  spouseOccupation: z.string().optional(),
  spousePhone: z.string().optional()
});

export const residenceInfoSchema = z.object({
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  permanentResidence: z.string().min(1, "Permanent residence is required"),
  nearestTown: z.string().min(1, "Nearest town is required"),
  location: z.string().min(1, "Location is required"),
  subCounty: z.string().min(1, "Sub-county is required"),
  constituency: z.string().min(1, "Constituency is required"),
  nearestPoliceStation: z.string().min(1, "Nearest police station is required")
});

export const educationInfoSchema = z.object({
  kcseSchool: z.string().min(1, "KCSE school is required"),
  kcseIndex: z.string().min(1, "KCSE index number is required"),
  kcseYear: z.string().min(1, "KCSE year is required"),
  kcseResults: z.string().min(1, "KCSE results are required"),
  kcpeSchool: z.string().min(1, "KCPE school is required"),
  kcpeIndex: z.string().min(1, "KCPE index number is required"),
  kcpeYear: z.string().min(1, "KCPE year is required"),
  kcpeResults: z.string().min(1, "KCPE results are required"),
  otherQualifications: z.string().optional()
});

export const medicalInfoSchema = z.object({
  everAdmitted: z.boolean().default(false),
  admissionDetails: z.string().optional(),
  tbHistory: z.boolean().default(false),
  tbDetails: z.string().optional(),
  fitHistory: z.boolean().default(false),
  fitDetails: z.string().optional(),
  heartDiseaseHistory: z.boolean().default(false),
  heartDiseaseDetails: z.string().optional(),
  digestiveDiseaseHistory: z.boolean().default(false),
  digestiveDiseaseDetails: z.string().optional(),
  allergiesHistory: z.boolean().default(false),
  allergiesDetails: z.string().optional()
});

export const documentsSchema = z.object({
  nationalId: z.boolean().default(false),
  kcseResults: z.boolean().default(false),
  kcpeResults: z.boolean().default(false),
  passportPhoto: z.boolean().default(false)
});

export const acceptanceSchema = z.object({
  acceptOffer: z.boolean().refine(value => value === true, {
    message: "You must accept the offer to continue"
  }),
  imageReleaseConsent: z.boolean()
});

export const applicationFormSchema = z.object({
  personalInfo: personalInfoSchema,
  contactInfo: contactInfoSchema,
  familyInfo: familyInfoSchema,
  residenceInfo: residenceInfoSchema,
  educationInfo: educationInfoSchema,
  medicalInfo: medicalInfoSchema,
  documents: documentsSchema,
  acceptance: acceptanceSchema
});

// Export types for use in application
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type Profile = typeof profiles.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type ApplicationForm = z.infer<typeof applicationFormSchema>;
