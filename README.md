# AI Powered WhatsApp Clone

A premium, full-featured real-time chat application built to mirror WhatsApp's core functionality while introducing AI-powered features and video calls.

---

## 🚀 Features

- 💬 **Real-time Messaging**: Instant, sub-millisecond chat propagation powered by Convex.
- 👥 **Group Chats**: Create group conversations, manage participants, set group icons, and assign group admins.
- 🤖 **AI Assistant Integration**:
  - Send messages starting with `@gpt` to interact with an AI chatbot helper.
  - Send messages starting with `@dall-e` to generate images on-the-fly and share them in the chat.
- 📞 **Video & Voice Calls**: Integrated high-quality peer-to-peer video calling powered by ZegoCloud.
- 🖼️ **Media Sharing**: Upload and send photos and videos seamlessly using Convex File Storage.
- 🌓 **Themes**: Fully responsive styling supporting both Light and Dark mode options.
- 🔒 **Secure Auth**: Authentication and session management powered by Clerk.
- 🌱 **Self-Healing Local Development**: Custom Convex user synchronization that automatically seeds demo contacts (ChatGPT, Elon Musk, Steve Jobs, Bill Gates) for immediate local testing without needing webhook tunnels.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Real-time Backend & DB**: [Convex](https://convex.dev/)
- **Authentication**: [Clerk](https://clerk.dev/)
- **P2P Calling**: [ZegoCloud](https://www.zegocloud.com)
- **AI Integrations**: [OpenAI API](https://platform.openai.com/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/) & [Lucide React](https://lucide.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 💻 Local Setup & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory and add the following keys:
```env
# Clerk Authentication Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Convex Deployment URL
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url

# ZegoCloud Calling Keys
NEXT_PUBLIC_ZEGO_APP_ID=your_zego_app_id
NEXT_PUBLIC_ZEGO_SERVER_SECRET=your_zego_server_secret
ZEGO_APP_ID=your_zego_app_id
ZEGO_SERVER_SECRET=your_zego_server_secret
```

### 3. Start Convex Development Server
Convex runs a local watcher and automatically syncs backend schema and functions:
```bash
npx convex dev
```

### 4. Start Next.js Development Server
Run the web application locally:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application. Once logged in, you will automatically find demo contacts (Elon Musk, Steve Jobs, Bill Gates, and ChatGPT AI) seeded in your contact list so you can begin messaging instantly.
