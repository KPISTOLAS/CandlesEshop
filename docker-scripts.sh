#!/bin/bash

# Candle Shop Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install it and try again."
        exit 1
    fi
}

# Development environment
dev_start() {
    print_header "Starting Development Environment"
    check_docker
    check_docker_compose
    
    print_status "Building and starting all services..."
    docker-compose up --build -d
    
    print_status "Waiting for services to be ready..."
    sleep 10
    
    print_status "Development environment is ready!"
    echo -e "${GREEN}Frontend:${NC} http://localhost:3000"
    echo -e "${GREEN}Backend API:${NC} http://localhost:8000"
    echo -e "${GREEN}API Docs:${NC} http://localhost:8000/docs"
    echo -e "${GREEN}Database:${NC} localhost:5432"
}

dev_stop() {
    print_header "Stopping Development Environment"
    docker-compose down
    print_status "Development environment stopped."
}

dev_restart() {
    print_header "Restarting Development Environment"
    dev_stop
    dev_start
}

dev_logs() {
    print_header "Showing Development Logs"
    docker-compose logs -f
}

# Production environment
prod_start() {
    print_header "Starting Production Environment"
    check_docker
    check_docker_compose
    
    print_warning "Make sure you have set up your environment variables!"
    print_warning "Create a .env file with your production settings."
    
    print_status "Building and starting production services..."
    docker-compose -f docker-compose.prod.yml up --build -d
    
    print_status "Production environment is ready!"
    echo -e "${GREEN}Application:${NC} https://localhost (with SSL)"
    echo -e "${GREEN}API:${NC} https://localhost/api/"
}

prod_stop() {
    print_header "Stopping Production Environment"
    docker-compose -f docker-compose.prod.yml down
    print_status "Production environment stopped."
}

prod_restart() {
    print_header "Restarting Production Environment"
    prod_stop
    prod_start
}

prod_logs() {
    print_header "Showing Production Logs"
    docker-compose -f docker-compose.prod.yml logs -f
}

# Database operations
db_backup() {
    print_header "Creating Database Backup"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="backup_${TIMESTAMP}.sql"
    
    docker-compose exec postgres pg_dump -U candles_user candles_db > "$BACKUP_FILE"
    print_status "Database backup created: $BACKUP_FILE"
}

db_restore() {
    if [ -z "$1" ]; then
        print_error "Please provide a backup file: ./docker-scripts.sh db-restore <backup_file>"
        exit 1
    fi
    
    print_header "Restoring Database from Backup"
    print_warning "This will overwrite the current database!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose exec -T postgres psql -U candles_user candles_db < "$1"
        print_status "Database restored from: $1"
    else
        print_status "Database restore cancelled."
    fi
}

# Cleanup operations
cleanup() {
    print_header "Cleaning Up Docker Resources"
    
    print_status "Stopping all containers..."
    docker-compose down
    docker-compose -f docker-compose.prod.yml down
    
    print_status "Removing unused containers..."
    docker container prune -f
    
    print_status "Removing unused images..."
    docker image prune -f
    
    print_status "Removing unused volumes..."
    docker volume prune -f
    
    print_status "Cleanup completed!"
}

# Health check
health_check() {
    print_header "Checking Service Health"
    
    # Check if containers are running
    if docker-compose ps | grep -q "Up"; then
        print_status "Development containers are running"
    else
        print_warning "Development containers are not running"
    fi
    
    # Check API health
    if curl -f http://localhost:8000/ > /dev/null 2>&1; then
        print_status "Backend API is healthy"
    else
        print_error "Backend API is not responding"
    fi
    
    # Check frontend health
    if curl -f http://localhost:3000/ > /dev/null 2>&1; then
        print_status "Frontend is healthy"
    else
        print_error "Frontend is not responding"
    fi
}

# Show usage
usage() {
    echo "Candle Shop Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Development Commands:"
    echo "  dev-start     Start development environment"
    echo "  dev-stop      Stop development environment"
    echo "  dev-restart   Restart development environment"
    echo "  dev-logs      Show development logs"
    echo ""
    echo "Production Commands:"
    echo "  prod-start    Start production environment"
    echo "  prod-stop     Stop production environment"
    echo "  prod-restart  Restart production environment"
    echo "  prod-logs     Show production logs"
    echo ""
    echo "Database Commands:"
    echo "  db-backup     Create database backup"
    echo "  db-restore    Restore database from backup"
    echo ""
    echo "Utility Commands:"
    echo "  cleanup       Clean up Docker resources"
    echo "  health        Check service health"
    echo "  help          Show this help message"
}

# Main script logic
case "$1" in
    "dev-start")
        dev_start
        ;;
    "dev-stop")
        dev_stop
        ;;
    "dev-restart")
        dev_restart
        ;;
    "dev-logs")
        dev_logs
        ;;
    "prod-start")
        prod_start
        ;;
    "prod-stop")
        prod_stop
        ;;
    "prod-restart")
        prod_restart
        ;;
    "prod-logs")
        prod_logs
        ;;
    "db-backup")
        db_backup
        ;;
    "db-restore")
        db_restore "$2"
        ;;
    "cleanup")
        cleanup
        ;;
    "health")
        health_check
        ;;
    "help"|"--help"|"-h"|"")
        usage
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        usage
        exit 1
        ;;
esac 