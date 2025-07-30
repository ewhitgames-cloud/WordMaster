# Replit.md

## Overview

This is a modern React-based Wordle game application built with a full-stack TypeScript architecture. The application features a web-based word guessing game with statistics tracking, challenge modes, and a vibrant Nintendo-style UI using shadcn/ui components with colorful gradients and animations throughout.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Animations**: Framer Motion for smooth transitions and game animations
- **Build Tool**: Vite with React plugin for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API endpoints under `/api` prefix
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Development**: Hot module replacement via Vite middleware integration

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Drizzle Kit for schema migrations
- **Development Fallback**: In-memory storage implementation for development/testing

## Key Components

### Game Logic
- **Word Validation**: Client-side word validation using comprehensive 2000+ word dictionary
- **Game State Management**: Custom React hook (`useWordle`) managing game state
- **Scoring System**: Points calculation based on attempts, time, and challenge mode
- **Statistics Tracking**: Persistent game statistics with guess distribution
- **OpenAI-Enhanced Word Generation**: Intelligent word generation using OpenAI GPT-4o with automatic fallback to built-in 300+ word library
- **Dynamic Word Pools**: Multiple generation modes (random, daily, challenge, category-specific) with smart caching and theme-based organization

### UI Components
- **Game Grid**: 6x5 tile grid with color-coded feedback (correct/present/absent)
- **Virtual Keyboard**: Interactive keyboard with key state tracking
- **Modal System**: Multiple modals for celebration, statistics, and menu
- **Responsive Design**: Mobile-optimized interface with touch interactions

### Database Schema
- **Game Stats Table**: Tracks overall player performance and statistics
- **Game Results Table**: Individual game session records
- **Schema Validation**: Zod schemas for runtime type validation

## Data Flow

1. **Game Initialization**: Client requests new game, server can provide word (currently using client-side word list)
2. **User Input**: Keyboard input processed through game logic, validated against word list
3. **Game Completion**: Results sent to server, statistics updated in database
4. **Statistics Display**: Real-time statistics fetched and displayed in modals

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React DOM, TanStack Query
- **UI/Styling**: Radix UI components, Tailwind CSS, class-variance-authority
- **Database**: Drizzle ORM, Neon serverless PostgreSQL
- **Development**: Vite, TypeScript, ESBuild for production builds
- **Animations**: Framer Motion, React Confetti for celebrations

### Notable Features
- **Challenge Mode**: Time-limited gameplay with bonus scoring and 3-minute countdown timer
- **Daily Challenge System**: Sophisticated daily words that reset daily and never repeat using date-based seeding
- **Built-in Word Library**: 730+ offline words across 6 categories (no API required)
- **Statistics Tracking**: Comprehensive game statistics with visual distribution
- **Nintendo-Style UI**: Vibrant gradients, colorful animations, and playful design throughout
- **Responsive Design**: Mobile-optimized interface with touch-friendly interactions
- **Dark/Light Mode**: Theme support via CSS variables
- **Auto-submission**: Automatic word checking when 5 letters are entered
- **Expanded Word Variety**: 2000+ valid input words with comprehensive built-in target words
- **Colorful Game Elements**: Gradient tiles, animated backgrounds, and glassmorphism effects

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Type Safety**: TypeScript compilation check before deployment

### Environment Configuration
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection
- **Development**: Automatic Vite dev server integration with HMR
- **Production**: Serves built frontend assets through Express static middleware

### Development Workflow
- **Hot Reloading**: Vite provides instant feedback for frontend changes
- **API Logging**: Request/response logging for API endpoints
- **Database Migrations**: Drizzle Kit handles schema changes and migrations
- **Shared Types**: Common types and schemas shared between client and server via `shared/` directory

The application is designed for easy deployment on platforms like Replit, with automatic database provisioning and environment setup.