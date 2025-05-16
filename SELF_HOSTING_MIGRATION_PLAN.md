# Implementation Plan: Migrating from Supabase to Self-Hosted PostgreSQL

**Overall Goal:** Achieve a free, self-hosted solution with no subscription costs, using PostgreSQL and open-source tools to replicate Supabase’s features (Database, Auth, REST APIs, File Storage, Real-time).

**Assumptions:**
*   Small to medium user base (hundreds to thousands).
*   Custom frontend (React, Flutter, Node.js, etc.) that will be adapted.
*   Technical capability to manage self-hosted infrastructure (or willingness to learn).
*   The existing `supabase_full_schema.sql` is a good representation of the database structure.

---

**Phase 0: Preparation, Discovery & Detailed Planning**

*   **Objective:** Thoroughly understand current Supabase usage, finalize technology choices for self-hosted components, and plan the infrastructure.
*   **Tasks:**
    1.  **Detailed Supabase Feature Audit:**
        *   **Authentication:** Confirm all methods used (email/password, social logins, magic links). Review `lib/supabase/serverClient.ts` and any client-side auth logic.
        *   **Database:** Analyze `supabase_full_schema.sql` for any Supabase-specific SQL functions or extensions beyond standard PostgreSQL that might need replacement.
        *   **APIs:** Review all Next.js API routes (like `app/api/forum/topics/[topicId]/route.ts`) to list every endpoint and its Supabase interaction.
        *   **Storage:** **Crucial Discovery Task:** Investigate and document the current media upload and file storage mechanism.
            *   Check frontend components responsible for uploads.
            *   Look for any backend API routes that might proxy or handle file uploads.
            *   Examine database schema for how file URLs/references are stored (e.g., in `users.avatar_url`, or potentially other tables for post attachments).
        *   **Real-time:** Identify all current or planned features that rely on Supabase real-time (e.g., live chat, notifications, collaborative editing).
        *   **Edge Functions:** Determine if any Supabase Edge Functions are in use.
    2.  **Technology Stack Selection for Self-Hosted Components:**
        *   **Authentication:**
            *   **Option A (Recommended for features & security):** Keycloak (OpenID Connect, SAML, social logins, user management UI).
            *   **Option B (Simpler, more custom code):** Implement auth logic within your chosen backend framework using libraries like Passport.js (Node.js), or Django's built-in auth (Python).
        *   **Backend API Framework:**
            *   **Option A (If Next.js is primary):** Continue using Next.js API routes, but connect to your self-hosted DB and services.
            *   **Option B (Dedicated API):** Node.js with Express/Fastify, Python with FastAPI/Django REST framework, Go with Gin. This offers more separation.
        *   **File Storage:**
            *   **MinIO (Recommended):** S3-compatible, robust, widely used.
            *   **Local Filesystem (Simpler, less scalable):** Store files directly on the server. Requires careful permission management and backup strategy.
        *   **Real-time:**
            *   **Socket.IO / ws (Node.js):** Good for integrating with a Node.js backend.
            *   **Centrifugo / NATS:** Standalone real-time servers, language-agnostic.
            *   **PostgreSQL LISTEN/NOTIFY (Simple, DB-centric):** For basic real-time updates triggered by database changes.
    3.  **Infrastructure Planning:**
        *   **Server(s):** Determine requirements (CPU, RAM, Disk) based on expected load. Consider a VPS provider (e.g., DigitalOcean, Linode, Hetzner) or on-premise hardware.
        *   **Containerization (Highly Recommended):** Docker and Docker Compose for all services (PostgreSQL, Auth server, Backend API, MinIO, Real-time server, Reverse Proxy). Your project already has `Dockerfile` and `docker-compose.yml`, which is a great start.
        *   **Reverse Proxy:** Traefik (already in `traefik/traefik.yml`), Nginx, or Caddy for SSL termination, routing, and load balancing.
        *   **Backup Strategy:** Define a robust backup plan for PostgreSQL data and MinIO storage (e.g., `pg_dump`, MinIO client mirroring, filesystem snapshots).
    4.  **Project Management & Version Control:**
        *   Set up a dedicated branch in Git for this migration.
        *   Break down tasks into smaller, manageable issues.
*   **Deliverables:**
    *   Comprehensive audit document of Supabase features used.
    *   Finalized technology stack document.
    *   Infrastructure plan and server specifications.
    *   Detailed project plan with timelines and responsibilities.

---

**Phase 1: Core Backend - Database & Authentication Setup**

*   **Objective:** Establish the self-hosted PostgreSQL database and the new authentication system.
*   **Tasks:**
    1.  **Set up Self-Hosted PostgreSQL:**
        *   Install and configure PostgreSQL (preferably via Docker).
        *   Secure the database (strong passwords, network access controls).
        *   Implement automated backups.
    2.  **Data Migration Strategy:**
        *   **Schema Migration:** Adapt `supabase_full_schema.sql`.
            *   Remove Supabase-specific `auth.users` references and triggers (like `handle_new_auth_user`).
            *   Adjust foreign keys that pointed to `auth.users.id` to point to your new users table.
            *   Re-evaluate `public.users` vs. `public.profiles` in light of the new auth system. Potentially merge or clarify.
        *   **Data Export from Supabase:** Use Supabase's dashboard or `pg_dump` to export data.
        *   **Data Import & Transformation:** Import data into the self-hosted PostgreSQL. Write scripts if data transformation is needed (e.g., mapping old Supabase user IDs to new auth system IDs).
    3.  **Implement Self-Hosted Authentication:**
        *   Install and configure the chosen authentication server (e.g., Keycloak via Docker).
        *   Define user schemas, roles, and permissions.
        *   Set up registration, login, password reset, and token issuance (JWTs).
        *   If social logins are used, configure them in the new auth system.
        *   Create a new "users" table in your PostgreSQL that aligns with your chosen auth system (e.g., storing the auth system's user ID as a foreign key).
        *   Migrate user data from Supabase `auth.users` and `public.users` to the new auth system and your new users table. This is a critical and sensitive step.
*   **Deliverables:**
    *   Running self-hosted PostgreSQL instance with migrated schema and data.
    *   Running self-hosted authentication server with migrated user accounts.
    *   Documentation for database and auth setup.

---

**Phase 2: API Layer Replacement**

*   **Objective:** Develop a new backend API to replace Supabase's auto-generated REST APIs and custom logic.
*   **Tasks:**
    1.  **Set up Backend Framework:** Initialize your chosen backend project (e.g., Express.js, FastAPI).
    2.  **Database Connectivity:** Implement database connection logic for your self-hosted PostgreSQL (e.g., using an ORM like Prisma, TypeORM, SQLAlchemy, or a query builder).
    3.  **Replicate API Endpoints:**
        *   Based on the audit from Phase 0, recreate all existing API endpoints (e.g., CRUD operations for forum topics, posts, users, etc.). Example: `app/api/forum/topics/[topicId]/route.ts` will need a corresponding implementation in the new backend.
        *   Implement request validation and sanitization.
    4.  **Implement Business Logic & Authorization:**
        *   Translate Supabase RLS policies into application-layer authorization logic in your new backend. For example, checking if a user is authenticated or owns a resource before allowing an operation.
        *   Re-implement any logic previously handled by Supabase triggers or database functions within the API or as new database triggers if appropriate.
    5.  **API Authentication/Authorization Middleware:**
        *   Integrate your backend API with the new authentication server.
        *   Implement middleware to verify JWTs on incoming requests and extract user information.
*   **Deliverables:**
    *   Functional backend API with endpoints covering existing functionality.
    *   Secure API endpoints protected by the new authentication system.
    *   Automated tests for API endpoints.

---

**Phase 3: File Storage Implementation**

*   **Objective:** Set up a self-hosted solution for file uploads and serving.
*   **Tasks:**
    1.  **Finalize Storage Choice (based on Phase 0 discovery):**
        *   If MinIO: Install and configure MinIO (preferably via Docker). Create buckets and access policies.
        *   If Local Filesystem: Define directory structure and permissions.
    2.  **Implement Upload Functionality:**
        *   Create API endpoints in your new backend to handle file uploads.
        *   These endpoints will receive files, potentially perform validation/transformation, and then store them in MinIO or the local filesystem.
        *   Update database schemas to store file identifiers/paths from the new storage system (e.g., MinIO object keys or file paths).
    3.  **Implement File Serving/Access Control:**
        *   Determine how files will be served (directly from MinIO/filesystem via reverse proxy, or proxied through the backend API for finer-grained access control).
        *   Implement authorization for file access if needed.
    4.  **Migrate Existing Files:**
        *   If files are currently in Supabase Storage, develop a script to download them and upload them to the new self-hosted storage solution.
        *   Update database records with the new file locations/identifiers.
*   **Deliverables:**
    *   Running self-hosted file storage solution.
    *   API endpoints for uploading and accessing files.
    *   Migrated existing files (if any).

---

**Phase 4: Real-time Functionality Replacement**

*   **Objective:** Implement self-hosted real-time capabilities.
*   **Tasks:**
    1.  **Confirm Real-time Requirements (from Phase 0 audit).**
    2.  **Set up Real-time Server/Mechanism:**
        *   Install and configure your chosen real-time solution (e.g., Socket.IO integrated into your Node.js backend, or a standalone Centrifugo server).
    3.  **Integrate with Backend API:**
        *   Modify backend API endpoints to publish events to the real-time server when relevant data changes (e.g., new forum post, new comment).
    4.  **Client-Side Integration (covered in Phase 5):** The frontend will need to connect to this new real-time endpoint.
*   **Deliverables:**
    *   Functional real-time server/mechanism.
    *   Backend API integrated to publish real-time events.

---

**Phase 5: Frontend Adaptation**

*   **Objective:** Update the frontend application to communicate with the new self-hosted backend services.
*   **Tasks:**
    1.  **Update API Calls:**
        *   Modify all frontend code that makes API requests to point to the new backend API endpoints.
        *   Adjust data fetching libraries (e.g., SWR, React Query) accordingly.
    2.  **Integrate New Authentication:**
        *   Replace Supabase client-side authentication logic with logic for the new auth system (e.g., using an OIDC client library for Keycloak, or custom JWT handling).
        *   Update login forms, registration flows, and session management.
    3.  **Integrate New File Uploads:**
        *   Modify frontend components to upload files to the new backend API endpoint for storage.
        *   Update how file URLs are displayed/retrieved.
    4.  **Integrate New Real-time:**
        *   Implement client-side logic to connect to the new real-time server and subscribe to relevant events.
        *   Update UI components to reflect real-time data changes.
*   **Deliverables:**
    *   Frontend application fully integrated with all new self-hosted backend services.

---

**Phase 6: Deployment, Testing & Refinement**

*   **Objective:** Deploy all components into a staging/production-like environment and conduct thorough testing.
*   **Tasks:**
    1.  **Containerize All Services:** Ensure PostgreSQL, Auth Server, Backend API, MinIO, Real-time Server are all containerized using Docker. Update `docker-compose.yml`.
    2.  **Set up Reverse Proxy:** Configure Traefik (or chosen alternative) for SSL, routing requests to the appropriate backend services.
    3.  **Environment Configuration:** Manage environment variables securely for different environments (dev, staging, prod).
    4.  **Comprehensive Testing:**
        *   **Unit Tests:** For backend logic and frontend components.
        *   **Integration Tests:** Test interactions between services (API <-> DB, API <-> Auth).
        *   **End-to-End (E2E) Tests:** Simulate user flows through the entire application.
        *   **Performance Testing:** Basic load testing to identify bottlenecks.
        *   **Security Testing:** Check for common vulnerabilities (OWASP Top 10).
    5.  **Refinement:** Address any bugs or performance issues identified during testing.
*   **Deliverables:**
    *   Fully containerized and deployable application stack.
    *   Staging environment mirroring production setup.
    *   Test plan and test results.

---

**Phase 7: Go-Live & Post-Migration Monitoring**

*   **Objective:** Transition to the new self-hosted system and ensure its stability.
*   **Tasks:**
    1.  **Final Data Sync:** Perform a final data migration from Supabase to the self-hosted PostgreSQL to capture any changes since the initial migration. This will likely require some downtime.
    2.  **Update DNS Records:** Point your application's domain to the new server/reverse proxy.
    3.  **Monitoring & Logging:**
        *   Implement comprehensive logging for all services.
        *   Set up monitoring tools (e.g., Prometheus, Grafana, Uptime Kuma) to track system health, performance, and errors.
    4.  **Decommission Supabase Project:** Once confident in the new system, plan for the eventual decommissioning of the Supabase project (after a safe period of observation).
*   **Deliverables:**
    *   Live application running on the self-hosted infrastructure.
    *   Monitoring and logging systems in place.
    *   Plan for Supabase decommissioning.

---

**Mermaid Diagram - High-Level Architecture (Self-Hosted):**

```mermaid
graph TD
    subgraph User Device
        Frontend[Frontend Application (React/Flutter/Node.js)]
    end

    subgraph Internet
        DNS
    end

    subgraph Self-Hosted Infrastructure (Dockerized)
        ReverseProxy[Reverse Proxy (Traefik/Nginx)]

        subgraph API & Auth
            BackendAPI[Backend API (Node.js/Python/Go)]
            AuthServer[Authentication Server (Keycloak)]
        end

        subgraph Data & Storage
            PostgreSQL[PostgreSQL Database]
            FileStorage[File Storage (MinIO)]
        end

        subgraph Real-time
            RealtimeServer[Real-time Server (Socket.IO/Centrifugo)]
        end
    end

    UserDevice -- HTTPS --> DNS
    DNS -- Resolves to --> ReverseProxy

    ReverseProxy -- Routes --> BackendAPI
    ReverseProxy -- Routes --> AuthServer
    ReverseProxy -- Routes --> FileStorage
    ReverseProxy -- WebSocket --> RealtimeServer

    Frontend -- API Calls --> BackendAPI
    Frontend -- Auth Flows --> AuthServer
    Frontend -- File Uploads/Downloads --> FileStorage
    Frontend -- Real-time Connection --> RealtimeServer

    BackendAPI -- CRUD, Logic --> PostgreSQL
    BackendAPI -- User Info --> AuthServer
    BackendAPI -- File Metadata --> PostgreSQL
    BackendAPI -- Stores/Retrieves Files --> FileStorage
    BackendAPI -- Publishes Events --> RealtimeServer

    AuthServer -- User Data --> PostgreSQL  # (Or its own DB, depending on setup)