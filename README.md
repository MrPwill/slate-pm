# Slate PM

Slate PM is a professional, collaborative Kanban project management application engineered for focus and high-performance teams. It integrates a refined, minimalist user interface with robust real-time synchronization and advanced AI-powered utilities to optimize project lifecycles.

## Project Overview

Slate PM structures workflows through a strategic five-column Kanban methodology:

1. Backlog: Repository for initial concepts and prospective work. All new tasks originate here before prioritization.
2. Todo: Queue for tasks that have been verified and are ready for immediate execution.
3. In Progress: Active workspace for tasks currently under development or execution.
4. Review: Quality assurance stage for completed work requiring verification or peer review.
5. Done: Terminal state for finished tasks. Once moved here, tasks are archived into the persistent completed history system.

## Core Features

- Advanced Kanban Interface: Fluid drag-and-drop task management utilizing the dnd-kit library for high-performance interactions.
- Multi-Board Architecture: Support for independent project environments, enabling segregated management of diverse initiatives.
- Secure Authentication: User identity management powered by Supabase Auth, supporting secure email/password credentialing.
- Persistent Completed History: Automated archival system that tracks every completed task with precise timestamps and historical metadata.
- Intelligent Task Generation: AI-driven workflow initialization where high-level project goals are transformed into granular, actionable task distributions.
- AI Complexity Analysis: Automated difficulty estimation (Simple, Medium, Complex) based on task content and historical context.
- Automated Categorization: Intelligent tag suggestions to maintain organizational hygiene and improve task discoverability.
- Conversation Synthesis: AI-powered summarization of task-level discussions, providing quick context for collaborators.
- Real-time Synchronization: Instantaneous state updates across all connected clients via Supabase Realtime protocols.
- Collaborative Invitations: Granular access control allowing board owners to invite registered collaborators via secure email association.
- Workflow Customization: User-defined column naming to adapt the Kanban structure to specific team requirements.
- Responsive Design: Fully optimized interface for seamless operation across desktop, tablet, and mobile hardware.

## Technology Stack

- Framework: Next.js 15 (utilizing the App Router architecture)
- Language: TypeScript (Strict mode enforcement for type safety)
- Styling: Tailwind CSS 4.0
- State Management: Zustand with localStorage persistence and cloud synchronization
- Backend Infrastructure: Supabase (PostgreSQL Database, Realtime Engine, and Authentication)
- Artificial Intelligence: OpenRouter API (utilizing the gpt-oss-120b model)
- Interaction Layer: dnd-kit (Core and Sortable modules)
- Iconography: Lucide React
- Testing Suite: Vitest (Unit and Integration) and Playwright (End-to-End)

## System Architecture

Slate PM follows a modern cloud-native architecture, utilizing a "local-first, sync-later" approach to ensure a responsive user experience with robust data persistence.

```text
+-----------------------------------------------------------------------+
|                          Next.js Frontend (App Router)                |
|  +--------------+        +--------------+        +-----------------+  |
|  |  Sidebar     |        |  Kanban Board|        |  Settings Panel |  |
|  |  Navigation  | <----> |  Workspace   | <----> |  Management     |  |
|  +--------------+        +--------------+        +-----------------+  |
|                                 ^                                     |
|                                 |                                     |
|                        +------------------+                           |
|                        |  Zustand Store   |                           |
|                        |  (Client State)  |                           |
|                        +---------+--------+                           |
+----------------------------------|------------------------------------+
                                   |
          +------------------------+------------------------+
          |                        |                        |
+---------v---------+    +---------v---------+    +---------v---------+
|     Supabase      |    |    OpenRouter     |    |   localStorage    |
|   (PostgreSQL +   |    |    (AI Engine)    |    |    (Offline       |
|    Realtime)      |    |                   |    |     Fallback)     |
+-------------------+    +-------------------+    +-------------------+
```

### Architectural Principles

- Unified State Management: Zustand serves as the single source of truth for the client application, orchestrating updates between the UI and external services.
- Real-time Convergence: Changes are propagated across clients using Supabase Realtime, enabling seamless collaboration without manual refreshes.
- Local-First Persistence: Critical board data is cached in localStorage to maintain functionality during intermittent connectivity.
- Decoupled AI Logic: AI features are implemented as stateless operations via OpenRouter, allowing for flexible model selection and high-performance task generation.

## Technical Architecture

### Directory Structure

```text
slate-pm/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── boards/               # Board CRUD endpoints
│   │   ├── cards/               # Card CRUD endpoints
│   │   ├── columns/             # Column CRUD endpoints
│   │   ├── generate-tasks/       # AI task generation endpoint
│   │   └── summarize/           # AI conversation summarization endpoint
│   ├── page.tsx                  # Landing/auth page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── src/
│   ├── components/               # Modular React components (AI, Boards, Common, Layout)
│   ├── hooks/                   # Custom React hooks for state, sync, and services
│   ├── lib/                     # Core utility logic and service configurations
│   ├── store/                   # Centralized state management (Zustand)
│   └── types/                   # Domain-specific TypeScript definitions
├── supabase/
│   └── migrations/              # Versioned SQL migration scripts
└── tests/
    └── e2e/                    # Comprehensive end-to-end specifications
```

### Data Model and Security

The application utilizes a relational PostgreSQL schema hosted on Supabase:

- profiles: Extends auth.users with application-specific metadata.
- boards: Stores project board configurations and ownership.
- board_members: Manages the many-to-many relationship between users and boards with role-based access.
- columns: Defines the structural segments of each board.
- cards: Represents individual units of work with associated metadata and ordering.
- comments: Threaded discussions associated with specific cards.
- completed_records: Immutable archive of finished work.

Security is enforced at the database level using Row Level Security (RLS) policies, ensuring that users can only interact with data they are explicitly authorized to access.

## Installation and Deployment

### System Requirements

- Node.js 18.0.0 or higher
- Supabase Project Instance
- OpenRouter API Credentials

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/MrPwill/slate-pm.git
   cd slate-pm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. Initialize the database:
   Execute the migration scripts located in `supabase/migrations/` within the Supabase SQL Editor to establish the schema and RLS policies.

5. Execute the development environment:
   ```bash
   npm run dev
   ```

### Production Deployment

The application is optimized for deployment on Vercel. Ensure that the Supabase Site URL and Redirect URLs are correctly configured in the Supabase Authentication dashboard to match your production domain.

Production URL: https://slate-pm.vercel.app/

## Quality Assurance

The project maintains a rigorous testing standard:

- Unit Testing: `npm run test:unit`
- End-to-End Testing: `npm run test:e2e`
- Full Suite: `npm run test`

## How to Use

### Account Setup

1. Open the application in your browser
2. Enter your email address and create a password
3. Click "Sign Up" to create your account
4. After registration, you are automatically signed in

### Creating a Board

1. After signing in, click the "Create Board" button in the sidebar
2. Enter a title for your board (e.g., "Website Redesign", "Q2 Marketing")
3. Optionally add a description to provide context
4. Click "Create" to initialize the board
5. The board is created with five default columns: Backlog, Todo, In Progress, Review, Done

### Managing Tasks

#### Creating Tasks

1. Click the "+" button in any column header
2. Enter a title for your task
3. Optionally add details in the description field
4. Press Enter or click away to save the task

#### Moving Tasks

1. Click and hold on any task card
2. Drag the card to the desired column
3. Release to drop the card in its new position
4. Tasks can also be reordered within the same column

#### Editing Tasks

1. Click on a task card to open its details view
2. Modify the title or description as needed
3. Changes are saved automatically

#### Deleting Tasks

1. Open the task details
2. Click the delete icon
3. Confirm the deletion

### Using AI Features

#### Task Generation

1. Open the AI Task Panel on the right side of the board
2. Describe your project goal in natural language (e.g., "Build a user authentication system")
3. Click "Generate Tasks"
4. AI creates multiple actionable tasks and places them in the Backlog column
5. Review, edit, or delete generated tasks as needed

#### Conversation Summarization

1. Select a task that has comments
2. In the AI panel, click the "Summarize" tab
3. Click "Generate Summary"
4. AI analyzes all comments and provides a concise summary

#### Tag Suggestions

1. Select any task
2. In the AI panel, click the "Tags" tab
3. Click "Suggest Tags"
4. AI suggests relevant categories based on task content

#### Difficulty Estimation

1. Select any task
2. In the AI panel, click the "Difficulty" tab
3. Click "Estimate"
4. AI classifies the task as Simple, Medium, or Complex based on complexity analysis

### Completing Tasks

1. Drag a task from the "Review" column to the "Done" column
2. The task is automatically archived to completed history
3. Completed tasks appear in the Completed History panel for reference

### Collaborating with Team Members

#### Inviting Members

1. Open the board settings (click the board title or settings icon)
2. Navigate to the "Members" section
3. Enter the email address of the person you want to invite
4. Click "Invite"
5. The invited user receives access to the board

#### Managing Members

- Board owners can remove members at any time
- Members can leave a board through the settings panel
- All board members have equal editing rights

### Customizing Columns

1. Click on a column title to edit it
2. Type a new name (e.g., rename "In Progress" to "Development")
3. Press Enter to save the new name

## Data Storage

### Database Schema

The application uses PostgreSQL with the following core tables:

| Table | Purpose |
|-------|---------|
| boards | Stores project board configurations and ownership |
| board_members | Manages the many-to-many relationship between users and boards |
| columns | Defines the structural segments of each board |
| cards | Represents individual units of work |
| comments | Threaded discussions associated with specific cards |
| completed_records | Immutable archive of finished work |
| profiles | Extends auth.users with application-specific metadata |

### Row Level Security

All data access is protected through Row Level Security (RLS) policies:

- Users can only view boards they own or are members of
- Only board owners can modify board settings and member permissions
- Members can create, edit, and move cards within their boards
- Completed records maintain a permanent history accessible to all board members

### Local Fallback

Board data is cached in localStorage to maintain functionality during intermittent connectivity. Changes sync to the cloud when connectivity is restored.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| NEXT_PUBLIC_SUPABASE_URL | Your Supabase project URL | Yes |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anonymous key (anon) | Yes |
| OPENROUTER_API_KEY | OpenRouter API key for AI features | Yes |

### Obtaining Credentials

1. **Supabase**: Create a project at supabase.com, then navigate to Settings > API to find your URL and anonymous key
2. **OpenRouter**: Sign up at openrouter.ai, then create an API key in your dashboard

## License

This project is licensed under the MIT License. Refer to the LICENSE file for comprehensive details.