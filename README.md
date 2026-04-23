# Slate

A minimal, client-side Kanban board for focused work. Create tasks, move them between columns, and use AI to generate task ideas.

## What It Is

Slate is a single-board task management app with five fixed columns:
- **Backlog** - Ideas and future work
- **Todo** - Tasks ready to start
- **In Progress** - Currently working on
- **Review** - Needs verification
- **Done** - Completed tasks

Each column shows a brief description to help users understand its purpose.

## Features

- **Drag and Drop** - Move cards between columns or reorder within a column
- **Add/Edit/Delete Cards** - Full CRUD operations on tasks
- **Column Renaming** - Customize column titles
- **AI Task Generation** - Ask AI to generate task ideas for any project
- **AI Card Actions** - AI can also move and update existing cards based on your requests
- **Split AI Cards** - Split AI-generated cards into individual task cards
- **Completed History** - Keep a record of completed tasks
- **User Accounts** - Create an account to save your board locally

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
OPENROUTER_API_KEY=your_api_key_here
```

Get your free API key from [OpenRouter](https://openrouter.ai/).

### Running

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

### Creating an Account

1. Enter your name, email, and password
2. Click "Create Account"
3. Your board data is saved locally

### Adding Tasks

1. Click "Add card" on any column
2. Enter a title and optional details
3. Click "Save"

### Moving Tasks

- Use **Up/Down** buttons to reorder within a column
- Use **Left/Right** buttons to move between columns

### Using AI

1. Type a prompt in the Ask AI box (e.g., "How to build a website?" or "How to make a cake?")
2. Select which column to add tasks to
3. Click "Generate"

The AI generates one card with all tasks. Click **Split** to break it into individual task cards.

#### AI Card Actions

In addition to creating tasks, you can ask AI to move and update existing cards. The AI reads your board state and can:

- **Move cards** - "Move the design task to Review" or "Move API task to done"
- **Update cards** - "Rename login task to User authentication" or "Add more details to the testing task"

The AI automatically applies these changes when it understands your intent from the board context.

#### Example

If you ask AI "How to make a cake?", it generates a card with title "Making a Cake" and details containing numbered steps with sub-tasks:

```
1. Gather Ingredients
- List required ingredients (flour, sugar, eggs, butter, baking powder, etc.)
- Check pantry for existing items
- Purchase missing items from store

2. Prepare Batter
- Preheat oven to required temperature
- Measure and sift dry ingredients
- Cream butter and sugar, then add eggs
- Combine wet and dry mixtures to form batter

3. Bake Cake
- Grease and line cake pan
- Pour batter into pan evenly
- Bake for specified time, checking with a toothpick
- Remove from oven and set aside

4. Cool and Frost
- Allow cake to cool completely on a wire rack
- Prepare frosting (buttercream, cream cheese, etc.)
- Level the cake layers if needed
- Frost and decorate as desired
```

Click **Split** to break this into 4 individual cards:
- Card 1: "Gather Ingredients" with sub-tasks
- Card 2: "Prepare Batter" with sub-tasks
- Card 3: "Bake Cake" with sub-tasks
- Card 4: "Cool and Frost" with sub-tasks

### Completing Tasks

Move a card to the "Done" column. It appears in your completed history where you can review or delete it.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state management)
- dnd-kit (drag and drop)
- OpenRouter API (AI)

## Data Storage

All data is stored in your browser's localStorage. No database required. Your tasks persist across sessions on the same device.

## Future Updates

- **AI Column Management** - AI can rename columns or suggest column structure changes
- **AI Task Analysis** - AI analyzes board progress and provides insights on bottlenecks
- **AI Persistent Memory** - AI remembers user preferences and project context across sessions for personalized assistance
- **User Database** - Cloud-based user accounts with persistent storage across devices
- **Keyboard Shortcuts** - Quick actions via keyboard for power users
- **Card Labels/Tags** - Color-coded labels for categorizing tasks
- **Task Dependencies** - Mark tasks that depend on other tasks
- **Search & Filter** - Find cards quickly across all columns
- **Dark Mode** - Toggle between light and dark themes
- **Export Board** - Export tasks as JSON or markdown
