
# Admissio - Student Application Management System

A web application built for Karatina University to manage student applications and admissions processes.

## Features

### Student Features
- User registration and authentication
- Multi-step application form
- Document upload (ID/Birth Certificate, KCSE Certificate, KCPE Certificate, etc.)
- Application status tracking
- Draft saving and final submission
- Application history viewing

### Admin Features
- Application review dashboard
- Application status management
- User management
- Document verification
- Application statistics

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn/ui
- **Backend**: Express.js, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: NextAuth.js with Supabase Auth
- **Form Handling**: React Hook Form, Zod

## Getting Started

1. Clone the repository on Replit
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in Replit Secrets:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Start the development server:
```bash
npm run dev
```

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

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

MIT License
