
# System Diagrams

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
