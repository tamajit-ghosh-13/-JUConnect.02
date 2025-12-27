#!/bin/bash

# JUConnect Debug Script
# This script checks all requirements and configurations

echo "🔍 JUConnect Diagnostic Tool"
echo "=============================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# 1. Check Node.js
echo "1. Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    check_pass "Node.js installed: $NODE_VERSION"
    
    # Check version is >= 18
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | tr -d 'v')
    if [ "$NODE_MAJOR" -ge 18 ]; then
        check_pass "Node.js version is compatible (>=18)"
    else
        check_fail "Node.js version too old. Need v18 or higher"
        echo "   Install from: https://nodejs.org"
    fi
else
    check_fail "Node.js not found"
    echo "   Install from: https://nodejs.org"
fi
echo ""

# 2. Check npm
echo "2. Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    check_pass "npm installed: $NPM_VERSION"
else
    check_fail "npm not found"
fi
echo ""

# 3. Check MongoDB
echo "3. Checking MongoDB..."
if command -v mongod &> /dev/null; then
    MONGO_VERSION=$(mongod --version | head -n 1)
    check_pass "MongoDB installed: $MONGO_VERSION"
else
    check_warn "mongod command not found in PATH"
    echo "   If using MongoDB Atlas (cloud), this is OK"
    echo "   If using local MongoDB, install from: https://www.mongodb.com"
fi
echo ""

# 4. Check Backend Directory
echo "4. Checking Backend Setup..."
if [ -d "backend" ]; then
    check_pass "backend/ directory exists"
    
    cd backend
    
    # Check package.json
    if [ -f "package.json" ]; then
        check_pass "backend/package.json exists"
    else
        check_fail "backend/package.json missing"
    fi
    
    # Check .env
    if [ -f ".env" ]; then
        check_pass "backend/.env exists"
        
        # Check critical env vars
        if grep -q "MONGODB_URI" .env; then
            check_pass "MONGODB_URI configured"
        else
            check_fail "MONGODB_URI not found in .env"
        fi
        
        if grep -q "JWT_SECRET" .env; then
            check_pass "JWT_SECRET configured"
        else
            check_fail "JWT_SECRET not found in .env"
        fi
        
        if grep -q "PORT" .env; then
            PORT=$(grep "PORT" .env | cut -d '=' -f2)
            check_pass "PORT configured: $PORT"
        else
            check_warn "PORT not set, will use default 5000"
        fi
    else
        check_fail "backend/.env missing"
        echo "   Create .env file with:"
        echo "   MONGODB_URI=mongodb://localhost:27017/juconnect"
        echo "   JWT_SECRET=your_secret_key"
        echo "   PORT=5000"
    fi
    
    # Check node_modules
    if [ -d "node_modules" ]; then
        check_pass "backend/node_modules exists"
    else
        check_warn "backend/node_modules missing"
        echo "   Run: cd backend && npm install"
    fi
    
    # Check server.js
    if [ -f "server.js" ]; then
        check_pass "backend/server.js exists"
    else
        check_fail "backend/server.js missing"
    fi
    
    cd ..
else
    check_fail "backend/ directory not found"
fi
echo ""

# 5. Check Frontend Directory
echo "5. Checking Frontend Setup..."
if [ -d "frontend" ]; then
    check_pass "frontend/ directory exists"
    
    cd frontend
    
    # Check package.json
    if [ -f "package.json" ]; then
        check_pass "frontend/package.json exists"
    else
        check_fail "frontend/package.json missing"
    fi
    
    # Check .env.local
    if [ -f ".env.local" ]; then
        check_pass "frontend/.env.local exists"
        
        if grep -q "NEXT_PUBLIC_API_URL" .env.local; then
            API_URL=$(grep "NEXT_PUBLIC_API_URL" .env.local | cut -d '=' -f2)
            check_pass "NEXT_PUBLIC_API_URL configured: $API_URL"
        else
            check_fail "NEXT_PUBLIC_API_URL not found"
        fi
        
        if grep -q "NEXT_PUBLIC_SOCKET_URL" .env.local; then
            SOCKET_URL=$(grep "NEXT_PUBLIC_SOCKET_URL" .env.local | cut -d '=' -f2)
            check_pass "NEXT_PUBLIC_SOCKET_URL configured: $SOCKET_URL"
        else
            check_warn "NEXT_PUBLIC_SOCKET_URL not found"
        fi
    else
        check_fail "frontend/.env.local missing"
        echo "   Create .env.local with:"
        echo "   NEXT_PUBLIC_API_URL=http://localhost:5000/api"
        echo "   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000"
    fi
    
    # Check node_modules
    if [ -d "node_modules" ]; then
        check_pass "frontend/node_modules exists"
    else
        check_warn "frontend/node_modules missing"
        echo "   Run: cd frontend && npm install"
    fi
    
    # Check next.config.js
    if [ -f "next.config.js" ]; then
        check_pass "frontend/next.config.js exists"
    else
        check_warn "frontend/next.config.js missing (might use defaults)"
    fi
    
    # Check app directory
    if [ -d "app" ]; then
        check_pass "frontend/app/ directory exists"
    else
        check_fail "frontend/app/ directory missing"
    fi
    
    cd ..
else
    check_fail "frontend/ directory not found"
fi
echo ""

# 6. Check Ports
echo "6. Checking Port Availability..."

# Check 5000 (Backend)
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    check_warn "Port 5000 already in use"
    echo "   A process is already using port 5000"
    echo "   This might be your backend already running"
    echo "   Or run: lsof -ti:5000 | xargs kill -9"
else
    check_pass "Port 5000 available for backend"
fi

# Check 3000 (Frontend)
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    check_warn "Port 3000 already in use"
    echo "   A process is already using port 3000"
    echo "   Or run: lsof -ti:3000 | xargs kill -9"
else
    check_pass "Port 3000 available for frontend"
fi

echo ""

# 7. Test MongoDB Connection
echo "7. Testing MongoDB Connection..."
if [ -f "backend/.env" ]; then
    MONGO_URI=$(grep "MONGODB_URI" backend/.env | cut -d '=' -f2)
    echo "   Attempting to connect to: $MONGO_URI"
    
    # Try to connect using mongosh or mongo
    if command -v mongosh &> /dev/null; then
        if mongosh "$MONGO_URI" --eval "db.adminCommand('ping')" &> /dev/null; then
            check_pass "MongoDB connection successful"
        else
            check_fail "Cannot connect to MongoDB"
            echo "   Make sure MongoDB is running"
        fi
    elif command -v mongo &> /dev/null; then
        if mongo "$MONGO_URI" --eval "db.adminCommand('ping')" &> /dev/null; then
            check_pass "MongoDB connection successful"
        else
            check_fail "Cannot connect to MongoDB"
            echo "   Make sure MongoDB is running"
        fi
    else
        check_warn "mongosh/mongo CLI not found, skipping connection test"
    fi
fi
echo ""

# Summary
echo "=============================="
echo "📊 Diagnostic Summary"
echo "=============================="
echo ""
echo "Next Steps:"
echo ""

if [ ! -d "backend/node_modules" ]; then
    echo "1. Install backend dependencies:"
    echo "   cd backend && npm install"
    echo ""
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "2. Install frontend dependencies:"
    echo "   cd frontend && npm install"
    echo ""
fi

if [ ! -f "backend/.env" ]; then
    echo "3. Create backend/.env file"
    echo ""
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "4. Create frontend/.env.local file"
    echo ""
fi

echo "5. Start MongoDB (if using local):"
echo "   macOS: brew services start mongodb-community"
echo "   Linux: sudo systemctl start mongod"
echo "   Windows: net start MongoDB"
echo ""

echo "6. Start Backend:"
echo "   cd backend && npm run dev"
echo ""

echo "7. Start Frontend (in new terminal):"
echo "   cd frontend && npm run dev"
echo ""

echo "8. Open browser:"
echo "   http://localhost:3000"
echo ""

echo "=============================="
echo "For more help, check the troubleshooting guide!"
echo "=============================="