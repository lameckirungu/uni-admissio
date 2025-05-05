import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { applicationFormSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Application routes
  app.post("/api/applications", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Validate formData to make sure it's not null or undefined
      if (!req.body.formData) {
        return res.status(400).json({ message: "Invalid application data" });
      }

      // Check if user already has an application
      const existingApplication = await storage.getApplicationByUserId(req.user.id);
      
      if (existingApplication) {
        // Update existing application - make sure we're using the correct application ID
        const userOwnedAppId = existingApplication.id;
        
        const updatedApplication = await storage.updateApplication(
          userOwnedAppId, 
          req.body.formData
        );
        return res.status(200).json(updatedApplication);
      } else {
        // Create new application specific to this user
        const newApplication = await storage.createApplication(
          req.user.id, 
          req.body.formData || {} // Ensure we don't send null/undefined
        );
        return res.status(201).json(newApplication);
      }
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/applications/user", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Find the specific application for this user
      const application = await storage.getApplicationByUserId(req.user.id);
      
      if (!application) {
        // Instead of returning a 404 error, which might be confusing for a new user,
        // return an empty response with a 204 No Content status
        // This indicates that the request was successful but there's no application yet
        return res.status(204).end();
      }
      
      // Return the user's application
      return res.status(200).json(application);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/applications/:id/status", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { id } = req.params;
      const { status } = req.body;
      
      // Validate the status value
      if (!["draft", "submitted", "under_review", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      // Get the application to check ownership or admin role
      const application = await storage.getApplicationByUserId(req.user.id);
      
      // Only allow updates if user is admin or the owner of the application
      if (req.user.role !== "admin" && (!application || application.id !== parseInt(id))) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updatedApplication = await storage.updateApplicationStatus(parseInt(id), status);
      
      if (!updatedApplication) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      return res.status(200).json(updatedApplication);
    } catch (error) {
      next(error);
    }
  });

  // Admin-only route to get all applications
  app.get("/api/applications", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      const { status } = req.query;
      const filters: { status?: string } = {};
      
      if (status && typeof status === "string") {
        filters.status = status;
      }
      
      const applications = await storage.getApplications(filters);
      return res.status(200).json(applications);
    } catch (error) {
      next(error);
    }
  });

  // Document upload routes
  app.post("/api/documents", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { applicationId, documentType, fileName, storagePath } = req.body;
      
      // Check if the application belongs to the user
      const application = await storage.getApplicationByUserId(req.user.id);
      
      if (req.user.role !== "admin" && (!application || application.id !== applicationId)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const document = await storage.uploadDocument({
        applicationId,
        documentType,
        fileName,
        storagePath
      });
      
      return res.status(201).json(document);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/documents/:applicationId", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { applicationId } = req.params;
      
      // Check if the application belongs to the user or user is admin
      const application = await storage.getApplicationByUserId(req.user.id);
      
      if (req.user.role !== "admin" && (!application || application.id !== parseInt(applicationId))) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const documents = await storage.getDocumentsByApplicationId(parseInt(applicationId));
      return res.status(200).json(documents);
    } catch (error) {
      next(error);
    }
  });

  // Admin-only route to verify a document
  app.patch("/api/documents/:id/verify", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      const { id } = req.params;
      const document = await storage.verifyDocument(parseInt(id));
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      return res.status(200).json(document);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
