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

## Technical Architecture

### Directory Structure

- app/: Next.js 15 App Router definitions and API endpoints.
- src/components/: Modular React components categorized by domain (AI, Boards, Common, Layout).
- src/hooks/: Custom React hooks for state, sync, and external service interactions.
- src/lib/: Core utility logic including AI processing and Supabase client configurations.
- src/store/: Centralized state management using Zustand.
- src/types/: Domain-specific TypeScript interfaces and type definitions.
- supabase/migrations/: Versioned SQL migration scripts for database schema evolution.
- tests/: Comprehensive testing directory containing end-to-end specifications.

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

## License

This project is licensed under the MIT License. Refer to the LICENSE file for comprehensive details.