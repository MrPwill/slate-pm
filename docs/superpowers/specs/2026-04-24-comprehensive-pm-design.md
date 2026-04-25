# Comprehensive Project Management Application

**Date:** 2026-04-24  
**Project:** Slate PM  
**Status:** Approved for Implementation

---

## 1. Overview

Transform Slate from a single-board Kanban app into a comprehensive Project Management application with:
- Multiple boards per user (self-service creation)
- Full collaboration with real-time sync
- Enhanced AI features
- Professional testing suite

### Vision Statement

Slate PM is a collaborative project management platform that brings team focus to work. It combines the elegant, minimal UX of the original Kanban app with powerful collaboration features, real-time syncing, and intelligent AI assistance.

---

## 2. Requirements

### BR-001 — Multiple Boards
- Users can create multiple boards
- Boards are self-service (no admin approval required)
- Each board operates independently

### BR-002 — Full Collaboration
- Boards are shared by default with invite-only access
- All collaborators have equal editing rights (member role)
- Real-time sync across all connected clients

### BR-003 — Data Persistence
- Primary storage: Supabase PostgreSQL
- Fallback: localStorage for offline use
- Sync status indicator

### BR-004 — Enhanced AI Features
- AI task generation (existing)
- Auto-summarize conversations
- Suggest categories/labels
- Estimate task difficulty

### BR-005 — User Experience
- Maintain original minimal, clean design
- Enhance with sidebar navigation and board selector
- Dark theme with existing color palette

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Next.js App Router                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Board List  │  │   Board App  │  │  Board Settings│            │
│  │   Sidebar    │  │              │  │   Panel        │            │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                              │                                       │
│                      ┌───────▼────────┐                              │
│                      │  Zustand Store │                              │
│                      │  (Sync w/ Supabase)                          │
│                      └───────┬────────┘                              │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
    ┌─────▼─────┐        ┌─────▼─────┐        ┌─────▼─────┐
    │ Supabase  │        │  OpenRouter│        │  localStorage│
    │  PostgreSQL│        │   API      │        │   (fallback)│
    │ Realtime  │        │            │        │             │
    └───────────┘        └────────────┘        └─────────────┘
```

### Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| State | Zustand + Supabase Realtime |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Realtime | Supabase Realtime |
| AI | OpenRouter (existing) |
| Testing | Vitest + React Testing Library + Playwright |

---

## 4. Database Schema

```sql
-- Users (via auth.users)

-- Boards
create table boards (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users not null,
  title text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Board Members
create table board_members (
  board_id uuid references boards on delete cascade,
  user_id uuid references auth.users on delete cascade,
  role text check (role in ('owner', 'member')) default 'member',
  created_at timestamptz default now(),
  primary key (board_id, user_id)
);

-- Columns
create table columns (
  id uuid default gen_random_uuid() primary key,
  board_id uuid references boards on delete cascade,
  title text not null,
  description text,
  order_index integer not null,
  created_at timestamptz default now()
);

-- Cards
create table cards (
  id uuid default gen_random_uuid() primary key,
  column_id uuid references columns on delete cascade,
  title text not null,
  details text,
  order_index integer not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Comments
create table comments (
  id uuid default gen_random_uuid() primary key,
  card_id uuid references cards on delete cascade,
  user_id uuid references auth.users not null,
  content text not null,
  created_at timestamptz default now()
);

-- Completed history
create table completed_records (
  id uuid default gen_random_uuid() primary key,
  card_id uuid references cards not null,
  board_id uuid references boards not null,
  title text not null,
  details text,
  completed_at timestamptz default now()
);

-- Enable Realtime
drop publication if exists supabase_realtime;
create publication supabase_realtime for table boards, board_members, columns, cards, comments;
```

---

## 5. Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx              # Board navigation
│   │   ├── TopBar.tsx               # User menu, new board button
│   │   └── BoardLayout.tsx          # Main layout wrapper
│   ├── boards/
│   │   ├── BoardList.tsx            # User's boards (empty state + list)
│   │   ├── BoardCard.tsx            # Board preview card
│   │   └── BoardSelector.tsx        # Current board dropdown
│   ├── settings/
│   │   ├── BoardSettingsPanel.tsx   # Board rename, delete, members
│   │   ├── InviteMembers.tsx        # Share board UI
│   │   └── UserSettings.tsx         # Profile, preferences
│   ├── ai/
│   │   ├── EnhancedAiPanel.tsx      # Extended AI features
│   │   ├── SummaryGenerator.tsx     # Auto-summarize conversations
│   │   └── TagSuggester.tsx         # Suggest categories/labels
│   └── common/
│       ├── Button.tsx               # Reusable button
│       ├── Modal.tsx                # Reusable modal
│       └── StatusIndicator.tsx      # Connection status
├── hooks/
│   ├── useSupabase.ts               # Supabase client singleton
│   ├── useBoards.ts                 # Board CRUD operations
│   ├── useRealtimeBoard.ts          # Real-time sync
│   ├── useBoardMembers.ts           # Member management
│   └── useComments.ts               # Comment operations
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   └── database.types.ts
│   └── ai/
│       ├── extensions.ts            # New AI features
│       └── summarize.ts             # Conversation summarization
└── types/
    └── supabase.d.ts
```

---

## 6. API Routes

```
app/
├── api/
│   ├── boards/
│   │   ├── route.ts                 # GET all boards, POST create board
│   │   └── [id]/
│   │       ├── route.ts             # GET/PUT/DELETE board
│   │       └── members/
│   │           ├── route.ts         # GET/POST members
│   │           └── [member_id]/route.ts  # DELETE member
│   ├── columns/
│   │   ├── route.ts                 # POST create column
│   │   └── [id]/route.ts            # PUT/DELETE column
│   ├── cards/
│   │   ├── route.ts                 # POST create card
│   │   └── [id]/route.ts            # PUT/DELETE card
│   ├── comments/
│   │   └── route.ts                 # POST comment
│   ├── generate-tasks/
│   │   └── extended.ts              # Enhanced AI with extensions
│   └── summarize/
│       └── route.ts                 # Auto-summarize conversation
```

---

## 7. Features Breakdown

### 7.1 Board Management
- Create new board (self-service)
- List all boards (sidebar)
- Rename/delete board
- Board selector in top bar
- Board preview card with description

### 7.2 Collaboration
- Invite users by email
- Full collaboration: all members have equal editing rights
- Leave board functionality
- Remove member (board owner only)
- Visual indicator for other active users

### 7.3 Real-time Sync
- Supabase Realtime for board changes
- Conflict resolution (last-write-wins with timestamp)
- Visual indicator when others are editing
- Sync status indicator (online/offline)

### 7.4 Enhanced AI
- AI task generation (existing)
- Auto-summarize conversations (read comments, suggest summary)
- Suggest categories/labels (auto-tag cards)
- Estimate task difficulty (simple/medium/complex)
- Move tasks (suggest column based on content)

### 7.5 Persistence
- Supabase as primary store
- localStorage fallback for offline
- Sync status indicator
- Local-first UX with cloud backup

---

## 8. Testing Strategy

### 8.1 Unit Tests (Vitest)
- Zustand store operations
- Supabase client utilities
- AI extension functions
- Helper functions

### 8.2 Component Tests (React Testing Library)
- BoardList component
- BoardCard component
- Sidebar component
- TopBar component
- BoardSettingsPanel component
- InviteMembers component

### 8.3 Integration Tests
- Board creation flow
- User invite flow
- Card CRUD operations
- Column reorder operations
- Real-time sync between two clients

### 8.4 E2E Tests (Playwright)
- Full user registration and login
- Create multiple boards
- Invite member to board
- Real-time sync verification
- AI task generation
- Comment on card

### 8.5 Test Coverage Targets
- Unit tests: 80%+ coverage
- Component tests: All major components
- Integration tests: Critical user flows
- E2E tests: Core user journeys

---

## 9. Implementation Phases

### Phase 1: Foundation
1. Set up Supabase project and connect
2. Create database schema and types
3. Implement Supabase client and auth utilities
4. Create reusable components (Button, Modal, StatusIndicator)

### Phase 2: Board Management
1. Board list and selection UI
2. Board creation API and UI
3. Board rename/delete functionality
4. Board settings panel

### Phase 3: Collaboration
1. Invite members UI
2. Member management API
3. Real-time sync implementation
4. Active user indicators

### Phase 4: Enhanced AI
1. Summarize conversation endpoint
2. Tag suggester
3. Difficulty estimator
4. Enhanced task generation

### Phase 5: Persistence
1. LocalStorage fallback
2. Sync status indicator
3. Offline mode handling

### Phase 6: Testing
1. Unit tests for new features
2. Component tests
3. Integration tests
4. E2E test suite

### Phase 7: Polish
1. UI enhancements
2. Performance optimization
3. Accessibility review
4. Documentation

---

## 10. Success Criteria

The project is complete when:

- [ ] User can create multiple boards (self-service)
- [ ] User can invite others to boards
- [ ] Real-time sync works between multiple clients
- [ ] All existing features work (drag-and-drop, cards, AI)
- [ ] Enhanced AI features implemented
- [ ] Data persists to Supabase
- [ ] Offline mode with localStorage fallback
- [ ] Unit tests: 80%+ coverage
- [ ] Component tests for all major components
- [ ] Integration tests for critical flows
- [ ] E2E tests for core user journeys
- [ ] UI maintains minimal, clean aesthetic
- [ ] Documentation complete

---

## 11. Out of Scope

These features are explicitly excluded from the MVP:

- File attachments
- Due dates or reminders
- Labels (beyond auto-suggested)
- Advanced analytics or reporting
- Mobile app (web-only)
- Time tracking
- Gantt charts
- Custom workflows

---

*Design document generated by brainstorming skill*
