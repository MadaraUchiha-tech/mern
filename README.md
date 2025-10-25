# Real-Time Chat Application

A full-stack real-time chat application built with the MERN stack, featuring instant messaging powered by Socket.io for seamless, bidirectional communication.

## 🚀 Getting Started

### Initial Setup
**Important:** To test the chat functionality, you need to **create 2 user accounts on different browsers** (or incognito/private windows) to chat with each other. This allows you to see real-time messaging in action!

## 📁 Repository Structure

```
ChatApp/
├── backend/           # Express.js server
│   ├── app.js        # Main application entry point
│   ├── controllers/  # Request handlers for auth & messages
│   ├── lib/          # Utility modules (Socket.io, Cloudinary, JWT)
│   ├── middlewares/  # Authentication middleware
│   ├── model/        # MongoDB schemas (User, Message)
│   └── routes/       # API route definitions
├── frontend/         # React + Vite client
│   ├── src/
│   │   ├── Pages/    # Page components
│   │   ├── components/ # Reusable UI components
│   │   ├── store/    # Zustand state management
│   │   └── lib/      # Axios & Socket.io client setup
│   └── public/       # Static assets
└── package.json      # Root package configuration
```

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database and ODM
- **Socket.io** - Real-time bidirectional communication
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Cloudinary** - Image upload and storage
- **cookie-parser** - Cookie handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Socket.io-client** - Real-time client connection
- **Zustand** - Lightweight state management
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **TailwindCSS** - Utility-first CSS framework
- **React Hot Toast** - Toast notifications
- **React Icons** - Icon library

## 🔌 Socket.io Implementation

This application leverages **Socket.io** to provide real-time, event-driven communication between the server and clients. Here's how it powers the chat experience:

### Key Features
- **Instant Message Delivery**: Messages are transmitted immediately without page refresh
- **Online Status Tracking**: Real-time updates of which users are currently online
- **Bidirectional Communication**: Server can push updates to clients instantly
- **Connection Management**: Automatic reconnection and connection state handling

### How It Works
1. **Server Setup** (`backend/lib/socket.js`):
   - Creates an HTTP server with Socket.io attached
   - Maintains a `userSocket` map linking user IDs to socket IDs
   - Listens for `connection` and `disconnect` events
   - Broadcasts online user lists to all connected clients

2. **Client Integration** (`frontend/src/lib/`):
   - Establishes WebSocket connection with user authentication
   - Listens for incoming messages and online status updates
   - Emits events when sending messages

3. **Message Flow**:
   - User A sends a message → Server receives via REST API
   - Server stores message in MongoDB
   - Server uses Socket.io to emit message to User B's socket
   - User B receives message instantly without polling

### Socket.io Benefits
- **Low Latency**: Messages arrive in milliseconds
- **Efficient**: Maintains persistent connection instead of repeated HTTP requests
- **Scalable**: Handles multiple concurrent connections efficiently
- **Fallback Support**: Automatically falls back to long-polling if WebSocket unavailable

## ✨ Features

- 🔐 User authentication (signup/login/logout)
- 💬 Real-time one-on-one messaging
- 🟢 Online/offline user status indicators
- 🖼️ Image sharing in chats
- 📱 Responsive design for mobile and desktop
- 🔔 Toast notifications for user actions
- 🎨 Modern UI with TailwindCSS
- 🔒 Secure authentication with JWT and HTTP-only cookies
- ☁️ Cloud-based image storage with Cloudinary

## 🚀 Installation & Setup

### Prerequisites
- Node.js (>=18.17 <23)
- MongoDB database
- Cloudinary account (for image uploads)

### Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=8000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

FRONTEND_URL=http://localhost:5173
```

Create a `.env` file in the `frontend` directory (or copy from `.env.example`):

```env
VITE_BACKEND_URL=http://localhost:8000
```

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd ChatApp
```

2. **Install dependencies**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

3. **Run the application**

**Development mode (recommended):**
```bash
# Terminal 1 - Run backend
npm run dev

# Terminal 2 - Run frontend
cd frontend
npm run dev
```

**Production mode:**
```bash
# Build frontend
npm run build

# Start server
npm start
```

4. **Access the application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

## 📝 Usage

1. Open the application in two different browsers (or use incognito mode)
2. Create a user account in each browser
3. Log in with both accounts
4. Start chatting in real-time!
5. Try uploading images to see the Cloudinary integration
6. Watch the online status indicators update as users connect/disconnect

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status
- `PUT /api/auth/update-profile` - Update user profile

### Messages
- `GET /api/message/users` - Get all users for sidebar
- `GET /api/message/:id` - Get messages with specific user
- `POST /api/message/send/:id` - Send message to user
