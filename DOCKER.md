# Docker Setup for AI News Website

Complete Docker containerization for one-click deployment of the AI News Website with frontend, backend, database, and caching.

## 🚀 Quick Start

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) (20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)

### One-Click Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bosto/ai-news-website.git
   cd ai-news-website
   ```

2. **Run the setup script**:
   ```bash
   ./scripts/docker-setup.sh
   ```

3. **Configure environment**:
   - Edit `.env` file with your API keys
   - Add your OpenAI API key for AI features

4. **Access the application**:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001
   - **Admin**: http://localhost:3000 (admin@ainewshub.com / admin123)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄──►│   (Express)     │◄──►│  (PostgreSQL)   │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │     Redis       │
                       │   (Cache)       │
                       │   Port: 6379    │
                       └─────────────────┘
```

## 🐳 Docker Services

### Frontend Container
- **Image**: Custom Next.js build
- **Port**: 3000
- **Features**: Server-side rendering, optimized build
- **Health Check**: HTTP GET /

### Backend Container
- **Image**: Custom Node.js Express build
- **Port**: 3001
- **Features**: Auto-migration, database seeding, JWT auth
- **Health Check**: HTTP GET /health

### Database Container
- **Image**: PostgreSQL 15 Alpine
- **Port**: 5432
- **Features**: Persistent storage, automatic initialization
- **Health Check**: pg_isready

### Redis Container
- **Image**: Redis 7 Alpine
- **Port**: 6379
- **Features**: Persistent cache, future session storage

## 📝 Environment Configuration

### Required Environment Variables

```env
# OpenAI API Key (Required for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# News API Key (Optional)
NEWS_API_KEY=your_news_api_key_here

# Security (Change in production!)
JWT_SECRET=your_super_secure_jwt_secret
```

### Optional Configuration

```env
# Ports (Change if conflicts)
FRONTEND_PORT=3000
BACKEND_PORT=3001
DATABASE_PORT=5432
REDIS_PORT=6379

# Database Credentials
POSTGRES_DB=ai_news_db
POSTGRES_USER=ai_news_user
POSTGRES_PASSWORD=ai_news_password
```

## 🔧 Development vs Production

### Development Mode
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Features:
# - Hot reload for both frontend and backend
# - Source code mounted as volumes
# - Development dependencies included
# - Relaxed rate limiting
```

### Production Mode
```bash
# Start production environment
docker-compose up --build

# Features:
# - Optimized builds with multi-stage Dockerfiles
# - Minimal production images
# - Non-root users for security
# - Health checks enabled
# - Production rate limiting
```

## 📋 Common Commands

### Basic Operations
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart backend
```

### Development Commands
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Rebuild specific service
docker-compose -f docker-compose.dev.yml up --build backend

# Execute commands in containers
docker-compose exec backend npm run seed
docker-compose exec frontend npm run build
```

### Database Operations
```bash
# Access database
docker-compose exec database psql -U ai_news_user -d ai_news_db

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database
docker-compose exec backend npm run seed

# Reset database
docker-compose exec backend npx prisma migrate reset
```

### Monitoring and Debugging
```bash
# View service status
docker-compose ps

# Check resource usage
docker stats

# Inspect container
docker-compose exec backend sh

# View service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs database
```

## 🔍 Health Checks

All services include health checks:

- **Frontend**: HTTP GET http://localhost:3000
- **Backend**: HTTP GET http://localhost:3001/health
- **Database**: `pg_isready` command
- **Redis**: Redis PING command

Monitor health:
```bash
# Check all service health
docker-compose ps

# View health check logs
docker inspect ai-news-frontend --format='{{.State.Health}}'
```

## 🗂️ Data Persistence

### Persistent Volumes
- **postgres_data**: Database files
- **redis_data**: Redis cache
- **backend_uploads**: File uploads

### Backup and Restore
```bash
# Backup database
docker-compose exec database pg_dump -U ai_news_user ai_news_db > backup.sql

# Restore database
docker-compose exec -T database psql -U ai_news_user ai_news_db < backup.sql

# Backup volumes
docker run --rm -v ai-new-website_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

## 🔧 Troubleshooting

### Common Issues

**Port Conflicts**:
```bash
# Check what's using ports
lsof -i :3000
lsof -i :3001
lsof -i :5432

# Change ports in docker-compose.yml
```

**Database Connection Issues**:
```bash
# Check database logs
docker-compose logs database

# Verify database is ready
docker-compose exec database pg_isready -U ai_news_user
```

**Build Failures**:
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

**Permission Issues**:
```bash
# Fix file permissions
sudo chown -R $(whoami):$(whoami) .

# Reset Docker permissions
docker-compose down
docker volume rm $(docker volume ls -q)
```

### Logs and Debugging
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Debug container
docker-compose exec backend sh
docker-compose exec frontend sh
```

## 🚀 Production Deployment

### Security Considerations
1. **Change default passwords** in `.env`
2. **Use strong JWT secrets**
3. **Configure firewall** to restrict ports
4. **Enable HTTPS** with reverse proxy (Nginx/Traefik)
5. **Regular security updates**

### Performance Optimization
1. **Resource limits** in docker-compose.yml
2. **Database tuning** for PostgreSQL
3. **Redis memory optimization**
4. **Load balancing** for multiple instances

### Monitoring
1. **Health checks** are enabled
2. **Log aggregation** with ELK stack
3. **Metrics collection** with Prometheus
4. **Alerting** with Grafana

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Redis Docker Hub](https://hub.docker.com/_/redis)
- [Next.js Docker Examples](https://github.com/vercel/next.js/tree/canary/examples/with-docker)

## 🤝 Contributing

When adding new features that require Docker changes:

1. Update Dockerfiles if needed
2. Modify docker-compose.yml for new services
3. Update environment variables
4. Test in both development and production modes
5. Update this documentation

## 📄 License

This Docker setup is part of the AI News Website project and follows the same MIT license.