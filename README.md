# Tinderx - Privacy-First Geo-Based Chat

Tinderx is a production-ready, scalable backend for a real-time chat application with a focus on user privacy and spatial discovery.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time**: Socket.IO (with Redis adapter for scaling)
- **Database**: MongoDB (Mongoose)
- **Cache**: Redis (Session management, Online Status, Message Metadata)
- **Security**: JWT Authentication, Single-session policy, Rate limiting
- **Architecture**: Clean & Modular Structure

## Key Requirements & Features

### 1. Privacy-First Messaging
- **No Message Storage**: Chat messages are NOT stored in MongoDB. They exist only in memory and client-side storage.
- **Message Metadata**: Redis stores message status (sent, delivered, read) with a 24-hour TTL for delivery tracking.

### 2. Geo-Discovery
- **Nearby Search**: Finds users within a specific radius using GeoJSON and MongoDB `2dsphere` index.
- **Location Privacy**: Does not return exact coordinates in discovery results.

### 3. Authentication & Sessions
- **Single Active Session**: Logging in from a new device invalidates the previous session.
- **JWT-Based**: Secure authentication via Access and Refresh tokens.

### 4. Interactive Features
- **Real-time Chat**: High-performance messaging with delivery/read ticks.
- **Chat Requests**: Request/Accept/Decline flow to manage connections.
- **Online Status**: Real-time broadcasts of user online/offline status.
- **User Safety**: Comprehensive Block and Report systems.

### 5. Scalability
- **Redis Adapter**: Ready for horizontal scaling and load balancing.
- **Modular Structure**: Easily extensible codebase following REST best practices.

## Project Structure
```text
server/
  src/
    config/         # DB, Redis, Socket, Logger configurations
    controllers/    # Business logic for all modules
    middlewares/    # Auth, Error handling, Rate limiting
    models/         # Mongoose schemas (User, Block, Report, etc.)
    routes/         # API endpoints
    services/       # Core service layer
    socket/         # Socket.IO handlers
    utils/          # Helper classes and functions
```

## Getting Started
1. Clone the repository.
2. Install dependencies: `cd server && npm install`.
3. Configure `.env` (refer to `.env.example`).
4. Run in dev mode: `npm run dev`.