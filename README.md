# Deadlock Conversations Viewer

A web application for browsing and listening to character conversations from the game Deadlock. This project allows users to:

- Search for conversations by content
- Browse characters and their conversation partners
- Listen to individual dialogue lines or entire conversations
- View conversation details including missing parts and variations

## Features

- Character browsing: View all characters and their conversation partners
- Conversation search: Search for specific dialogue content
- Audio playback: Listen to individual lines or entire conversations
- Variation selection: Choose between different variations of the same dialogue
- Responsive design: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ConvoWebsite.git
   cd ConvoWebsite/convowebsite
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

### Root Files
- `next.config.mjs` - Next.js configuration for static export and GitHub Pages
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration for Tailwind

### Directories
- `/public` - Static assets including audio files and character icons
  - `/audioFiles` - MP3 files of character dialogue
  - `/minimapIcons` - Character portrait images
  - `Sample.json` - The main data file containing all conversation information

- `/src` - Source code for the application
  - `/app` - Next.js app router pages
  - `/components` - Reusable React components
  - `/types` - TypeScript type definitions
  - `/utils` - Utility functions and data context

### Key Files Explained

#### App Pages
- `/src/app/page.tsx` - Homepage with introduction and navigation
- `/src/app/characters/page.tsx` - List of all characters
- `/src/app/characters/[name]/page.tsx` - Server component for character details
- `/src/app/characters/[name]/CharacterPageClient.tsx` - Client component for character UI
- `/src/app/conversations/page.tsx` - List of all conversations with search
- `/src/app/conversations/[id]/page.tsx` - Server component for conversation details
- `/src/app/conversations/[id]/ConversationPageClient.tsx` - Client component for conversation UI
- `/src/app/layout.tsx` - Root layout with navigation and data provider

#### Components
- `/src/components/Layout.tsx` - Main layout with navigation
- `/src/components/CharacterCard.tsx` - Card component for character display
- `/src/components/ConversationCard.tsx` - Card component for conversation display
- `/src/components/ConversationPlayer.tsx` - Audio player for conversations
- `/src/components/DialogueLine.tsx` - Individual dialogue line with audio controls
- `/src/components/LoadingSpinner.tsx` - Loading indicator
- `/src/components/SearchBar.tsx` - Search input component
- `/src/components/VariationSelector.tsx` - Selector for dialogue variations

#### Utils
- `/src/utils/DataContext.tsx` - React context for global data state
- `/src/utils/dataUtils.ts` - Functions for data loading and manipulation

#### Types
- `/src/types/index.ts` - TypeScript interfaces for data structures

## Website Flow

### Data Flow
1. **Data Loading**: 
   - The application loads conversation data from `Sample.json` using the `loadConversationData` function in `dataUtils.ts`
   - For server components, data is loaded directly from the file system
   - For client components, data is fetched via HTTP request

2. **Data Context**:
   - The `DataProvider` in `DataContext.tsx` makes the data available throughout the application
   - Components can access data using the `useData` hook

### User Flow

1. **Homepage** (`/`):
   - Introduction to the application
   - Navigation links to Characters and Conversations pages

2. **Characters Page** (`/characters`):
   - Grid of character cards with portraits
   - Clicking a character navigates to their detail page

3. **Character Detail Page** (`/characters/[name]`):
   - Character information and portrait
   - List of conversation partners
   - List of conversations featuring the character
   - Links to conversation detail pages

4. **Conversations Page** (`/conversations`):
   - Search bar for finding conversations by content
   - List of all conversations with summaries
   - Clicking a conversation navigates to its detail page

5. **Conversation Detail Page** (`/conversations/[id]`):
   - Conversation information
   - Audio player for the entire conversation
   - Individual dialogue lines with speaker information
   - Variation selector for lines with multiple versions
   - Links to character pages for both participants

### Static Site Generation
- The application uses Next.js's static site generation for all pages
- Dynamic routes (`[name]` and `[id]`) use `generateStaticParams` to pre-render all possible paths
- This enables deployment to GitHub Pages as a fully static site

## Deployment

### Option 1: Deploy as a Static Website (Recommended)

1. **Build the static site**:
   ```bash
   npm run build
   ```
   This creates a static export in the `out` directory.

2. **Host the static files**:
   - Upload all files from the `out` directory to any static hosting service
   - Options include GitHub Pages, Netlify, Vercel, Amazon S3, or any web server
   - For GitHub Pages deployment, you can use:
     ```
     npm run deploy
     ```

3. **Ensure audio files are accessible**:
   - The `public/audioFiles` directory must be accessible at the same relative path
   - All audio files should be in the correct location relative to your HTML files

### Option 2: Manual Deployment

If you're having trouble with the build process:

1. **Copy the following essential files**:
   - HTML: Copy the main index.html file and create folders for characters and conversations
   - CSS: Create a styles.css file with your styling
   - JavaScript: Include the necessary JavaScript files for functionality
   - JSON: Include the Sample.json file in the root directory
   - Audio: Copy all files from `public/audioFiles` to an audioFiles directory

2. **Adjust any paths as needed**:
   - Update audio file references to point to the correct location
   - Ensure all links between pages work correctly

## Data Format

The application uses a JSON file with the following structure:

```json
{
  "export_date": "2025-02-27T21:31:53.771707",
  "total_conversations": 3,
  "conversations": [
    {
      "conversation_id": "astro_chrono_convo01",
      "character1": "astro",
      "character2": "chrono",
      "conversation_number": "01",
      "is_complete": false,
      "missing_parts": [1],
      "starter": "astro",
      "lines": [
        {
          "part": 2,
          "variation": 1,
          "speaker": "astro",
          "filename": "astro_match_start_astro_chrono_convo01_02.mp3",
          "transcription": "I don't care about you or your friends.",
          "has_transcription": true
        }
      ],
      "summary": "[Not enough transcribed content for summary]"
    }
  ]
}
```

## License

This project is for personal use only. All game assets belong to their respective owners.
