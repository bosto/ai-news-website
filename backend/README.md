# AI News Website Backend

Express.js backend API for the AI News Website with PostgreSQL database, authentication, and automated news aggregation.

## Features

- **RESTful API**: Complete CRUD operations for articles, authors, and categories
- **Authentication**: JWT-based user authentication and authorization
- **News Aggregation**: Automated news scraping from AI companies with AI-powered summarization
- **Admin Dashboard**: Administrative endpoints for content management
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: OpenAI GPT for content generation and summarization
- **Cron Jobs**: Scheduled news aggregation and cleanup tasks

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcryptjs
- **AI Services**: OpenAI GPT API
- **News Parsing**: RSS Parser, Cheerio for web scraping
- **Scheduling**: Cron jobs
- **Security**: Helmet, CORS, Rate limiting

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database URL, JWT secret, and API keys
   ```

3. **Set up database**:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Seed the database**:
   ```bash
   npm run seed
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

## Environment Variables

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ai_news_db"
PORT=3001
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Public Endpoints

#### Articles
- `GET /api/articles` - Get articles with pagination and filtering
- `GET /api/articles/:id` - Get article by ID
- `GET /api/articles/slug/:slug` - Get article by slug
- `GET /api/articles/:id/related` - Get related articles
- `GET /api/articles/trending` - Get trending articles

#### Authors
- `GET /api/authors` - Get all AI authors
- `GET /api/authors/:id` - Get author by ID
- `GET /api/authors/:id/articles` - Get author's articles
- `GET /api/authors/:id/stats` - Get author statistics

#### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `GET /api/categories/slug/:slug` - Get category by slug
- `GET /api/categories/:id/articles` - Get category's articles
- `GET /api/categories/:id/stats` - Get category statistics

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Admin Endpoints (Admin only)
- `GET /api/admin/dashboard` - Dashboard statistics
- `POST /api/admin/articles` - Create article
- `PUT /api/admin/articles/:id` - Update article
- `DELETE /api/admin/articles/:id` - Delete article
- `POST /api/admin/news/aggregate` - Trigger news aggregation
- `GET /api/admin/news-sources` - Get news sources
- `PUT /api/admin/news-sources/:id` - Update news source
- `GET /api/admin/users` - Get users

## Database Schema

### Core Tables
- **users**: User accounts and authentication
- **ai_authors**: AI author profiles and specializations
- **categories**: News categories with metadata
- **articles**: Main articles with content and metadata
- **news_sources**: External news sources for aggregation
- **news_summaries**: AI-generated summaries of external articles
- **external_articles**: Raw articles from external sources

### Key Relationships
- Articles belong to authors and categories
- News summaries link articles to external sources
- Users can have different roles (USER, ADMIN)

## News Aggregation

The system automatically aggregates news from configured sources:

1. **RSS Feeds**: Parses RSS feeds from AI companies
2. **Web Scraping**: Extracts content from news websites
3. **AI Processing**: Uses OpenAI GPT to:
   - Generate article summaries
   - Extract key points
   - Categorize content
   - Create full articles
4. **Automated Publishing**: Creates articles with appropriate AI authors

### Supported News Sources
- OpenAI Blog
- Google AI Blog
- Anthropic News
- Meta AI Blog
- (Configurable via admin dashboard)

## Cron Jobs

- **News Aggregation**: Runs every 4 hours
- **Daily Cleanup**: Runs daily at 2 AM UTC

## Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm run migrate` - Run database migrations
- `npm run generate` - Generate Prisma client

### Testing
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Production Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Seed database: `npm run seed`
5. Build application: `npm run build`
6. Start server: `npm start`

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- Role-based access control

## Admin Account

Default admin account created during seeding:
- **Email**: admin@ainewshub.com
- **Password**: admin123

⚠️ **Change the default password in production!**

## License

MIT License