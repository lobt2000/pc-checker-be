# PC Checker Backend (Node.js + Fastify)

This is the backend server for the PC Checker system, built using Node.js and Fastify. It acts as a bridge between the Angular + Ionic frontend and the Python WebSocket client, handling real-time communication and system control.

## Features
- Manages WebSocket connections between frontend and PC clients
- Forwards requests from the frontend to the connected PC
- Receives system data and process lists from the PC
- Allows remote termination of processes
- Supports remote system shutdown

## Prerequisites
- Node.js (v16+ recommended)
- Fastify.js

Install dependencies:
```bash
npm install
```

## Running the Server
Start the Fastify backend with:
```bash
npm start
```
The server will listen for WebSocket connections on:
```bash
ws://localhost:3000/ws
```

## WebSocket Events
### Incoming Events (from Frontend)
- getProcess: Requests a list of running processes
- terminateProcess: Requests termination of a process by PID
- getStatus: Requests system uptime
- turnOff: Requests remote PC shutdown

### Outgoing Events (to Python Client)
- process: Sends the list of running processes
- status: Sends system uptime
- event: Confirms process termination or failure
- turnOff: Confirms PC shutdown


