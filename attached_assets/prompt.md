Admissio System: Feature Build Prompts (AISpec Format with Form Fields)These prompts integrate specific fields from Karatina University forms (AA/F002, AA/F003) and follow the AISpec format. Execute them sequentially.Feature: ProjectInitializationFeature: ProjectInitialization {
  What:
    - "Set up the Next.js project structure and base dependencies"
    - "Initialize UI component library (Shadcn/ui)"
  Boundaries:
    - "Project Name: admissio-app"
    - "Next.js version: 14"
    - "Router: App Router"
    - "Language: TypeScript"
    - "Styling: TailwindCSS"
    - "Linting/Formatting: ESLint enabled"
    - "Shadcn/ui Style: New York"
    - "Shadcn/ui Color: Slate"
    - "Shadcn/ui Component Path: components/ui"
  Success:
    - "A runnable Next.js project is created with specified configurations"
    - "Core dependencies (`@supabase/supabase-js`, `next-auth`, `react-hook-form`, `zod`, `bcrypt`, Shadcn/ui related) are installed"
    - "Shadcn/ui is initialized and ready for use"
  Technical:
    framework: "Next.js 14 (App Router)"
    language: "TypeScript"
    ui: "TailwindCSS + Shadcn/ui"
    package_manager: "npm or yarn or pnpm"
  Dependencies:
    required: ["next", "react", "react-dom", "typescript", "tailwindcss", "@supabase/supabase-js", "next-auth", "react-hook-form", "@hookform/resolvers", "zod", "bcrypt", "@radix-ui/react-*", "class-variance-authority", "clsx", "tailwind-merge", "lucide-react"]
}
Prompt 1: "Generate the command to create a new Next.js 14 project named admissio-app using create-next-app. Configure it with TypeScript, TailwindCSS, ESLint, and the App Router."Prompt 2: "Generate the command to install all dependencies listed in the Dependencies:required section of the ProjectInitialization feature."Prompt 3: "Provide the npx command to initialize Shadcn/ui according to the Boundaries specified in the ProjectInitialization feature."Feature: DatabaseSchemaSetupFeature: DatabaseSchemaSetup {
  What:
    - "Define PostgreSQL schema in Supabase for users, applications, and documents"
    - "Establish relationships between tables"
    - "Configure storage for document uploads"
    - "Implement basic Row Level Security (RLS)"
  Boundaries:
    - "Tables: `profiles`, `applications`, `documents`"
    - "`profiles` table linked to `auth.users`, includes `role` (TEXT: 'student'/'admin')"
    - "`applications` table includes `user_id` (FK to auth.users), `status` (TEXT), `form_data` (JSONB), timestamps"
    - "`form_data` JSONB structure MUST accommodate fields derived from KarU forms AA/F002 and AA/F003 (Part I)"
    - "`documents` table includes `application_id` (FK to applications), `file_name`, `storage_path`"
    - "Supabase Storage Bucket Name: `application_documents`"
    - "RLS Policy: Users manage own data; Admins manage all data"
    - "RLS must be enabled on `profiles`, `applications`, `documents`"
  Success:
    - "SQL script successfully creates specified tables, columns, types, and foreign keys"
    - "JSONB structure in `applications.form_data` is suitable for storing detailed applicant info (personal, contact, parent/guardian, medical history)"
    - "Storage bucket `application_documents` is created"
    - "RLS policies are defined and enabled, correctly restricting access based on user role and ownership"
  Technical:
    database: "Supabase (PostgreSQL)"
    storage: "Supabase Storage"
    security: "Supabase Row Level Security"
}
Prompt 4: "Generate the SQL statements for Supabase PostgreSQL to create the profiles, applications, and documents tables, including specified columns, types (using JSONB for form_data), foreign keys, and default values, according to the DatabaseSchemaSetup feature specification. Also, include SQL to create the application_documents storage bucket and define and enable the specified RLS policies."Feature: SupabaseClientIntegrationFeature: SupabaseClientIntegration {
  What:
    - "Create a reusable Supabase client instance for the Next.js application"
  Boundaries:
    - "Client must be initialized using environment variables"
    - "Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`"
    - "Utility file location: `lib/supabaseClient.ts`"
    - "Must export a singleton instance of the Supabase client"
  Success:
    - "The `lib/supabaseClient.ts` file correctly initializes and exports the Supabase client"
    - "Client uses environment variables for configuration"
    - "Client can be imported and used throughout the application"
  Technical:
    framework: "Next.js 14"
    language: "TypeScript"
    library: "@supabase/supabase-js"
    configuration: "Environment Variables"
}
Prompt 5: "Generate the TypeScript code for lib/supabaseClient.ts to initialize and export the Supabase JS client using environment variables, as specified in the SupabaseClientIntegration feature."Feature: UserAuthenticationFeature: UserAuthentication {
  What:
    - "Implement user registration with email/password"
    - "Implement user login with email/password"
    - "Integrate NextAuth.js with Supabase for authentication"
    - "Manage user sessions and include user role"
    - "Provide sign-out functionality"
  Boundaries:
    - "Use NextAuth.js Credentials Provider"
    - "Registration API/Action must hash passwords (bcrypt)"
    - "Registration must create user in `auth.users` (via Supabase) and `profiles` table (with 'student' role)"
    - "Login must verify credentials against Supabase Auth"
    - "Session callback must add `id` and `role` (from `profiles`) to the session token"
    - "Registration form fields: Email, Password, Confirm Password"
    - "Login form fields: Email, Password"
    - "Use `react-hook-form` and `zod` for form validation"
    - "Use Shadcn/ui components for forms and buttons"
  Success:
    - "Users can successfully register via the `/register` page"
    - "Registered users can log in via the `/login` page"
    - "Authentication is correctly handled via Supabase through NextAuth.js"
    - "User session contains user ID and role"
    - "Login/Registration forms have client-side validation"
    - "Users can sign out"
  Technical:
    framework: "Next.js 14 (App Router)"
    auth_library: "NextAuth.js"
    auth_provider: "Supabase Auth"
    forms: "React Hook Form + Zod"
    ui: "Shadcn/ui"
    password_hashing: "bcrypt"
  Dependencies:
    required: ["next-auth", "react-hook-form", "@hookform/resolvers", "zod", "bcrypt"]
  Security:
    - "Password hashing implemented correctly"
    - "Credentials provider used securely"
}
Prompt 6: "Generate the code for the NextAuth.js configuration (app/api/auth/[...nextauth]/route.ts) using the Credentials Provider, JWT strategy, and session callbacks to integrate with Supabase Auth and include user role, as per the UserAuthentication feature."Prompt 7: "Generate the React component code for the registration page (app/register/page.tsx) and the corresponding Server Action or API route (app/api/auth/register/route.ts) using Shadcn/ui, React Hook Form, Zod, and bcrypt for password hashing, fulfilling the UserAuthentication requirements."Prompt 8: "Generate the React component code for the login page (app/login/page.tsx) using Shadcn/ui and React Hook Form, integrating with the NextAuth.js signIn function as specified in the UserAuthentication feature."Prompt 10 (Modified): "Generate the code for the root layout (app/layout.tsx) including a basic header that uses NextAuth.js helpers to conditionally display user info/sign-out or sign-in/register links, following the UserAuthentication specifications."Feature: RouteProtectionMiddlewareFeature: RouteProtectionMiddleware {
  What:
    - "Protect application routes based on authentication status and user role"
  Boundaries:
    - "Use Next.js Middleware (`middleware.ts`)"
    - "Integrate with NextAuth.js `auth` helper"
    - "Unauthenticated users accessing `/dashboard` or `/admin` redirected to `/login`"
    - "Authenticated 'student' role accessing `/admin` redirected to `/dashboard`"
    - "`/admin` routes accessible only to 'admin' role"
    - "`/dashboard` routes accessible to 'student' and 'admin' roles"
  Success:
    - "Middleware correctly intercepts requests"
    - "Redirections based on auth status and role work as specified"
    - "Protected routes are inaccessible without proper authentication/authorization"
  Technical:
    framework: "Next.js 14 (Middleware)"
    auth_library: "NextAuth.js"
}
Prompt 9: "Generate the TypeScript code for middleware.ts using NextAuth.js helpers to implement the route protection logic defined in the RouteProtectionMiddleware feature."Feature: StudentApplicationFormFeature: StudentApplicationForm {
  What:
    - "Create a multi-step or single-page form for student application data entry"
    - "Capture detailed personal, contact, family, education, medical, and other required information based on KarU forms AA/F002 and AA/F003 (Part I)"
    - "Implement client-side validation for all fields"
    - "Allow saving form progress as a draft"
    - "Allow final submission of the application"
    - "Integrate document upload functionality"
  Boundaries:
    - "Form Component Location: `components/ApplicationForm.tsx` (Client Component)"
    - "Form Handling: `react-hook-form`"
    - "Validation: `zod`"
    - "UI Components: Shadcn/ui (`Input`, `Select`, `DatePicker`, `Checkbox`, `RadioGroup`, `Textarea`, `Card`, etc.)"
    - "**Required Fields (derived from AA/F002 & AA/F003):**"
    - "  *Personal:* Full Name, Reg No (if assigned later), National ID/BC No, Huduma No, DOB, Gender, Physical Impairments (Yes/No + details), NHIF No, Religion, Nationality, Marital Status"
    - "  *Contact:* Postal Address (Box, Code, Town), Mobile Phone, Email, County"
    - "  *Family:* Spouse Name/Occupation/Phone/Children (if married), Father's Full Name/Occupation/DOB/Alive/Deceased, Mother's Full Name/Occupation/DOB/Alive/Deceased, No. of Siblings"
    - "  *Residence:* Place of Birth, Permanent Residence (Village/Town, Nearest Town, Location, Chief, County, Sub-County, Constituency, Nearest Police Station)"
    - "  *Emergency Contacts:* Two contacts (Name, Relationship, Address, Phone, Email)"
    - "  *Education:* O-Level School/Index/Year, KCSE Results (Textarea), Primary School/Index/Year, KCPE Results (Textarea), Other Institutions/Qualifications"
    - "  *Interests:* Games/Sports, Clubs/Societies/Hobbies"
    - "  *Medical History (AA/F003 Part I):* Ever Admitted (Yes/No + reason/date), History of (TB, Fits, Heart Disease, Digestive Disease, Allergies, STDs, Polio - Yes/No + details), Family History (TB, Mental Illness, Diabetes, Heart Disease - Yes/No), Immunizations (Smallpox, Tetanus, Polio - Yes/No + date)"
    - "  *Consent:* Field for Image Release Consent (Checkbox based on AA/F018)"
    - "  *Acceptance:* Field for Acceptance of Offer (Checkbox based on AA/F001)"
    - "Document Upload: Allow PDF, JPG, PNG (Max 10MB per file). Target files: National ID/BC, KCSE Cert/Slip, KCPE Cert, Passport Photo (optional: NHIF card)"
    - "Save Draft: Persists current form state to `applications.form_data` (status 'draft')"
    - "Submit: Validates all fields, persists final state, updates status to 'submitted'"
  Success:
    - "Application form component renders all specified fields using Shadcn/ui"
    - "Client-side validation using Zod catches errors for all required fields and formats"
    - "'Save Draft' correctly saves incomplete form data to Supabase"
    - "'Submit Application' validates, saves final data, updates status, and triggers document linking"
    - "Document upload integrates with Supabase Storage and links files to the application"
    - "Form data structure aligns with the JSONB schema defined in `DatabaseSchemaSetup`"
  Technical:
    framework: "Next.js 14 / React"
    component_type: "Client Component"
    forms: "React Hook Form + Zod"
    ui: "Shadcn/ui"
    state_management: "React Hook Form internal state"
    backend_interaction: "Server Actions or API Routes"
    storage: "Supabase Storage"
  Dependencies:
    required: ["react-hook-form", "@hookform/resolvers", "zod", "lucide-react", "@radix-ui/react-*"]
}

Prompt 12 (Replaces old 11 & 12): "Generate the React component code for components/ApplicationForm.tsx. Implement the form using react-hook-form, zod, and Shadcn/ui components to capture all fields specified in the Boundaries of the StudentApplicationForm feature. Include client-side validation."Prompt 13: "Generate the code for the application page (app/dashboard/apply/page.tsx) that uses the ApplicationForm component. Implement logic to either start a new draft application or load an existing draft from Supabase based on the logged-in user."Prompt 14: "Generate the Server Action or API route code required for the 'Save Draft' functionality described in the StudentApplicationForm feature, updating the form_data in the applications table."Prompt 15: "Generate the Server Action or API route code required for the document upload functionality described in the StudentApplicationForm feature, handling file uploads to Supabase Storage and creating records in the documents table."Prompt 16: "Generate the Server Action or API route code required for the 'Submit Application' functionality described in the StudentApplicationForm feature, performing final validation, updating form_data, changing the application status to 'submitted', and potentially linking documents."Feature: StudentDashboardFeature: StudentDashboard {
  What:
    - "Display the student's current application status"
    - "Provide access to start or continue an application"
    - "Show a summary of submitted application details"
    - "List uploaded documents with download links"
  Boundaries:
    - "Page Location: `app/dashboard/page.tsx`"
    - "Protected Route (via Middleware)"
    - "Fetch application data for the logged-in user from Supabase (`applications` table)"
    - "Fetch associated documents (`documents` table)"
    - "Display Status prominently (e.g., Shadcn/ui `Badge`)"
    - "If no application or status is 'draft', show 'Start/Continue Application' button linking to `/dashboard/apply`"
    - "If status is 'submitted' or later, display read-only summary of key `form_data` fields (e.g., Personal Info, Course Choice)"
    - "List uploaded documents with links to download from Supabase Storage (requires signed URLs or appropriate bucket policies)"
  Success:
    - "Dashboard correctly displays the user's application status"
    - "Appropriate action button (Start/Continue) is shown based on status"
    - "Submitted application details are displayed read-only"
    - "Uploaded documents are listed with functional download links"
    - "Page fetches data efficiently using Supabase client"
  Technical:
    framework: "Next.js 14 (Server Component preferred for data fetching)"
    ui: "Shadcn/ui"
    data_fetching: "Supabase JS Client"
    storage_access: "Supabase Storage (Signed URLs or Public Access)"
}
Prompt 17 (Combined & Updated from old 11 & 17): "Generate the React component code for the student dashboard page (app/dashboard/page.tsx). Fetch and display the user's application status, submitted data summary (read-only from form_data), and a list of uploaded documents with download links, according to the StudentDashboard feature specification. Include the 'Start/Continue Application' button logic."Feature: AdminLayoutFeature: AdminLayout {
  What:
    - "Create a consistent layout structure for all admin pages"
    - "Include sidebar navigation for admin sections"
  Boundaries:
    - "Layout File Location: `app/admin/layout.tsx`"
    - "Protected Route (Admin role via Middleware)"
    - "Use Shadcn/ui components for layout structure (e.g., flexbox/grid)"
    - "Sidebar Navigation Links: 'Dashboard' (`/admin`), 'Applications' (`/admin/applications`), 'Users' (`/admin/users`)"
    - "Main content area for nested admin pages"
  Success:
    - "Admin layout component is created and applied to admin routes"
    - "Sidebar navigation is present and links to correct admin pages"
    - "Layout is accessible only to users with the 'admin' role"
  Technical:
    framework: "Next.js 14 (Layout Component)"
    ui: "Shadcn/ui"
}
Prompt 18: "Generate the React component code for the admin section layout (app/admin/layout.tsx) including sidebar navigation with links to Dashboard, Applications, and Users, using Shadcn/ui components as specified in the AdminLayout feature."Feature: AdminDashboardFeature: AdminDashboard {
  What:
    - "Display key statistics about applications for administrators"
  Boundaries:
    - "Page Location: `app/admin/page.tsx`"
    - "Protected Route (Admin role via Middleware)"
    - "Fetch aggregate data from Supabase `applications` table"
    - "Statistics to display: Total number of applications, Count of applications by status (submitted, review, accepted, rejected)"
    - "Use Shadcn/ui `Card` components to display statistics"
  Success:
    - "Admin dashboard page displays accurate application counts"
    - "Data is fetched efficiently from Supabase"
    - "Statistics are presented clearly using Card components"
    - "Page is accessible only to admins"
  Technical:
    framework: "Next.js 14 (Server Component preferred)"
    ui: "Shadcn/ui (`Card`)"
    data_fetching: "Supabase JS Client (Aggregate queries)"
}
Prompt 19: "Generate the React component code for the admin dashboard page (app/admin/page.tsx). Fetch and display application statistics (Total count, counts by status) using Supabase queries and Shadcn/ui Card components, as defined in the AdminDashboard feature."Feature: AdminApplicationListFeature: AdminApplicationList {
  What:
    - "Provide administrators with a list of submitted applications for review"
  Boundaries:
    - "Page Location: `app/admin/applications/page.tsx`"
    - "Protected Route (Admin role via Middleware)"
    - "Fetch applications with status 'submitted' or 'review' from Supabase `applications` table"
    - "Join with `profiles` table or `auth.users` to get applicant identifier (e.g., email)"
    - "Display data in a Shadcn/ui `Table`"
    - "Table Columns: Applicant Identifier (Email/Name), Submission Date, Status, 'View Details' link/button"
    - "'View Details' link should navigate to the dynamic detail page (`/admin/applications/[id]`)"
  Success:
    - "Page displays a table of relevant applications"
    - "Table includes specified columns and data fetched from Supabase"
    - "'View Details' links correctly navigate to the specific application's detail page"
    - "Page is accessible only to admins"
  Technical:
    framework: "Next.js 14 (Server Component preferred)"
    ui: "Shadcn/ui (`Table`)"
    data_fetching: "Supabase JS Client (Joins may be needed)"
    navigation: "Next.js Link component"
}
Prompt 20: "Generate the React component code for the admin applications list page (app/admin/applications/page.tsx). Fetch relevant applications, join with user data for identification, and display them in a Shadcn/ui Table with specified columns and a 'View Details' link, according to the AdminApplicationList feature."Feature: AdminApplicationDetailViewFeature: AdminApplicationDetailView {
  What:
    - "Display comprehensive details of a specific student application for admin review"
    - "Show all data captured via the application form (from `form_data`)"
    - "Provide access to uploaded documents"
    - "Allow admins to update the application status"
  Boundaries:
    - "Page Location: `app/admin/applications/[id]/page.tsx` (Dynamic Route)"
    - "Protected Route (Admin role via Middleware)"
    - "Fetch specific application record by ID from `applications` table"
    - "Fetch associated documents from `documents` table"
    - "Parse and display all fields stored within the `form_data` JSONB object in a readable format (use Shadcn/ui components like `Card`, `Label`, `Input` (read-only), etc.)"
    - "Display document names with download links (Supabase Storage)"
    - "Include controls (e.g., Shadcn/ui `Select` or `Button` group) for admin to change status (e.g., 'Review', 'Accepted', 'Rejected', 'Request Info')"
    - "Status update triggers a Server Action/API route to modify the record in Supabase"
  Success:
    - "Page correctly fetches and displays application details based on route ID"
    - "All information from `form_data` (Personal, Medical, etc.) is clearly presented"
    - "Document links are functional"
    - "Admin can successfully update the application status via UI controls"
    - "Page is accessible only to admins"
  Technical:
    framework: "Next.js 14 (Server Component preferred)"
    ui: "Shadcn/ui"
    data_fetching: "Supabase JS Client"
    backend_interaction: "Server Actions or API Routes"
    storage_access: "Supabase Storage"
}
Prompt 21: "Generate the React component code for the dynamic admin application detail page (app/admin/applications/[id]/page.tsx). Fetch the application by ID, parse and display all fields from the form_data JSONB, list documents with download links, and include UI controls for status updates, as per the AdminApplicationDetailView specification."Prompt 22: "Generate the Server Action or API route code to handle the application status update initiated from the admin detail page, as described in the AdminApplicationDetailView feature."Feature: AdminUserListFeature: AdminUserList {
  What:
    - "Provide administrators with a list of registered users and their roles"
  Boundaries:
    - "Page Location: `app/admin/users/page.tsx`"
    - "Protected Route (Admin role via Middleware)"
    - "Fetch user data (e.g., email) from `auth.users` and role from `profiles` table"
    - "Display data in a Shadcn/ui `Table`"
    - "Table Columns: User Identifier (Email), Role"
    - "(Optional for prototype: Basic role update functionality)"
  Success:
    - "Page displays a table of registered users with their roles"
    - "Data is fetched correctly from Supabase tables"
    - "Page is accessible only to admins"
  Technical:
    framework: "Next.js 14 (Server Component preferred)"
    ui: "Shadcn/ui (`Table`)"
    data_fetching: "Supabase JS Client (Joins needed)"
}
Prompt 23: "Generate the React component code for the admin users list page (app/admin/users/page.tsx). Fetch user emails and roles from Supabase and display them in a Shadcn/ui Table, as defined in the AdminUserList feature."Feature: BasicNotificationsFeature: BasicNotifications {
  What:
    - "Notify students via email when their application status changes (e.g., to Accepted/Rejected)"
  Boundaries:
    - "Trigger: Update to the `status` column in the `applications` table"
    - "Mechanism: Supabase Database Function or Edge Function"
    - "Action: Send email to the applicant's email address (fetched via `user_id`)"
    - "Email Content: Basic notification mentioning the application ID and new status"
    - "Email Service: Supabase built-in Auth notifications or external provider integration (keep simple)"
  Success:
    - "An email is sent to the student when their application status is updated to a final state (Accepted/Rejected)"
    - "The trigger mechanism (DB Function/Edge Function) executes correctly on status update"
  Technical:
    backend: "Supabase (Database Functions or Edge Functions)"
    language: "SQL or TypeScript/Deno (for Edge Functions)"
    email_service: "Supabase Auth Notifications or external SMTP/API"
  Security:
    - "Ensure email sending credentials/keys are handled securely (Environment Variables)"
}
Prompt 24 (Optional): "Generate the SQL code for a Supabase Database Function (or TypeScript for an Edge Function) that is triggered on updates to the applications table. When the status changes to 'Accepted' or 'Rejected', the function should retrieve the user's email and send a basic notification email, as specified in the BasicNotifications feature. Include placeholders for email service configuration."