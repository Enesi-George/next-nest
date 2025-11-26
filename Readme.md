# Appointment Booking System
A full-stack appointment booking system built with Next.js, NestJS, PostgreSQL, and Google Calendar API integration.

# Quick Start

1. Clone and Setup
bash
# Fork and clone the repository
git clone https://github.com/your-username/next-nest.git
cd next-nest

# Copy the service account file
cp your-service-account.json service-account.json
2. Environment Setup
Create a Google Service Account and download the JSON key file. Place it in the project root as service-account.json.

3. Run with Docker
bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d
4. Access the Application
Frontend: http://localhost:3000

Backend API: http://localhost:3001

Admin Login: http://localhost:3000/admin

# Seeded Admin Credentials
Email: admin@gmail.com
Password: admin123

# API Endpoints
# Public Endpoints
POST /appointments - Create new appointment

POST /auth/login - Admin login

POST /auth/register - Create new admin user

# Protected Endpoints (Require JWT)
GET /appointments - Get all appointments

GET /appointments/:id - Get specific appointment

GET /users - Get all users

POST /users - Create new user

DELETE /users/:id - Delete user