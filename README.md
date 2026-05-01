# Slate PM

Slate PM is a collaborative Kanban project management application designed for focus and productivity. It combines a minimal user interface with real-time collaboration and AI capabilities.

## Overview

Slate PM organizes work into a five-column Kanban board:

1. **Backlog** - Ideas and future work. New tasks land here, waiting to be prioritized.
2. **Todo** - Ready to start. Tasks that are confirmed and queued for work.
3. **In Progress** - Currently working on. Active tasks being executed.
4. **Review** - Needs verification. Completed work awaiting a review pass.
5. **Done** - Completed tasks. Archived and tracked in the completed history panel.

## Key Features

- **Kanban Board**: Drag-and-drop tasks across five columns (Backlog, Todo, In Progress, Review, Done)
- **Multi-Board Support**: Create and manage multiple independent project boards
- **User Accounts**: Sign up and log in with email and password stored in Supabase Auth
- **Completed History**: Every task moved to Done is archived with a timestamp and details
- **AI Task Generation**: Describe a goal and AI generates actionable task cards across columns
- **AI Difficulty Estimation**: AI analyzes card content and estimates complexity (Simple, Medium, Complex)
- **AI Tag Suggestions**: AI suggests tags based on card content
- **Conversation Summarization**: Generate summaries of card comments via AI
- **Mobile Responsive**: Full UI works on desktop and mobile devices
- **Real-time Sync**: Changes sync across sessions via Supabase

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: Zustand with localStorage persistence
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **AI Engine**: OpenRouter API (OpenAI-compatible)
- **Drag and Drop**: dnd-kit
- **Testing**: Vitest

## Data Storage

All data is stored in Supabase (PostgreSQL):

- **auth.users** - User accounts via Supabase Auth (email/password)
- **profiles** - User profile data (name, linked to auth.users)
- **boards** - Project board metadata
- **board_members** - User access and roles per board
- **columns** - Board columns with ordering
- **cards** - Individual task cards
- **comments** - Discussion comments on cards
- **completed_records** - Archived completed tasks with timestamps

Local state (Zustand + localStorage) handles:
- Active board columns and cards in-memory
- Current user session state
- Completed history records

## Installation

### Prerequisites

- Node.js 18 or higher
- A Supabase project
- An OpenRouter API key

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

4. Apply the Supabase migration `supabase/migrations/20260424000000_initial_schema.sql` in your Supabase SQL Editor.

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

**Live Demo**: [https://slate-pm.vercel.app/](https://slate-pm.vercel.app/)

## Usage

### Account

1. Create an account with your name, email, and password.
2. Log in to access your boards and completed history.
3. Accounts are stored securely in Supabase and accessible from any device.

### Boards

1. Click the "New Board" button in the sidebar to create a project.
2. Enter a title and description for your board.
3. Your board appears in the sidebar navigation. Click to switch between boards.

### Tasks

1. Click the "+" button in any column header to add a task card.
2. Enter a title and details for the task.
3. Drag cards between columns to update their status.
4. Use the card menu to edit details, delete, or split multi-section cards.

### Completion

1. Drag a card from any column to the Done column.
2. The card is archived with a timestamp in the Completed History panel.
3. View history to track finished work over time.

### AI

1. Enter a goal description in the AI task panel and click "Generate Tasks".
2. AI creates task cards across your columns based on your input.
3. Use "Estimate Difficulty" to analyze card complexity.
4. Use "Suggest Tags" to get automated label recommendations.
5. Use "Summarize" on cards with comments to generate a conversation summary.

### Inviting Members

1. Open the Board Settings panel.
2. Enter the email address of a registered user to invite them.
3. They gain member access to the board.

## Running Tests

```bash
npm run test:unit    # Unit tests (Vitest)
npm run test:e2e     # End-to-end tests (Playwright)
```

## Deployment

The app deploys to Vercel. Push to the main branch or connect your GitHub repository to Vercel for automatic deployments.

### Supabase Configuration for Vercel

In your Supabase dashboard under Authentication > URL Configuration:

- **Site URL**: Set to your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
- **Redirect URLs**: Add your Vercel URL with `/**` wildcard

This ensures Supabase Auth redirects work from your deployed site.