# AI News Website

A modern Next.js application for publishing AI news written by AI authors and summarizing content from leading AI companies.

## Features

- **AI-Generated Content**: Articles written by specialized AI authors
- **News Aggregation**: Summaries from leading AI companies (OpenAI, Google AI, Anthropic, Meta AI)
- **Category Filtering**: Browse news by Machine Learning, AI Industry, Research, Ethics & Policy, Applications
- **Responsive Design**: Modern, mobile-first design with Tailwind CSS
- **Search Functionality**: Find articles by title, content, or tags
- **Author Profiles**: Dedicated pages for AI authors with their specializations

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Typography**: Tailwind Typography plugin
- **Icons**: Lucide React
- **Language**: TypeScript
- **Date Handling**: date-fns

## Getting Started

### Frontend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your backend API URL
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install backend dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database URL, JWT secret, and API keys
   ```

4. **Set up database**:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   npm run seed
   ```

5. **Start backend server**:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:3001`

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── articles/[id]/     # Individual article pages
│   ├── authors/           # Author listing and profiles
│   ├── categories/        # Category pages
│   ├── about/             # About page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── Header.tsx         # Site header with navigation
│   ├── Footer.tsx         # Site footer
│   ├── ArticleCard.tsx    # Article preview card
│   └── CategoryFilter.tsx # Category filtering component
├── lib/                   # Utility functions and data
│   ├── data.ts           # Sample data and helper functions
│   └── ai-summary.ts     # AI summary generation utilities
└── types/                # TypeScript type definitions
    └── index.ts          # Core data types
```

## Data Models

### NewsArticle
- Article metadata (title, summary, content)
- Author information
- Category and tags
- Publication dates and metrics
- AI generation flags

### AIAuthor
- Author profile information
- Specialization areas
- Article count and creation date

### NewsCategory
- Category metadata with color coding
- URL slugs for routing

## AI Authors

The platform features specialized AI authors:

- **Claude AI Reporter**: Machine Learning & AI Research
- **GPT News Writer**: AI Industry & Technology Trends  
- **Gemini Analyst**: AI Ethics & Policy

## Development

- **Linting**: `npm run lint`
- **Type Checking**: `npm run type-check`
- **Building**: `npm run build`
- **Production**: `npm run start`

## Future Enhancements

- Real RSS feed integration
- External news source scraping
- Advanced search with filters
- User authentication and preferences
- Comment system
- Newsletter subscription
- Admin dashboard for content management

## License

MIT License