# Sefirah

Sefirah is a desktop-inspired web application built with Next.js. The project brings multiple interactive modules into a single operating-system-style interface, including authentication, notes, a virtual filesystem, a cooking game, and a DSA learning lab.

## Features Implemented

### Desktop Interface

- Desktop-style application interface
- Window-based application layout
- Interactive application windows
- Draggable windows
- Modular application components

### Authentication

- User authentication system
- Login and session handling
- Cookie-based sessions
- Password hashing with bcrypt
- Protected API routes

### Virtual Filesystem

- Create and manage filesystem items
- Folder hierarchy support
- Soft delete functionality
- Recycle-bin style deleted items
- Restore deleted files and folders
- Recursive handling of folder descendants
- MongoDB-backed filesystem data

### Notes

- Notes functionality backed by API routes
- Persistent user data through MongoDB
- Undo and redo functionality is part of the notes application interface

### Cooking Game

The project includes an interactive cooking game focused on ingredient collection and recipe progress.

Implemented functionality includes:

- Ingredient inventory management
- Recipe progress tracking
- Checklist/progress data
- Persistent cooking progress
- MongoDB-backed inventory data
- Ingredient assets used throughout the game interface

The cooking progress system stores data such as the user's inventory, checklist, selected recipe, and timestamps.

### DSA Lab

The project also contains a DSA Lab module integrated into the Sefirah interface.

The lab is intended as an interactive learning area within the application and includes educational content and implementation-oriented sections connected to the project's features.

## Technology Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- Lucide React
- React RND

### Backend

- Next.js Route Handlers
- MongoDB
- MongoDB Node.js Driver
- Mongoose
- bcrypt

### DevOps and Deployment

The project has been prepared and tested with:

- Docker
- Docker Compose
- GitHub Actions CI
- Vercel deployment

MongoDB credentials and other sensitive configuration are managed through environment variables.

## Local Development

Install dependencies:

```bash
npm install
```

Create a local environment file:

```text
.env.local
```

Add the required environment variables, including:

```text
MONGODB_URI=your_mongodb_connection_string
```

Run the development server:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

## Production Build

To test the production build locally:

```bash
npm run build
npm start
```

## Docker

The application can be containerized and run using Docker.

Build the image:

```bash
docker build -t sefirah .
```

Because the application requires environment variables such as `MONGODB_URI`, run the container with the environment file:

```bash
docker run -p 3000:3000 --env-file .env.local sefirah
```

The application will then be available at:

```text
http://localhost:3000
```

## Docker Compose

The project also supports Docker Compose.

Run the application:

```bash
docker compose up --build -d
```

Check the running containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

Stop the application:

```bash
docker compose down
```

The Docker Compose configuration uses the local environment file for runtime variables.

## CI

GitHub Actions is configured to validate the project automatically.

The CI workflow performs the project's configured checks and production build validation when changes are pushed to the repository.

## Deployment

The project has been deployed and tested with Vercel.

Environment variables required by the application, including the MongoDB connection string, must also be configured in the deployment environment.

## Environment Variables

The project uses environment variables for sensitive configuration.

Example:

```text
MONGODB_URI=your_mongodb_connection_string
```

Do not commit `.env.local` or production secrets to the repository.

## Project Status

Sefirah is an actively developed project. The current implementation includes the desktop-style application environment, authentication, filesystem functionality, notes, the cooking game, the DSA Lab module, MongoDB persistence, Docker containerization, Docker Compose support, GitHub Actions CI, and Vercel deployment.
