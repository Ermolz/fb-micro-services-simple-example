#!/bin/bash

# Local build and health check script
# Usage: ./scripts/test-build.sh

set -e

echo "🔨 Testing Microservices Build and Health"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track status
FAILED_SERVICES=()
SUCCESS_SERVICES=()

# Function to check service
check_service() {
    SERVICE_NAME=$1
    PORT=$2
    ENDPOINT=${3:-/health}
    
    echo -n "Checking $SERVICE_NAME on port $PORT... "
    
    if curl -f -s -m 5 "http://localhost:$PORT$ENDPOINT" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ OK${NC}"
        SUCCESS_SERVICES+=("$SERVICE_NAME")
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        FAILED_SERVICES+=("$SERVICE_NAME")
        return 1
    fi
}

# Build services
echo "Step 1: Building Docker images..."
echo "-----------------------------------"
if docker-compose build --no-cache; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo ""
echo "Step 2: Starting services..."
echo "-----------------------------------"
if docker-compose up -d; then
    echo -e "${GREEN}✅ Services started${NC}"
else
    echo -e "${RED}❌ Failed to start services${NC}"
    exit 1
fi

echo ""
echo "Step 3: Waiting for services to be ready..."
echo "-----------------------------------"
sleep 30

echo ""
echo "Step 4: Health checks..."
echo "-----------------------------------"

# Check infrastructure
check_service "PostgreSQL" 5432 || true
check_service "Redis" 6379 || true
check_service "MongoDB" 27017 || true
check_service "Zookeeper" 2181 || true
check_service "Kafka" 9092 || true

echo ""
echo "Checking microservices..."
echo "-----------------------------------"

# Check microservices
check_service "Auth Service" 3001 /api/register || true
check_service "User Service" 3002 /health || true
check_service "Order Service" 3003 /health || true
check_service "Payment Service" 3004 /health || true
check_service "Notification Service" 3005 /health || true
check_service "API Gateway" 8080 /health || true

echo ""
echo "=========================================="
echo "Summary"
echo "=========================================="
echo -e "${GREEN}✅ Successful: ${#SUCCESS_SERVICES[@]} services${NC}"
for service in "${SUCCESS_SERVICES[@]}"; do
    echo "  - $service"
done

if [ ${#FAILED_SERVICES[@]} -gt 0 ]; then
    echo ""
    echo -e "${RED}❌ Failed: ${#FAILED_SERVICES[@]} services${NC}"
    for service in "${FAILED_SERVICES[@]}"; do
        echo "  - $service"
    done
    echo ""
    echo "View logs with: docker-compose logs [service-name]"
    exit 1
else
    echo ""
    echo -e "${GREEN}✅ All services are healthy!${NC}"
    exit 0
fi
