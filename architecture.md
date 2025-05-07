
# Architecture Overview

## Overview

Admissio is a student application management system built for Karatina University to handle student admissions processes. It features a full-stack architecture with a React frontend and Express backend, using Supabase for data storage and file management.

## System Architecture

The application follows a client-server architecture with clear separation of concerns:

### Frontend (Client)

- **Framework**: React 18 with TypeScript
- **UI Components**: Uses shadcn/ui (based on Radix UI) for component library
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend (Server)

- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful API architecture
- **Authentication**: NextAuth.js integrated with Supabase Auth
- **File Storage**: Supabase Storage for document management
- **Database**: Supabase (PostgreSQL) for data persistence

### Database

- **Type**: PostgreSQL (via Supabase)
- **Schema Management**: Supabase migrations
- **File Storage**: Supabase Storage for document files

### Shared Code

- **Location**: `/shared` directory contains code shared between client and server
- **Schema Definitions**: TypeScript types and Zod schemas

## Key Components

### Client-Side Components

1. **Layout Components**
   - `nav-bar.tsx`: Navigation header component
   - `footer.tsx`: Footer component

2. **Page Components**
   - `application-page.tsx`: Multi-step application form
   - `documents-page.tsx`: Document upload interface
   - `dashboard-page.tsx`: Student dashboard
   - `admin-page.tsx`: Admin dashboard and management
   - `auth-page.tsx`: Authentication pages

3. **Feature Components**
   - `application-form.tsx`: Dynamic application form with sections
   - `document-upload.tsx`: File upload component
   - `application-status.tsx`: Status display component

4. **UI Components**
   - Extensive collection of shadcn/ui components

### Server-Side Components

1. **API Routes** (`routes.ts`)
   - Authentication endpoints
   - Application management endpoints
   - Document upload/download endpoints
   - Admin management endpoints

2. **Services**
   - `auth.ts`: Authentication service
   - `storage.ts`: Database operations
   - Document storage operations

## Data Flow

### Application Submission Flow

1. Student completes multi-step application form
2. Form data is validated using Zod schemas
3. Application is saved as draft or submitted
4. Required documents are uploaded to Supabase Storage
5. Document metadata is linked to application in database

### Document Management Flow

1. Student uploads required documents
2. Files are processed and stored in Supabase Storage
3. Document metadata is saved in database
4. Admin can review and verify documents
5. Documents are available for download with secure URLs

### Admin Review Flow

1. Admin views list of submitted applications
2. Can access detailed view of each application
3. Reviews application data and documents
4. Updates application status
5. Student is notified of status changes

## Database Schema

1. **Users**
   - Basic user information
   - Role (student/admin)
   - Authentication details

2. **Applications**
   - Application form data (JSONB)
   - Status
   - Timestamps
   - User reference

3. **Documents**
   - Document metadata
   - Storage paths
   - Application reference
   - Verification status

## External Dependencies

### Frontend Dependencies

- **@radix-ui** components for accessible UI
- **@tanstack/react-query** for server state
- **@hookform/resolvers** for form validation
- **tailwindcss** for styling
- **wouter** for routing
- **zod** for validation

### Backend Dependencies

- **express** for API server
- **@supabase/supabase-js** for database and storage
- **next-auth** for authentication
- **typescript** for type safety

## Deployment Strategy

The application is deployed on Replit:

1. **Development**
   - Vite dev server for frontend
   - Express server with auto-restart
   - Live reload enabled

2. **Production**
   - Frontend assets built with Vite
   - Express server handles API requests
   - Static assets served by Express

3. **Database/Storage**
   - Supabase handles database and file storage
   - Automatic backups and scaling

## Security Features

1. **Authentication**
   - JWT-based auth via NextAuth.js
   - Secure password handling
   - Email verification

2. **Authorization**
   - Role-based access control
   - Protected routes and API endpoints
   - Document access control

3. **Data Security**
   - Form validation
   - Secure file uploads
   - HTTPS enforcement

## Conclusion

Admissio utilizes modern web technologies to create a robust student application management system. The architecture separates concerns while maintaining type safety and data validation throughout the stack. The system is designed to be scalable and maintainable, with clear separation of student and administrative functions.
