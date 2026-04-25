# Slate PM

Slate PM is a collaborative project management application designed for focus and productivity. It combines a minimal user interface with powerful real-time collaboration and advanced AI capabilities.

## Overview

Slate PM transforms task management from a simple list into a dynamic, collaborative workspace. It supports multiple boards, real-time synchronization via Supabase, and a suite of AI-driven features to help teams move faster.

## Core Features

### Board Management
- Multiple Boards: Create and manage multiple independent projects.
- Dynamic Columns: Customize columns to fit your specific workflow.
- Drag and Drop: Effortlessly reorder tasks and move them across columns using a fluid interface powered by dnd-kit.

### Real-time Collaboration
- Supabase Integration: Powered by Supabase for secure authentication and real-time database synchronization.
- Multi-user Support: Invite team members to your boards and see changes as they happen.
- Member Management: Control access with owner and member roles.

### AI Superpowers
- Smart Task Generation: Generate comprehensive task lists from a single prompt.
- Difficulty Estimation: AI automatically assesses the complexity of your tasks (Simple, Medium, Complex).
- Tag Suggestion: Intelligent labeling to help categorize and organize your work.
- Conversation Summarization: Generate concise summaries of comments and discussions on your board.
- Board Awareness: AI can execute actions like moving or updating cards based on natural language instructions.

### Analytics and History
- Completed History: Automatically track and archive completed tasks for progress reporting.
- Status Indicators: Visual feedback for sync status and connection health.

## Technology Stack

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- State Management: Zustand
- Real-time/Backend: Supabase
- AI Engine: OpenRouter / OpenAI
- Drag and Drop: dnd-kit
- Testing: Vitest and Playwright

## Getting Started

### Prerequisites
- Node.js 18 or higher
- A Supabase project
- An OpenRouter API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd slate-pm
```

2. Install dependencies:
```bash
npm install
```

3. Configure Environment Variables:
Create a `.env` file in the root directory and add the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Development

Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Testing

Run unit tests:
```bash
npm run test:unit
```

Run end-to-end tests:
```bash
npm run test:e2e
```

## Database Schema

The application uses the following Supabase tables:
- boards: Stores project boards.
- board_members: Manages user access and roles.
- columns: Stores board columns and their order.
- cards: Individual task cards.
- comments: Discussion comments on cards.
- completed_records: History of finished tasks.

## Usage Guide

### Creating a Board
1. Click the "New Board" button in the sidebar.
2. Enter a title and description.
3. Your new board will appear in the sidebar navigation.

### Inviting Members
1. Open the Board Settings panel.
2. Enter the email address of the team member you wish to invite.
3. Once they join, they will have real-time access to the board.

### Using AI Features
- Task Breakdown: Use the AI prompt box to describe a goal, and the AI will generate actionable task cards.
- Summarization: In the AI panel, select "Summarize" to get a bird's-eye view of board activity.
- Tagging: Use the "Tags" tab in the AI panel to get automated label suggestions for your tasks.
