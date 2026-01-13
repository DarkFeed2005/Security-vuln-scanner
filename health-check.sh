#!/bin/bash

echo "🔍 Checking all services..."

# Check MySQL
echo -n "MySQL: "
docker-compose exec -T mysql mysqladmin ping -h localhost -u root -prootpassword > /dev/null 2>&1 && echo "✅" || echo "❌"

# Check Rust API
echo -n "Rust API: "
curl -s http://localhost:8080/health > /dev/null && echo "✅" || echo "❌"

# Check Go Port Scanner
echo -n "Go Port Scanner: "
curl -s http://localhost:8081/health > /dev/null && echo "✅" || echo "❌"

# Check Frontend
echo -n "Frontend: "
curl -s http://localhost:3000 > /dev/null && echo "✅" || echo "❌"

echo ""
echo "📊 Container Status:"
docker-compose ps