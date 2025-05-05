
# Admissio - Student Application Management System

A web application built for Karatina University to manage student applications and admissions processes. Built with React, TypeScript, and Supabase.

## Features

### Student Features
- User registration and authentication
- Multi-step application form with save draft functionality
- Document upload (ID/Birth Certificate, KCSE Certificate, KCPE Certificate, etc.)
- Application status tracking
- Document management

### Admin Features
- Application review dashboard
- Application status management
- User management
- Document verification
- Application statistics

## Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Shadcn/ui
- **Backend**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: NextAuth.js with Supabase Auth
- **Form Handling**: React Hook Form, Zod
- **State Management**: TanStack Query
- **Routing**: Wouter

## Getting Started

1. Click "Fork" to create your own copy of this Repl
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in Replit Secrets:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Start the development server by clicking the "Run" button

The application will be available at your Repl's URL.

## Project Structure

```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions and configs
│   │   ├── pages/       # Application pages
│   │   └── App.tsx      # Root component
├── server/              # Backend Express application
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database operations
│   └── index.ts         # Server entry point
└── shared/              # Shared types and schemas
```

## Application Flow

1. Users register and receive email confirmation
2. Students log in and start their application
3. Application form captures:
   - Personal information
   - Contact details
   - Family information
   - Education history
   - Medical history
4. Students upload required documents
5. Admins review applications and update status
6. Students receive notifications on status changes

## Security Features

- JWT-based authentication
- Role-based access control
- Secure file uploads
- Form validation
- Protected routes

## Development Notes

- The application uses Vite for fast development
- TailwindCSS for styling with Shadcn/ui components
- TypeScript for type safety
- Zod for schema validation
- React Hook Form for form management

## License

MIT License
