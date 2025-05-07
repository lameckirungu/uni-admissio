
# System Diagrams

## Logical Data Model
```mermaid
erDiagram
    User {
        username string
        password string
        role string
    }
    Profile {
        fullName string
        email string
        phoneNumber string
    }
    Application {
        status string
        formData json
        submittedAt datetime
    }
    Document {
        documentType string
        fileName string
        verified boolean
    }
    
    User ||--|| Profile : has
    User ||--o{ Application : submits
    Application ||--o{ Document : contains
```

## Physical Data Model
```mermaid
erDiagram
    users {
        serial id PK
        text username UK "NOT NULL"
        text password "NOT NULL"
        text role "NOT NULL"
        timestamp created_at "NOT NULL"
    }
    profiles {
        serial id PK
        integer user_id FK "NOT NULL"
        text full_name
        text email
        text phone_number
        timestamp created_at "NOT NULL"
        timestamp updated_at "NOT NULL"
    }
    applications {
        serial id PK
        integer user_id FK "NOT NULL"
        text status "NOT NULL"
        jsonb form_data "NOT NULL"
        timestamp created_at "NOT NULL"
        timestamp updated_at "NOT NULL"
        timestamp submitted_at
    }
    documents {
        serial id PK
        integer application_id FK "NOT NULL"
        text document_type "NOT NULL"
        text file_name "NOT NULL"
        text storage_path "NOT NULL"
        timestamp uploaded_at "NOT NULL"
        boolean verified "DEFAULT false"
    }
    
    users ||--|| profiles : belongs_to
    users ||--o{ applications : owns
    applications ||--o{ documents : contains
```

## Security Implementation
```mermaid
graph TB
    subgraph Client["Client Security Layer"]
        FormVal["Form Validation (Zod)"]
        CSRFProt["CSRF Protection"]
        HTTPOnly["HTTPOnly Cookies"]
        SecHead["Security Headers"]
    end

    subgraph Auth["Authentication Layer"]
        NextAuth["NextAuth.js"]
        JWT["JWT Tokens"]
        Session["Session Management"]
        PassHash["Password Hashing (bcrypt)"]
    end

    subgraph RBAC["Authorization Layer (RBAC)"]
        RoleCheck["Role Checking"]
        RouteGuard["Route Guards"]
        APIGuard["API Endpoint Guards"]
    end

    subgraph Data["Data Security Layer"]
        RLS["Row Level Security"]
        Encrypt["Data Encryption"]
        FileVal["File Validation"]
        SecStore["Secure Storage"]
    end

    %% Connections
    FormVal --> NextAuth
    CSRFProt --> NextAuth
    NextAuth --> JWT
    JWT --> Session
    Session --> RoleCheck
    PassHash --> NextAuth
    
    RoleCheck --> RouteGuard
    RoleCheck --> APIGuard
    
    RouteGuard --> RLS
    APIGuard --> RLS
    RLS --> SecStore
    FileVal --> SecStore
    
    %% Security flow indicators
    classDef secured fill:#e6f3ff,stroke:#3182ce
    class NextAuth,RLS,SecStore secured
```

## System Architecture
```mermaid
graph TB
    subgraph Client["Client Layer (React + TypeScript)"]
        UI["UI Components (Shadcn/ui)"]
        Pages["Pages (Auth/Dashboard/Admin)"]
        State["State Management (TanStack Query)"]
        Forms["Form Handling (React Hook Form + Zod)"]
    end

    subgraph Server["Server Layer (Express + TypeScript)"]
        API["REST API Endpoints"]
        Auth["Authentication (NextAuth.js)"]
        Valid["Validation Layer"]
        Files["File Management"]
    end

    subgraph Database["Database Layer (Supabase)"]
        PG["PostgreSQL Database"]
        Storage["File Storage"]
        Security["Row Level Security"]
    end

    Client --> |HTTP/REST| Server
    Server --> |SQL/Storage API| Database
    
    %% Data flow connections
    UI --> State
    Pages --> Forms
    Forms --> State
    State --> API
    API --> Auth
    API --> Valid
    Valid --> Files
    Files --> Storage
    Auth --> PG
    Valid --> PG
```

## 4.6.1 Data Flow Diagrams (DFDs)

### Level 0 DFD (Context Diagram)
```mermaid
graph TD
    A[Applicant] -->|Submit Application/Documents| S((Admissio System))
    S -->|Application Status/Notifications| A
    S -->|Send Notifications| E[Email Service]
    E -->|Delivery Status| S
    AD[Administrator] -->|Review/Update Status| S
    S -->|Application Data/Reports| AD
```

### Level 1 DFD
```mermaid
graph TD
    A[Applicant] -->|Login/Register| P1[User Authentication]
    A -->|Submit Form| P2[Application Management]
    A -->|Upload Files| P3[Document Management]
    AD[Administrator] -->|Login| P1
    AD -->|Review| P4[Application Review]
    
    P1 -->|User Data| DS1[(User Store)]
    P2 -->|Application Data| DS2[(Application Store)]
    P3 -->|Document Data| DS3[(Document Store)]
    P4 -->|Review Data| DS2
    
    P2 -->|Status Update| E[Email Service]
    P4 -->|Decision Notice| E
```

### Level 2 DFD: Application Management
```mermaid
graph TD
    A[Applicant] -->|Input Data| P1[Form Validation]
    P1 -->|Valid Data| P2[Draft Saving]
    P2 -->|Save| DS1[(Application Store)]
    P1 -->|Valid Data| P3[Final Submission]
    P3 -->|Required Docs| P4[Document Check]
    P4 -->|Complete| P5[Status Update]
    P5 -->|Update| DS1
    P5 -->|Notify| E[Email Service]
```

## 4.6.2 Use Case Diagram
```mermaid
graph TD
    subgraph Actors
        A[Applicant]
        AD[Administrator]
    end
    
    subgraph Use Cases
        UC1[Register/Login]
        UC2[Manage Application]
        UC3[Upload Documents]
        UC4[Track Status]
        UC5[Review Applications]
        UC6[Manage Documents]
        UC7[Update Status]
    end
    
    A -->|uses| UC1
    A -->|uses| UC2
    A -->|uses| UC3
    A -->|uses| UC4
    AD -->|uses| UC1
    AD -->|uses| UC5
    AD -->|uses| UC6
    AD -->|uses| UC7
```

## 4.6.3 Entity-Relationship Diagram
```mermaid
erDiagram
    USER ||--o{ APPLICATION : submits
    USER {
        int id
        string username
        string password
        string role
        timestamp created_at
    }
    APPLICATION ||--o{ DOCUMENT : contains
    APPLICATION {
        int id
        int user_id
        string status
        jsonb form_data
        timestamp created_at
        timestamp updated_at
    }
    DOCUMENT {
        int id
        int application_id
        string document_type
        string file_name
        string storage_path
        boolean verified
    }
    PROFILE ||--|| USER : belongs_to
    PROFILE {
        int id
        int user_id
        string full_name
        string email
        string phone_number
    }
```

## 4.6.4 Sequence Diagrams

### Application Submission Sequence
```mermaid
sequenceDiagram
    participant A as Applicant
    participant F as Frontend
    participant API as API Server
    participant DB as Database
    participant S as Storage
    participant E as Email Service
    
    A->>F: Fill Application Form
    F->>F: Validate Form Data
    A->>F: Upload Documents
    F->>API: Submit Application
    API->>DB: Save Application Data
    API->>S: Store Documents
    API->>DB: Update Status
    API->>E: Send Confirmation
    E->>A: Confirmation Email
```

### Application Review Sequence
```mermaid
sequenceDiagram
    participant AD as Admin
    participant F as Frontend
    participant API as API Server
    participant DB as Database
    participant S as Storage
    participant E as Email Service
    
    AD->>F: Access Application
    F->>API: Request Application
    API->>DB: Fetch Application
    API->>S: Fetch Documents
    AD->>F: Review Documents
    AD->>F: Update Status
    F->>API: Save Decision
    API->>DB: Update Status
    API->>E: Send Notification
    E->>A: Status Update Email
```
