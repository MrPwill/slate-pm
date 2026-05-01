# Slate PM

Slate PM is a collaborative Kanban project management application designed for focus and productivity. It combines a minimal, clean user interface with real-time collaboration and AI-powered features to streamline project workflows.

## Live Demo

**Production URL**: [https://slate-pm.vercel.app/](https://slate-pm.vercel.app/)

## Overview

Slate PM organizes work into a five-column Kanban board:

1. **Backlog** - Ideas and future work. New tasks land here, waiting to be prioritized.
2. **Todo** - Ready to start. Tasks that are confirmed and queued for work.
3. **In Progress** - Currently working on. Active tasks being executed.
4. **Review** - Needs verification. Completed work awaiting a review pass.
5. **Done** - Completed tasks. Archived and tracked in the completed history panel.

## Key Features

- **Kanban Board** - Drag-and-drop tasks across five columns (Backlog, Todo, In Progress, Review, Done) with smooth animations using dnd-kit
- **Multi-Board Support** - Create and manage multiple independent project boards for different initiatives
- **User Accounts** - Sign up and log in with email and password using Supabase Auth
- **Completed History** - Every task moved to Done is archived with a timestamp and full details in a historical panel
- **AI Task Generation** - Describe a project goal and AI generates actionable task cards distributed across columns
- **AI Difficulty Estimation** - AI analyzes card content and estimates complexity (Simple, Medium, Complex)
- **AI Tag Suggestions** - AI suggests relevant tags based on card content to help organize tasks
- **AI Conversation Summarization** - Generate concise summaries of card comments and discussions via AI
- **Card Comments** - Add discussion threads to any task card for team collaboration
- **Board Member Invitations** - Invite other registered users to collaborate on boards with member access
- **Column Renaming** - Customize column titles to fit your workflow
- **Mobile Responsive** - Full UI works seamlessly on desktop and mobile devices
- **Real-time Sync** - Changes sync instantly across sessions via Supabase Realtime

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode, no `any` types)
- **Styling**: Tailwind CSS
- **State Management**: Zustand with localStorage persistence
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **AI Engine**: OpenRouter API (OpenAI-compatible, using gpt-oss-120b model)
- **Drag and Drop**: dnd-kit (@dnd-kit/core, @dnd-kit/sortable)
- **Icons**: Lucide React
- **Testing**: Vitest (unit tests) + Playwright (end-to-end tests)

## Project Structure

```
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
│   ├── components/               # React components
│   │   ├── ai/                  # AI-related components
│   │   ├── common/              # Shared UI components
│   │   ├── layout/              # Layout components
│   │   └── boards/              # Board-specific components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Libraries and utilities
│   │   ├── ai.ts                # AI response parsing
│   │   ├── seed.ts              # Development seed data
│   │   └── supabase/           # Supabase client, auth, operations
│   ├── store/                   # Zustand stores
│   └── types/                   # TypeScript type definitions
├── supabase/
│   └── migrations/              # Database migrations
├── tests/
│   └── e2e/                    # Playwright end-to-end tests
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── vitest.config.ts
├── playwright.config.ts
└── tsconfig.json
```

## Data Storage

All data is stored in Supabase (PostgreSQL):

### Database Tables

- **auth.users** - User accounts via Supabase Auth (email/password)
- **profiles** - User profile data (name, linked to auth.users)
- **boards** - Project board metadata (title, description, owner)
- **board_members** - User access and roles per board (owner/member)
- **columns** - Board columns with ordering and titles
- **cards** - Individual task cards with title, details, order
- **comments** - Discussion comments on cards
- **completed_records** - Archived completed tasks with timestamps

### Local State

Zustand with localStorage persistence handles:
- Active board columns and cards in-memory
- Current user session state
- Completed history records

### Security

Row Level Security (RLS) policies ensure:
- Users can only access boards they own or are members of
- Owners can modify board settings and members
- Members can view and edit cards/columns within their boards

## Installation

### Prerequisites

- Node.js 18 or higher
- A Supabase project (free tier works)
- An OpenRouter API key (for AI features)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/MrPwill/slate-pm.git
   cd slate-pm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. Apply the Supabase migration `supabase/migrations/20260424000000_initial_schema.sql` in your Supabase SQL Editor. This creates all required tables, indexes, security functions, and RLS policies.

5. (Optional) Apply the profiles migration `supabase/migrations/20260426000000_profiles_table.sql` if you need user profile support.

6. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### Account

1. Create an account with your name, email, and password using the signup form
2. Log in to access your boards and completed history
3. Accounts are stored securely in Supabase and accessible from any device

### Boards

1. Click the "New Board" button in the sidebar to create a project
2. Enter a title and description for your board
3. Your board appears in the sidebar navigation. Click to switch between boards
4. Click the board menu (three dots) to access settings, rename, or delete

### Tasks

1. Click the "+" button in any column header to add a task card
2. Enter a title and details for the task
3. Drag cards between columns to update their status
4. Use the card menu to edit details, delete, or view comments
5. Click on a card to open it for more details and add comments

### Columns

1. Click on a column title to rename it
2. Columns maintain their custom names across sessions

### Completion

1. Drag a card from any column to the Done column
2. The card is archived with a timestamp in the Completed History panel
3. Click "History" in the sidebar to view completed tasks over time

### AI Features

1. **Generate Tasks** - Enter a goal description in the AI task panel and click "Generate Tasks". AI creates task cards distributed across your columns based on your input
2. **Estimate Difficulty** - Open any card and click "Estimate Difficulty" to analyze its complexity
3. **Suggest Tags** - Open any card and click "Suggest Tags" to get automated label recommendations
4. **Summarize** - On cards with multiple comments, click "Summarize" to generate a conversation summary

### Inviting Members

1. Open the Board Settings panel (via board menu)
2. Enter the email address of a registered user to invite them
3. They receive member access and can view and edit the board

## Running Tests

```bash
npm run test:unit    # Unit tests (Vitest)
npm run test:e2e     # End-to-end tests (Playwright)
npm run test         # Run all tests
```

## Deployment

The app deploys to Vercel. Push to the main branch or connect your GitHub repository to Vercel for automatic deployments.

### Supabase Configuration for Vercel

In your Supabase dashboard under Authentication > URL Configuration:

- **Site URL**: Set to your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
- **Redirect URLs**: Add your Vercel URL with `/**` wildcard (e.g., `https://your-app.vercel.app/**`)

This ensures Supabase Auth redirects work from your deployed site.

### Build Configuration

For Vercel deployment, the following build settings are used:
- Framework Preset: Next.js
- Build Command: `next build` (default)
- Output Directory: `.next` (default)

The `next.config.ts` is configured with `output: 'standalone'` for optimized production builds.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI features | Yes (AI features won't work without it) |

## License

MIT License - See LICENSE file for details.