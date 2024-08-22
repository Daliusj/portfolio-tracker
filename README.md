# Portfolio Tracker Monorepo

## Overview

The Portfolio Tracker is a full-stack application designed to help users manage and track their investment portfolios, including assets like cryptocurrencies, stocks, and funds. The project is split into two main components: the frontend and the backend. The frontend is built with React, TypeScript, and Vite, while the backend is developed using Node.js, TypeScript, Express.js, and TRPC, with a PostgreSQL database for data storage.

You can access the live application at the following link:

- https://portfolio-tracker-service.nichunkt3352c.eu-central-1.cs.amazonlightsail.com/

## Features

### Frontend

- **User Authentication:** Signup, login, and session management.
- **Portfolio Management:** Create, update and delete portfolios.
- **Asset Management:** View, add, edit, and delete assets within a portfolio.
- **Portfolio Stats:** View portfolio value, asset-specific statistics, and profit/loss analysis.
- **Responsive Design:** Optimized for both desktop and mobile devices.

### Backend

- **Asset Management:** Manage various asset types (crypto, stocks, funds) within portfolios.
- **Portfolio Management:** CRUD operations for user portfolios.
- **Historical Data:** Retrieve and analyze historical data for assets.
- **Portfolio Valuation:** Calculate portfolio values and track changes over time.
- **User Authentication:** Secure routes with JWT-based authentication.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Database Migrations](#database-migrations)
- [Seeding the Database](#seeding-the-database)
- [Running the Development Servers](#running-the-development-servers)
- [Building for Production](#building-for-production)
- [Running Tests](#running-tests)
- [CI/CD Pipeline](#ci-cd-pipeline)
- [Docker Setup](#docker-setup)
- [Project Structure](#project-structure)
- [License](#license)

## Installation

Clone the monorepo and install dependencies for both the frontend and backend:

```bash
git https://github.com/Daliusj/portfolio-tracker.git
cd portfolio-tracker

# Install backend dependencies
cd server/
npm install

# Install frontend dependencies
cd client/
npm install
```

## Configuration

### Frontend

The frontend requires environment variables for the API base URL. Create a `.env` file in the frontend root directory:

```env
VITE_API_ORIGIN=http://localhost:3000
VITE_API_PATH=/api/v1/trpc
```

### Backend

The backend requires several environment variables for configuration. Create a `.env` file in the backend root directory:

```env
NODE_ENV=development
DATABASE_URL=postgres://user:password@localhost:5432/portfolio
TEST_DATABASE_URL=postgres://user:password@localhost:5432/portfolio_test
TOKEN_KEY=your_secret_key
FMP_API_KEY=your_fmp_api_key
EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key
```

FMP_API and EXCHANGE_RATE_API are external api services. More information:

- https://site.financialmodelingprep.com/
- https://www.exchangerate-api.com/

## Database Migrations

To manage database migrations, navigate to the backend directory and run migration command:

```bash
cd server/
npm run migrate:latest
```

## Seeding the Database

Seed the database with initial data and update currency exchange rates by running:

```bash
npm run seed
npm run update:db
```

## Running the Development Servers

### Frontend

Start the frontend development server:

```bash
cd client/
npm run dev
```

The frontend will be accessible at [http://localhost:5173](http://localhost:5173).

### Backend

Start the backend server:

```bash
cd server/
npm run dev
```

The backend will be accessible at [http://localhost:3000](http://localhost:3000).

## Building for Production

### Frontend

To build the frontend for production:

```bash
cd client/
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

### Backend

To build and start the backend server for production:

```bash
cd server/
npm run build
npm run start
```

## Running Tests

### Frontend

The frontend includes both unit and end-to-end tests.

#### Unit tests:

```bash
npm run test:unit
```

#### End-to-End tests:

```bash
npm run test:e2e
```

### Backend

To run tests for the backend:

```bash
npm run test
```

## CI/CD Pipeline

This project uses GitHub Actions to automate the Continuous Integration and Continuous Deployment (CI/CD) processes. The pipeline is triggered on every push to the repository and includes the following steps:

- **Testing:** The pipeline runs all unit, integration, and end-to-end tests to ensure code quality and functionality.
- **Build and Deployment:** If the tests pass, the pipeline builds Docker images for the frontend and backend and deploys them to AWS Lightsail.

### Key Jobs in CI/CD

- **Test:** Runs tests and linters for both the frontend and backend. It uses Docker to spin up a PostgreSQL service for integration testing.
- **Build and Deploy:** Builds Docker images for the client and server, pushes them to AWS Lightsail, and deploys them.

You can find the CI/CD configuration in the `.github/workflows` directory of the repository.

## Docker Setup

This project is Dockerized to ensure a consistent development environment and to simplify deployment. The setup includes three main services: PostgreSQL, the backend server, and the frontend client.

### Docker Compose

The `docker-compose.yml` file defines the following services:

- **postgres:** A PostgreSQL database used by the backend.
- **server:** The backend API server.
- **client:** The frontend application served via Nginx.

### Running the Application with Docker

To start the application using Docker, run:

```bash
docker compose up --build
```

This command will:

- Pull the necessary Docker images for PostgreSQL and Nginx.
- Build Docker images for the frontend and backend based on the Dockerfiles.
- Start all services, making the application accessible at [http://localhost:3001](http://localhost:3001).

### Dockerfile Details

- **Backend Dockerfile:** Builds the Node.js backend, installs dependencies, and runs the server.
- **Frontend Dockerfile:** Builds the frontend assets using Vite and serves them using Nginx.

This setup is designed to work both locally and in production, with environment variables controlling behavior in different environments.

## Project Structure

### Frontend

- `/src`: Main source code directory.
- `/components`: React components.
- `/context`: Global state management.
- `/pages`: Page components.
- `/utils`: Utility functions.
- `/trpc`: TRPC client setup.
- `/assets`: Static assets.

### Backend

- `/src`: Main source code directory.
- `/controllers`: API route handlers.
- `/database`: Database configuration and migrations.
- `/entities`: Zod schemas and TypeScript types.
- `/repositories`: Database interaction logic.
- `/services`: Business logic.
- `/trpc`: TRPC router and middleware.
- `/utils`: Utility functions.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
