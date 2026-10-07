# DevCore

A personal developer knowledge and learning workspace built with Next.js 16, Prisma 7, and PostgreSQL. DevCore helps developers capture, organize, and track their learning journey through notes, code snippets, questions, and topics.

## Features

### Core Entities

- **Notes**: Rich text documentation with support for code snippets, formatting, and markdown-like editing using TipTap editor
- **Snippets**: Code snippets with syntax highlighting, organized by programming language
- **Questions**: Track what you don't understand yet, with answers and related notes
- **Topics**: Hierarchical topic organization to structure your knowledge base
- **Tags**: Flexible tagging system for cross-referencing content

### Key Capabilities

- **Rich Text Editing**: Full-featured rich text editor with:
  - Bold, italic, underline formatting
  - Code blocks with syntax highlighting
  - Lists (bullet and numbered)
  - Links
  - Text colors and highlights
  - Multiple font sizes

- **Question-Note Connections**: Link questions to related notes for context and reference

- **Hierarchical Topics**: Organize content in nested topic trees with unlimited depth

- **Tag System**: Apply tags to notes, questions, and snippets for flexible categorization

- **Dashboard**: Overview of your knowledge with stats, open questions, and recent activity

- **Filtering & Search**: Filter content by topic, tags, and status (for questions)

## Tech Stack

### Frontend

- **Next.js 16.3.6** - React framework with App Router
- **React 19.2.8** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **TipTap 3.31.4** - Rich text editor
  - Starter Kit, Highlight, Text Style extensions
  - HTML generation for server-side rendering

### Backend

- **Prisma 7.10.0** - ORM with PostgreSQL adapter
- **PostgreSQL** - Database
- **Better Auth 1.7.6** - Authentication with email/password
- **Next.js Server Actions** - API mutations and queries

### Development Tools

- **ESLint 9** - Linting
- **tsx** - TypeScript execution for scripts

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd devcore
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/devcore"
DATABASE_URL_UNPOOLED="postgresql://user:password@localhost:5432/devcore"
SHADOW_DATABASE_URL="postgresql://user:password@localhost:5432/devcore_shadow"
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
```

4. Run Prisma migrations:

```bash
npx prisma migrate dev
```

5. Generate Prisma Client:

```bash
npx prisma generate
```

6. Start the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
devcore/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── prisma7.config.ts      # Prisma 7 configuration
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   ├── dashboard/         # Dashboard page
│   │   ├── notes/             # Notes pages (list, view, edit, new)
│   │   ├── questions/         # Questions pages (list, view, edit, new)
│   │   ├── snippets/          # Snippets pages (list, view, edit, new)
│   │   ├── topics/            # Topics pages (list, view, edit, new)
│   │   ├── tags/              # Tags pages (list, view)
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── editor/            # Rich text editor components
│   │   │   ├── RichTextEditor.tsx
│   │   │   ├── RichTextToolbar.tsx
│   │   │   ├── renderRichText.ts
│   │   │   └── serverExtensions.ts
│   │   ├── layout/            # Layout components
│   │   │   ├── AppShell.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ui/                # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── PageHeader.tsx
│   │       ├── Tabs.tsx
│   │       └── DevCoreLogo.tsx
│   ├── config/
│   │   └── navigation.ts      # Navigation configuration
│   ├── features/              # Feature-specific modules
│   │   ├── auth/              # Authentication
│   │   ├── dashboard/        # Dashboard components
│   │   ├── notes/             # Notes feature
│   │   ├── questions/         # Questions feature
│   │   ├── snippets/          # Snippets feature
│   │   ├── tags/              # Tags feature
│   │   ├── topics/            # Topics feature
│   │   └── search/            # Search functionality
│   ├── server/                # Server-side code
│   │   ├── auth/              # Auth configuration
│   │   ├── db/                # Database connection
│   │   ├── dashboard/         # Dashboard queries
│   │   ├── notes/             # Notes queries, mutations, mappers
│   │   ├── questions/         # Questions queries, mutations, mappers
│   │   ├── snippets/          # Snippets queries, mutations, mappers
│   │   ├── tags/              # Tags queries, mutations, access control
│   │   ├── topics/            # Topics queries, mutations, access control
│   │   ├── users/             # User queries
│   │   └── search/            # Search actions
│   └── styles/
│       └── globals.css        # Global styles
├── .env.example              # Environment variables template
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── package.json              # Dependencies and scripts
```

## Database Schema

### Core Models

- **User**: User accounts with authentication
- **Topic**: Hierarchical topics for organizing content
- **Note**: Rich text documentation
- **Question**: Questions with answers and status tracking
- **Snippet**: Code snippets with language support
- **Tag**: Tags for categorization

### Relationships

- Notes, Questions, and Snippets can belong to a Topic
- Notes, Questions, and Snippets can have multiple Tags
- Questions can be linked to related Notes via QuestionNote junction table
- Users own all content (Notes, Questions, Snippets, Topics, Tags)

### Key Fields

- **Note**: `title`, `content` (JSON), `topicId`, tags
- **Question**: `question` (JSON), `answer` (JSON), `status` (OPEN/RESOLVED), related notes
- **Snippet**: `title`, `language`, `code`, `description`, `topicId`, tags
- **Topic**: `name`, `slug`, `parentId`, `sortOrder`
- **Tag**: `name` (unique per user)

## Feature Modules

### Notes

- Create, edit, delete notes with rich text content
- Organize notes by topic
- Tag notes for categorization
- Preview notes in lists with text extraction from JSONContent

### Questions

- Capture questions you don't understand
- Add answers when you figure them out
- Track question status (Open/Resolved)
- Link questions to related notes for context
- View questions and answers side-by-side with tabbed interface for related notes
- Rich text editing for both questions and answers

### Snippets

- Store code snippets with syntax highlighting
- Organize by programming language
- Add descriptions and categorize by topic
- One-click copy to clipboard

### Topics

- Hierarchical topic tree structure
- Create nested topics with unlimited depth
- Reorder topics within the same parent
- System topics (shared) and personal topics
- Visual tree representation

### Tags

- Create and manage tags
- Apply tags to notes, questions, and snippets
- Tag colors for visual distinction
- Filter content by tags

### Dashboard

- Overview of knowledge base statistics
- Display open questions
- Show recent notes, questions, and snippets
- Quick action buttons for creating new content

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Operations

```bash
npx prisma migrate dev          # Create and apply migrations
npx prisma migrate deploy       # Deploy migrations (production)
npx prisma studio               # Open Prisma Studio GUI
npx prisma generate             # Generate Prisma Client
npx prisma db push              # Push schema changes (development only)
```

### Adding New Features

Each feature follows a consistent structure:

1. **Types**: Define TypeScript types in `src/features/[feature]/types/`
2. **Components**: Create UI components in `src/features/[feature]/components/`
3. **Server Code**: Add queries, mutations, and mappers in `src/server/[feature]/`
4. **Pages**: Create Next.js pages in `src/app/[feature]/`

### Access Control

Topics and Tags have access control:

- **Topics**: Can be system-wide (createdByUserId: null) or personal
- **Tags**: Always owned by a user, unique per user

Access is enforced through `requireAccessibleTopic` and `requireOwnedTags` functions.

## Authentication

DevCore uses Better Auth for authentication:

- Email/password authentication
- Session-based auth
- User registration and login pages
- Protected routes check for authenticated user

## Rich Text Editor

The rich text editor is built with TipTap and includes:

- **Server Extensions**: Configured in `src/components/editor/serverExtensions.ts`
- **Toolbar**: Full formatting toolbar in `src/components/editor/RichTextToolbar.tsx`
- **Rendering**: Server-side HTML generation in `src/components/editor/renderRichText.ts`
- **Preview**: Text extraction utilities for list views

## Navigation

Navigation is configured in `src/config/navigation.ts`:

- Dashboard
- Topics
- Notes
- Snippets
- Questions
- Tags

Additional sections (Resources, Mistakes, Review) are commented out for future expansion.

## Future Enhancements

The codebase has placeholders for:

- Resources section
- Mistakes tracking
- Review system
- Snippet-note connections (schema partially implemented)

## License

Private project
