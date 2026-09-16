# ChatGPT Learning Workspace

## Overview

ChatGPT Learning Workspace is a browser-integrated learning workspace designed to turn doubts and selected content from ChatGPT conversations into persistent, structured learning threads.

When studying or problem-solving with AI, learners frequently encounter specific concepts or explanations that require deeper inquiry. Rather than cluttering the original conversation or losing track of questions across sessions, this project allows learners to:
- Select a doubt or concept directly while reading a ChatGPT response.
- Create a dedicated, persistent learning thread.
- Preserve the relevant conversation context and selected text automatically.
- Continue exploring the topic in a focused workspace without leaving the page.
- Receive structured, AI-powered explanations designed for conceptual clarity.

> **Note:** This project is an independent developer learning tool and is not an official OpenAI or ChatGPT product.

---

## Current Features

- **Context-Menu Doubt Capture:** Create a new doubt thread directly from selected text on ChatGPT using the right-click menu.
- **Selected Text Capture:** Retains the exact excerpt that prompted the question.
- **Context Extraction:** Automatically captures relevant preceding conversation turns from ChatGPT to ground subsequent AI assistance.
- **Source Preservation:** Stores the original source URL and conversation title for attribution and easy reference.
- **Persistent Threads:** Thread data, message history, and metadata are saved locally via browser `localStorage`.
- **Thread Management:** Create new threads manually, switch between threads, rename threads with custom modal dialogs, and delete threads.
- **Thread Search:** Real-time search filter across all saved thread titles.
- **Notes Export:** Export thread discussions, context, and AI responses to formatted Markdown files.
- **Conversational AI Chat:** Ask follow-up questions within any thread, backed by full conversation history and captured context.
- **"💡 Explain" Action:** One-click structured explanation that breaks down the doubt into plain-English intuition, a concrete analogy or example, and a key takeaway.
- **Collapsible Source Context:** Displays an unobtrusive `▸ View source context` toggle by default, keeping the learning view clean while preserving raw context for inspection when needed.
- **Persistent Sidebar & Toggle:** Collapsible and resizable right-side workspace panel with a floating `💡 Workspace` button to reopen closed sessions.
- **Refresh Resilience:** Saved threads and message history persist across page refreshes and browser restarts through local browser storage.

---

## How It Works

```text
ChatGPT
  │
  ▼
Chrome Extension (Content Script & Background Worker)
  │
  ▼
Selected Text + Conversation Context
  │
  ▼
AI Learning Workspace (Injected React Sidebar)
  │
  ▼
Persistent Thread (Stored in localStorage)
  │
  ▼
AI Chat / Explain Request
  │
  ▼
Local Backend (Express Server on port 5000)
  │
  ▼
Gemini API (gemini-2.5-flash)
```

1. **ChatGPT (Host Page):** The user browses or chats with ChatGPT and highlights a sentence or concept they want to clarify.
2. **Chrome Extension:** A Manifest V3 background service worker captures context menu actions, while the content script extracts the selected text, active chat title, URL, and recent chat messages.
3. **AI Learning Workspace:** An iframe-embedded React application receives the captured payload, creates a dedicated thread, and manages the learning interface.
4. **Persistent Thread:** The thread and its messages are stored in browser `localStorage`, making discussions permanent across page refreshes.
5. **AI Chat / Explain:** The student chats with the AI or clicks the `💡 Explain` button to request a structured breakdown.
6. **Local Backend:** An Express service running on `localhost:5000` receives the prompt, injects tutor instructions, and securely attaches API credentials.
7. **Gemini API:** Google's `gemini-2.5-flash` model generates clear, markdown-formatted responses returned to the workspace.

---

## Project Structure

```text
ai-learning-workspace/
├── ai-learning-workspace-extension/     # React frontend & local backend
│   ├── src/                             # React application source code
│   │   ├── ai/                          # Context-building utilities
│   │   ├── api/                         # API client services (chat, title generation)
│   │   ├── assets/                      # Icons and visual assets
│   │   ├── components/                  # React components (ThreadView, ChatInput, ThreadList, modals)
│   │   ├── types/                       # TypeScript interfaces (Thread, Message, QuizData, PracticeData)
│   │   ├── utils/                       # Export and formatting utilities
│   │   ├── App.tsx                      # Root workspace application component
│   │   ├── App.css                      # Workspace styles
│   │   └── main.tsx                     # React entry point
│   ├── server/                          # Local Node.js Express server
│   │   ├── .env.example                 # Safe environment template with placeholder keys
│   │   ├── package.json                 # Backend dependencies
│   │   └── server.js                    # Express API endpoints (/chat, /generate-title)
│   ├── public/                          # Static web assets
│   ├── package.json                     # Frontend dependencies and scripts
│   ├── tsconfig.json                    # TypeScript configuration
│   └── vite.config.ts                   # Vite build configuration
├── extension/                           # Unpacked Chrome Extension (Manifest V3)
│   ├── background.js                    # Service worker handling context menus and messaging
│   ├── content.js                       # Content script extracting ChatGPT DOM and injecting sidebar
│   ├── manifest.json                    # Extension manifest configuration
│   └── icons/                           # Extension toolbar icons
├── PROJECT_CONTEXT.md                   # Long-term architecture and session handoff documentation
├── .gitignore                           # Repository-wide ignore rules
└── README.md                            # Project overview and setup documentation
```

> **Note:** Build outputs (`dist/`, `**/dist/`), dependencies (`node_modules/`, `**/node_modules/`), and environment files (`.env`, `**/.env`) are strictly excluded from version control via `.gitignore`.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Markdown Rendering:** `react-markdown`
- **File Export:** `file-saver`
- **Browser Extension:** Chrome Extensions Manifest V3 (`chrome.storage.local`, `chrome.contextMenus`, content scripts, service worker)
- **Backend:** Node.js, Express, `cors`, `dotenv`
- **AI Integration:** Google Gemini API via `@google/generative-ai` (`gemini-2.5-flash`)
- **Persistence:** Browser `localStorage` (React app) and `chrome.storage.local` (Extension bridge)

---

## AI Architecture

- **Frontend Workspace:** Manages conversational state and dispatches user queries or learning prompts through standard HTTP requests.
- **Extension Scripting:** Bridges ChatGPT host page data to the workspace iframe without modifying the host site's scripts.
- **Backend Service:** Runs locally on port `5000`, providing `/chat` and `/generate-title` endpoints.
- **AI Processing:** Uses Google Gemini (`gemini-2.5-flash`) with prompt conditioning that instructs the model to act as an educational tutor focusing on intuition, analogies, and key takeaways.
- **Credential Protection:** The Gemini API key is loaded strictly on the backend via a local `.env` file and is never exposed to client-side scripts or committed to Git.

---

## Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm
- Google Chrome browser
- Google Gemini API key (obtainable from Google AI Studio)

---

### 1. Clone the Repository

```bash
git clone https://github.com/pranjalthakur294-arch/chatgpt-learning-workspace.git
cd chatgpt-learning-workspace
```

---

### 2. Install Frontend Dependencies

```bash
cd ai-learning-workspace-extension
npm install
```

---

### 3. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `ai-learning-workspace-extension/server` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

> **Important:** Never commit the real `.env` file or expose your API key. A safe template is available at `server/.env.example`.

---

### 4. Start the Backend Server

From `ai-learning-workspace-extension/server`:

```bash
npm start
```

The server will initialize on `http://localhost:5000`:
```text
Server running on port 5000
```

---

### 5. Build the Frontend

From `ai-learning-workspace-extension`:

```bash
npm run build
```

This compiles the React application into `ai-learning-workspace-extension/dist`.

---

### 6. Synchronize and Load the Chrome Extension

1. Ensure the built files in `ai-learning-workspace-extension/dist` are present in `extension/dist` (e.g. by copying the folder or creating a directory junction):
   ```powershell
   Copy-Item -Path "ai-learning-workspace-extension\dist\*" -Destination "extension\dist" -Recurse -Force
   ```
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** using the toggle in the top-right corner.
4. Click **Load unpacked**.
5. Select the `extension` folder in your repository directory:
   ```text
   C:\Users\Lenovo\ai-learning-workspace\extension
   ```
6. The **AI Learning Workspace** extension icon will appear in your extensions toolbar.

---

## Usage

1. Open [ChatGPT](https://chatgpt.com) and start or open a conversation.
2. Highlight any text or explanation that you want to examine further.
3. Right-click the selected text and choose **"Create Doubt Thread"**.
4. The AI Learning Workspace sidebar opens on the right side of the screen with a new thread created.
5. Notice that the thread automatically captures your selected text and the original conversation context.
6. The raw context is neatly tucked away under **`▸ View source context`** to keep your reading area distraction-free. Click to expand it whenever you need to check original conversation turns or open the original URL.
7. Use **"💡 Explain"** to get an immediate, structured breakdown of the concept (Intuition → Analogy → Takeaway).
8. Use the input field at the bottom to ask open-ended follow-up questions.
9. Manage your learning library using the sidebar search, rename (`✏️`), delete (`🗑️`), or export (`📄 Export Notes`) features.
10. Close the sidebar using the `✕` button; click the floating **`💡 Workspace`** button at any time to reopen it.

---

## Learning Experience

The design of the workspace centers on keeping the student in an active learning flow:
- **Separation of Context from Conversation:** Raw chat history and metadata are essential for the AI to provide accurate answers, but displaying huge JSON blocks or duplicated conversation logs creates visual clutter. The workspace collapses this data by default, surfacing only the topic and learning exchange.
- **Focused Educational Prompts:** Rather than generic chatbot responses, the `💡 Explain` feature directs the model to prioritize plain-English intuition and real-world analogies before summarizing key takeaways.

---

## Security

- **Zero Client-Side Secret Exposure:** The Gemini API key is never bundled into the Chrome extension or frontend JavaScript files.
- **Server Boundary:** All API calls are routed through the local Node Express server, which attaches the `GEMINI_API_KEY` from the local environment.
- **Git Protection:** The root `.gitignore` excludes `.env`, `**/.env`, `*.log`, and dependency/build artifacts.
- **Placeholder Templates:** Only `.env.example` with non-functional placeholder values is tracked in source control.

---

## Current Limitations

- **Platform Focus:** The content extractor is currently optimized specifically for ChatGPT (`https://chatgpt.com`). Extraction on other platforms (such as Claude or Gemini) is not part of the active implementation.
- **Local Server Requirement:** The backend server runs locally on Node.js (`localhost:5000`) and must be started for AI requests to succeed.
- **Storage Boundary:** Threads are persisted in browser `localStorage`, meaning threads are specific to the local browser profile and are not yet synced across devices via Cloud databases.
- **Development Status:** The project is an active development and portfolio project rather than a hosted multi-tenant SaaS application.

---

## Roadmap

- [x] Context-menu doubt thread creation on ChatGPT
- [x] Automatic conversation context and URL extraction
- [x] Persistent threads via `localStorage`
- [x] Conversational AI follow-up chat
- [x] One-click `💡 Explain` structured learning action
- [x] Collapsible source context UI
- [x] Floating workspace reopen toggle
- [x] Markdown export of threads and notes
- [ ] Additional learning-oriented learning tools and workflows
- [ ] Broader AI platform support (Claude, Google Gemini, documentation sites)
- [ ] Cloud sync and account-based persistence
- [ ] Production deployment

---

## Development

The project is tracked with Git and hosted on GitHub at [chatgpt-learning-workspace](https://github.com/pranjalthakur294-arch/chatgpt-learning-workspace). The `main` branch maintains the current stable development baseline.

To verify code formatting and types:
```bash
cd ai-learning-workspace-extension
npx tsc -b
npm run build
```

---

## License

License: Not currently specified.
