#!/bin/bash

# AI News Website - Docker Setup Script
# This script sets up the complete AI News Website using Docker

set -e

echo "🚀 AI News Website - Docker Setup"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
    cp .env.docker .env
    echo -e "${YELLOW}📝 Please edit .env file with your API keys:${NC}"
    echo "   - OPENAI_API_KEY (required for AI features)"
    echo "   - NEWS_API_KEY (optional)"
    echo ""
    echo -e "${YELLOW}Press Enter to continue after editing .env file...${NC}"
    read -r
fi

# Function to run development environment
run_dev() {
    echo -e "${BLUE}🔧 Starting Development Environment...${NC}"
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml up --build -d
    
    echo -e "${GREEN}✅ Development environment is starting up!${NC}"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:3001"
    echo "🗄️  Database: localhost:5432"
    echo "🔴 Redis: localhost:6379"
    echo ""
    echo "To view logs: docker-compose -f docker-compose.dev.yml logs -f"
    echo "To stop: docker-compose -f docker-compose.dev.yml down"
}

# Function to run production environment
run_prod() {
    echo -e "${BLUE}🚀 Starting Production Environment...${NC}"
    docker-compose down
    docker-compose up --build -d
    
    echo -e "${GREEN}✅ Production environment is starting up!${NC}"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:3001"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop: docker-compose down"
}

# Function to stop all services
stop_all() {
    echo -e "${YELLOW}🛑 Stopping all services...${NC}"
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    echo -e "${GREEN}✅ All services stopped${NC}"
}

# Function to clean up
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up Docker resources...${NC}"
    docker system prune -f
    docker volume prune -f
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Function to show logs
show_logs() {
    echo "Choose environment to show logs:"
    echo "1) Development"
    echo "2) Production"
    read -p "Enter choice (1-2): " log_choice
    
    case $log_choice in
        1)
            docker-compose -f docker-compose.dev.yml logs -f
            ;;
        2)
            docker-compose logs -f
            ;;
        *)
            echo -e "${RED}❌ Invalid choice${NC}"
            ;;
    esac
}

# Main menu
echo ""
echo "Choose setup option:"
echo "1) Development Environment (with hot reload)"
echo "2) Production Environment"
echo "3) Stop All Services"
echo "4) Show Logs"
echo "5) Cleanup Docker Resources"
echo "6) Exit"

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        run_dev
        ;;
    2)
        run_prod
        ;;
    3)
        stop_all
        ;;
    4)
        show_logs
        ;;
    5)
        cleanup
        ;;
    6)
        echo -e "${BLUE}👋 Goodbye!${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid choice. Please run the script again.${NC}"
        exit 1
        ;;
esac