#!/bin/bash

echo "Starting deployment..."

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build the application
npm run build

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Restart PM2 processes
pm2 restart ecosystem.config.js

echo "Deployment completed!"