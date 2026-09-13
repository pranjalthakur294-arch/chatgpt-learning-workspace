# PROJECT_CONTEXT.md

> **Purpose:** Long-term handoff/context document for the **AI Learning Workspace** project.
>
> **Last reconstructed:** 2026-09-13
>
> **Important evidence rule:** This document only records information supported by the available project conversations/files. Where the available context does not prove the current state, it is explicitly marked **UNKNOWN / NEEDS VERIFICATION** rather than guessed.
>
> **Current source-of-truth rule:** The newest confirmed project information takes precedence over older conversational assumptions. In particular, the folder structure was repeatedly clarified during July 2026; the final confirmed interpretation used here is that the React/Vite project and Chrome extension are separate projects, with `ai-learning-workspace` serving as the workspace containing the React project, while `extension` is separate.

---

# 1. PROJECT OVERVIEW

## 1.1 Project name

**AI Learning Workspace**

The project is a learning-focused browser extension + React UI intended to let a learner capture a doubt/question while using AI or learning content in the browser and turn that captured material into a persistent **doubt thread** inside a dedicated learning workspace.

The available context shows that the project is being built around:

- selected-text capture from web pages,
- doubt/thread creation,
- source/context preservation,
- an injected right-side sidebar/workspace,
- AI responses,
- thread persistence,
- conversation/context extraction,
- eventual support for multiple AI platforms,
- and later learning-oriented features.

The project currently has two distinct codebases/projects that work together.

---

## 1.2 Original problem

The original problem being addressed is the difficulty of turning an isolated question encountered while browsing/using AI into an organized, persistent learning record.

The intended flow is approximately:

```text
Learner is reading/using an AI platform
              |
              | selects text
              v
        Right-click menu
       "Create Doubt Thread"
              |
              v
     Chrome Extension captures
     selected text + context
              |
              v
        React workspace/sidebar
              |
              v
        Creates a thread
              |
              v
      AI response / discussion
              |
              v
       Persistent learning
            thread
```

The available project context specifically shows support being developed for ChatGPT, Claude, and Gemini pages.

---

## 1.3 Main goals

The confirmed goals/roadmap from previous project work include:

### Core goals

1. Inject a learning workspace/sidebar into supported AI websites.
2. Allow the learner to select text and create a doubt thread.
3. Preserve the selected text.
4. Preserve source URL.
5. Preserve page/conversation context where available.
6. Create a persistent thread for the doubt.
7. Allow the learner to continue a conversation around that thread.
8. Obtain an AI response.
9. Allow the sidebar to be opened/closed.
10. Allow sidebar resizing.
11. Remember sidebar width.
12. Persist threads.
13. Improve conversation extraction.
14. Build a better prompt/context builder.

### Longer-term goals discussed

The project roadmap also mentioned:

- better context extraction,
- thread memory,
- Claude support,
- Gemini support,
- flashcards,
- notes export,
- AI Tutor Mode,
- and other learning-oriented functionality.

These longer-term features should **not** be treated as completed merely because they appear in the roadmap.

---

## 1.4 Target users

The intended user is a learner/student who uses AI tools and web content for studying and wants to convert questions into organized learning threads.

The project context does not establish a narrower demographic, institution, or production audience.

---

## 1.5 Expected final outcome

The intended end state is a browser-integrated AI learning environment where the learner can:

- encounter something they do not understand,
- select the relevant text,
- create a doubt thread without leaving the page,
- retain the original context/source,
- discuss the doubt with AI,
- and later return to the thread as part of an organized learning workspace.

The project is therefore more than a simple chat UI: the extension integration and learning-context preservation are central parts of the design.

---

## 1.6 Current overall maturity

**Status: IN PROGRESS / NOT VERIFIED AS RELEASE-READY**

A substantial prototype exists and multiple core pieces were implemented/tested during earlier work. Previous conversations explicitly reached a point where the team wanted to perform a complete Version 1 health check before adding more advanced features.

However, the latest available project context does **not** contain a completed September 2026 health-check result proving that every Version 1 item currently works.

Therefore:

> **Do not assume the current build is production-ready or that every previously working feature still works today.**

The last confirmed development direction was to verify the existing pipeline end-to-end before continuing with new features.

---

# 2. WHERE I AM RIGHT NOW

## 2.1 Most recent project context available

The newest project-specific material available to this reconstruction is the project handoff/context request dated September 13, 2026.

That request does not include new code/test results. The most recent detailed implementation evidence available through the project history is from July 2026.

Therefore, there is an important distinction:

- **Current conversation date:** 2026-09-13
- **Latest detailed implementation evidence available:** July 2026
- **September current runtime status:** UNKNOWN

This distinction is critical for the next ChatGPT instance.

---

## 2.2 Last major development direction

The project had reached the point where the priority was explicitly changed from adding features to **stabilizing the existing Version 1 pipeline**.

The planned health check covered:

1. React build
2. Copying the React build into the extension
3. Loading/reloading the Chrome extension
4. Content-script injection
5. Sidebar behavior
6. Context-menu creation
7. Thread creation
8. AI response
9. Close/open behavior
10. Resize behavior
11. Width persistence
12. Thread persistence
13. Source URL/context preservation
14. Console/error inspection

The project was intended to proceed one verification step at a time, stopping when a step failed rather than continuing to add features on top of an unstable base.

---

## 2.3 Last confirmed implementation state

The available evidence confirms that the following pieces had been implemented at some point:

- React/Vite application exists.
- Chrome extension exists separately.
- Extension uses Manifest V3.
- Extension has a background service worker.
- Extension has a content script.
- Extension creates a context menu called **Create Doubt Thread**.
- The extension is configured for ChatGPT, Claude, and Gemini URLs.
- The content script injects a React app through an iframe.
- The iframe loads `dist/index.html` from the extension package.
- React maintains thread state.
- Threads are stored in `localStorage`.
- Chrome extension storage is used for communication/context transfer.
- Selected text can be passed through Chrome storage.
- Source URL and page text were added to the captured context.
- A thread object contains an ID, title, context, timestamps, and messages.
- AI-response handling exists in the React app.
- Sidebar open/close behavior exists.
- Sidebar width persistence was being implemented.
- Conversation extraction exists as a concept/file (`extractConversation` was imported in `content.js`).
- A debug message was observed where the extension posted a `CREATE_THREAD` message into the iframe.

Some of these were explicitly reported as "worked" in prior conversation. Others are only supported as implementation evidence and still need current verification.

---

## 2.4 Last known bugs/issues

The project encountered several issues during development:

### A. Sidebar initially covering too much of the screen

The injected iframe used a default width of approximately `700px`:

```js
let sidebarWidth =
  Number(localStorage.getItem("ai-sidebar-width")) || 700;
```

The iframe was then given:

```js
iframe.style.width = sidebarWidth + "px";
```

This caused the visible sidebar/white area to occupy a large portion of the screen.

A resize mechanism was being developed.

---

### B. Sidebar resizing did not initially work

The user reported that the sidebar was visible but not resizable.

The code shown in context only proves that the iframe width was being read and applied. The complete final resize implementation is **not available in the current evidence**, so the current state of resizing is UNKNOWN.

---

### C. React build and extension build synchronization

The React application and Chrome extension are separate folders.

The React project produces its own `dist`.

The user manually copies the **entire** React `dist` folder into the Chrome extension's `dist` folder after building.

Confirmed workflow:

```text
ai-learning-workspace
        |
        | npm run build
        v
React project's dist/
        |
        | manually copy entire dist
        v
extension/dist/
        |
        | reload extension
        v
Chrome extension
```

This manual synchronization is known and intentional.

An automated build/copy command was proposed but is **planned, not confirmed implemented**.

---

### D. Hardcoded Vite asset names in `manifest.json`

An older manifest contained entries such as:

```json
"dist/assets/index-DCsseBSf.js",
"dist/assets/index-CU6Dsk7D.css"
```

Vite asset hashes can change between builds.

This was identified as a potential source of stale/missing assets.

The available evidence does not confirm whether the manifest was subsequently changed to eliminate the hardcoded hashed asset dependency.

Therefore this remains:

**OPEN / NEEDS VERIFICATION**

---

### E. Duplicate thread behavior

At one point the user reported that creating a doubt thread appeared to create multiple threads.

The React code included thread creation logic using:

```ts
setThreads((prev) => [
  newThread,
  ...prev,
]);
```

and then selected the newly created thread.

The exact root cause and final permanent fix are not sufficiently documented in the available context.

Therefore:

**NEEDS VERIFICATION**

---

### F. Sidebar/iframe not opening

The project previously experienced situations where:

- the sidebar was not visible,
- the iframe did not open,
- or Chrome showed a blocked page.

The extension's `web_accessible_resources` configuration was added/updated during debugging.

An ad blocker was also considered as a possible cause, but the available context does not establish that an ad blocker was the actual root cause.

---

## 2.5 What should be done FIRST when returning

**Do not start adding new features.**

The first action should be a clean **Version 1 health check** of the current project.

Start with the React build.

### First action

Open a terminal in:

```text
ai-learning-workspace/
```

Then enter the React project directory according to the confirmed local structure and run:

```bash
npm install
```

only if dependencies need to be restored, followed by:

```bash
npm run build
```

If the build fails, fix that before touching the extension.

If it succeeds, copy the entire generated `dist` into the extension's `dist` folder, reload the extension, and proceed through the health-check sequence.

---

## 2.6 What should NOT be redone

Do not automatically rewrite:

- the entire React app,
- the entire extension,
- the thread data structure,
- the basic context-menu architecture,
- the iframe architecture,
- or the storage communication architecture.

These already existed and were actively debugged.

First inspect the current code and test it.

---

## CURRENT POSITION

> **The project is a working/prototyped AI Learning Workspace with a separate React/Vite UI project and Chrome extension project. Core thread/sidebar/AI/extension communication pieces were implemented and at least some were tested during July 2026, but the current September 2026 build has not been proven through the complete Version 1 health check. The project is therefore in the stabilization/verification phase rather than the advanced-feature phase.**

## IMMEDIATE NEXT ACTION

> **Run the Version 1 health check from the React build onward, one step at a time, and stop at the first failure. Do not add new features until the existing pipeline is verified.**

---

# 3. COMPLETE PROJECT STATUS

## Completed / Confirmed Implementations

### 3.1 Separate React/Vite project

**Status: COMPLETED**

A React/Vite project named `ai-learning-workspace` exists.

The project includes:

- `src/`
- `dist/`
- `package.json`
- React entry point
- `App.tsx`
- CSS/UI code

The exact complete tree is not available.

---

### 3.2 Separate Chrome extension

**Status: COMPLETED**

A separate `extension` folder exists.

It contains, at minimum according to available context:

- `manifest.json`
- `background.js`
- `content.js`
- `dist/`
- context/extraction-related code

---

### 3.3 Manifest V3 extension

**Status: COMPLETED**

The extension uses:

```json
"manifest_version": 3
```

and a service worker:

```json
"background": {
  "service_worker": "background.js"
}
```

---

### 3.4 Supported host platforms

**Status: IMPLEMENTED / CURRENT VERIFICATION REQUIRED**

The manifest includes:

```text
https://chatgpt.com/*
https://claude.ai/*
https://gemini.google.com/*
```

This proves the extension was configured to run on these domains.

It does **not** prove that every platform currently has fully working extraction behavior.

---

### 3.5 Context menu

**Status: IMPLEMENTED / PREVIOUSLY TESTED**

The extension creates:

```text
Create Doubt Thread
```

for selected text:

```js
chrome.contextMenus.create({
  id: "createThread",
  title: "Create Doubt Thread",
  contexts: ["selection"],
});
```

---

### 3.6 Selected-text capture

**Status: IMPLEMENTED**

The extension receives selected text from the context-menu event.

The selected text is passed into the extension's communication flow.

---

### 3.7 Thread creation

**Status: IMPLEMENTED / NEEDS CURRENT VERIFICATION**

The React app constructs a thread similar to:

```ts
const newThread: Thread = {
  id: threadId,
  title: text,
  context: contextData,
  sourceUrl,
  createdAt: now,
  updatedAt: now,
  messages: [
    {
      sender: "User",
      text,
      timestamp: now,
    },
  ],
};
```

The exact final interface/type declaration is not available.

---

### 3.8 Thread persistence

**Status: IMPLEMENTED**

The React app uses `localStorage`:

```ts
useEffect(() => {
  localStorage.setItem(
    "threads",
    JSON.stringify(threads)
  );
}, [threads]);
```

This establishes client-side persistence of the thread array.

---

### 3.9 AI-response state

**Status: IMPLEMENTED / CURRENT BEHAVIOR NEEDS VERIFICATION**

The app has:

```ts
const [isTyping, setIsTyping] =
  useState(false);
```

and appends AI messages to a selected thread.

A previous implementation used an AI response placeholder:

```ts
const aiReply =
  "AI response placeholder";
```

Later work was intended to connect this to the backend/AI service.

The exact final production AI API implementation is not present in the available evidence.

---

### 3.10 Sidebar open/close

**Status: IMPLEMENTED / PREVIOUSLY TESTED**

The React application has:

```ts
const [sidebarOpen, setSidebarOpen] =
  useState(true);
```

A previous test reported that the close/collapse behavior "worked" after changes.

Current behavior still needs verification.

---

### 3.11 Sidebar iframe

**Status: IMPLEMENTED**

The extension injects an iframe:

```js
const iframe = document.createElement("iframe");

iframe.src = chrome.runtime.getURL(
  "dist/index.html"
);
```

The iframe is positioned on the right:

```js
iframe.style.position = "fixed";
iframe.style.top = "0";
iframe.style.right = "0";
iframe.style.height = "100vh";
```

---

### 3.12 Source URL

**Status: IMPLEMENTED**

The communication flow includes:

```js
const sourceUrl =
  changes.sourceUrl?.newValue;
```

and the thread includes:

```ts
sourceUrl,
```

---

### 3.13 Page context

**Status: IMPLEMENTED**

The captured context was designed to include:

```text
Selected Text:
...

Original Page Context:
...
```

with page text limited to approximately the first 2000 characters:

```js
pageText?.slice(0, 2000)
```

---

### 3.14 Conversation title

**Status: IMPLEMENTED IN COMMUNICATION PAYLOAD / CURRENT STORAGE NEEDS VERIFICATION**

A debug payload showed:

```text
POSTING TO IFRAME:
{
  type: 'CREATE_THREAD',
  text: ...,
  sourceUrl: ...,
  chatTitle: ...,
  conversation: Array(0)
}
```

This proves the communication layer was designed to carry `chatTitle`.

The final thread persistence/use of that title is not fully verified.

---

# In Progress

## 3.15 Version 1 stabilization

**Status: IN PROGRESS**

This is the most important current workstream.

The goal is to verify all existing functionality before adding advanced features.

---

## 3.16 Sidebar resizing

**Status: PARTIALLY IMPLEMENTED / NEEDS VERIFICATION**

Width persistence was being implemented through:

```js
localStorage.getItem("ai-sidebar-width")
```

The iframe uses that value.

The complete drag/resize implementation is not available in the current evidence.

---

## 3.17 Extension ↔ React communication

**Status: IMPLEMENTED BUT NEEDS END-TO-END VERIFICATION**

The architecture includes:

```text
Chrome context menu
       |
       v
background.js
       |
       v
content.js
       |
       v
chrome.storage
       |
       v
React app / iframe
```

A `CREATE_THREAD` message was observed being posted to the iframe.

This is an important area to verify before further development.

---

## 3.18 AI backend/API integration

**Status: UNKNOWN / PARTIALLY IMPLEMENTED**

Previous conversation included "how to start backend" and a report that it "worked", but the available evidence does not provide the backend's exact framework, files, port, endpoint, model, or final configuration.

Do not invent these details.

---

# Planned

The following were discussed as future development:

1. Better context extraction
2. Thread memory
3. Claude support improvements
4. Gemini support improvements
5. Flashcards
6. Notes export
7. AI Tutor Mode
8. Automated React-to-extension build/copy workflow
9. Formal Git branching/workflow
10. Additional learning features

These are **PLANNED**, not completed.

---

# Blocked

No permanent blocker can be conclusively established from the available evidence.

There are, however, unresolved verification areas:

- current build state,
- current sidebar resize state,
- exact backend state,
- manifest asset-hash behavior,
- duplicate-thread behavior,
- current end-to-end extension communication.

---

# Unknown / Needs Verification

The following must be treated as unknown until tested against the current local code:

- Current React build success
- Current extension build success
- Current Chrome extension load success
- Current sidebar injection success
- Current sidebar hidden/visible initial state
- Current context menu installation
- Current thread creation without duplicates
- Current AI response behavior
- Current backend availability
- Current sidebar resize implementation
- Width persistence
- Thread persistence after browser refresh
- Current source URL persistence
- Current conversation extraction quality
- Claude functionality
- Gemini functionality
- Automated build/copy workflow
- Current Git branch and commit state
- Deployment/hosting status
- Production readiness

---

# 4. FULL PROJECT TIMELINE

## Early prototype phase — June 2026

The project began as a browser-integrated learning workspace.

Initial work included:

- React UI development
- thread/sidebar concepts
- browser extension architecture
- content-script injection
- background service worker
- context menu
- supported AI-site host permissions.

The extension initially had a smaller permission set and was expanded to include:

```text
storage
activeTab
scripting
contextMenus
```

---

## June 22–23 — Initial extension/UI debugging

Problems reported included:

- sidebar not visible,
- "New Thread" not opening,
- Chrome blocking the iframe page,
- multiple threads being created,
- thread creation not visibly occurring.

The manifest was updated to include `web_accessible_resources`.

A context menu was introduced:

```text
Create Doubt Thread
```

The background service worker sent a message to the active tab:

```js
chrome.tabs.sendMessage(tab.id, {
  action: "CREATE_THREAD",
  text: info.selectionText,
});
```

---

## React thread state implementation

The React app developed state such as:

```ts
const [selectedThreadId, setSelectedThreadId] =
  useState<number | null>(null);

const [showModal, setShowModal] =
  useState(false);

const [searchTerm, setSearchTerm] =
  useState("");

const [renamingThread, setRenamingThread] =
  useState<Thread | null>(null);

const [isTyping, setIsTyping] =
  useState(false);

const [sidebarOpen, setSidebarOpen] =
  useState(true);
```

Thread persistence was added using `localStorage`.

Example test data included:

```text
Context Switch
Kernel Thread
```

This indicates the application had a thread-oriented learning UI rather than being only a single chat.

---

## AI response stage

The application began handling AI responses.

The response was appended to the selected thread:

```text
User message
        |
        v
loading / isTyping
        |
        v
AI response
        |
        v
append AI message to same thread
```

A placeholder response was used during some debugging stages.

The final backend integration is not sufficiently documented in the available source.

---

## Sidebar stage

The sidebar was successfully made visible during development.

At one point the user reported that it was "working", while the remaining complaint was that a large white portion covered too much of the screen.

This led to work on:

- width management,
- open/close behavior,
- resizing,
- width persistence.

---

## Separate-project structure clarification

A significant source of confusion was the relationship between:

```text
ai-learning-workspace
```

and:

```text
extension
```

The final clarified structure is:

```text
C:\
│
├── ai-learning-workspace\
│   └── [React/Vite project files]
│
└── extension\
    └── [Chrome extension files]
```

In some conversations the React project was shown as a nested project:

```text
ai-learning-workspace/
└── ai-learning-workspace-extension/
    ├── src/
    ├── dist/
    └── package.json
```

This naming/visualization changed during discussion.

The important final rule is:

> **Do not treat the Chrome `extension` folder as part of the React application. They are separate projects.**

The exact physical path/name of the React project should be verified from the user's current filesystem before giving `cd` commands.

---

## Manual build-copy workflow

The user confirmed that after running the React build they manually copy the **entire `dist` folder** into the Chrome extension.

Confirmed workflow:

```text
React project
     |
     | npm run build
     v
React dist/
     |
     | copy entire folder
     v
extension/dist/
     |
     | reload Chrome extension
     v
test
```

An automated command such as:

```text
npm run build-extension
```

was proposed.

It was intended to:

```text
Build React
     |
     v
Delete old extension/dist
     |
     v
Copy new dist
     |
     v
Done
```

This automation is **planned**, not confirmed implemented.

---

## July 2026 — context extraction

Context capture was expanded.

The React side reads Chrome storage changes:

```js
chrome.storage.onChanged.addListener(
  async (changes) => {
```

It checks:

```js
if (!changes.selectedText)
  return;
```

Then obtains:

```js
const text =
  changes.selectedText.newValue;

const sourceUrl =
  changes.sourceUrl?.newValue;

const pageText =
  changes.pageText?.newValue;
```

It removes the temporary selected-text value:

```js
chrome.storage.local.remove(
  "selectedText"
);
```

Then builds context:

```text
Selected Text:
[text]

Original Page Context:
[first ~2000 chars]
```

A new thread is created from that information.

---

## July 2026 — conversation extraction

The extension imported:

```js
import {
  extractConversation
} from "./extractConversation";
```

This establishes the existence/intended use of an extraction module.

The extraction system was intended to improve the context sent into the learning workspace.

The exact current implementation of `extractConversation` is not available in the reconstructed evidence, so its current quality/status is UNKNOWN.

---

## July 2026 — iframe communication

A debug message showed:

```text
POSTING TO IFRAME:
{
  type: 'CREATE_THREAD',
  text: "...",
  sourceUrl: "...",
  chatTitle: "...",
  conversation: Array(0)
}
```

This is strong evidence that the extension-to-React iframe communication path had been implemented and reached the point of sending a structured `CREATE_THREAD` payload.

However, `conversation: Array(0)` also indicates that at least one captured conversation had no extracted messages at that moment.

That should not automatically be considered a bug without testing the relevant page/platform.

---

## July 2026 — stabilization decision

The project direction was explicitly changed to:

> stabilize Version 1 before adding advanced features.

The planned stable baseline was:

- thread creation,
- sidebar,
- AI response,
- resizing,
- communication.

Only after these were stable should the project move to:

- thread memory,
- better context extraction,
- multi-platform support,
- and other advanced features.

---

## September 13, 2026 — current handoff

A request was made to create a complete `PROJECT_CONTEXT.md` covering the entire project and all relevant prior context.

No new implementation/test evidence was supplied in the request itself.

Therefore the September runtime state is **NOT VERIFIED**.

---

# 5. ARCHITECTURE

## 5.1 High-level architecture

The project has two major parts:

```text
┌───────────────────────────────────────────────┐
│              WEB / AI PLATFORM                │
│                                               │
│  ChatGPT / Claude / Gemini                   │
│                                               │
│       selected text / page context            │
└───────────────────────┬───────────────────────┘
                        │
                        v
┌───────────────────────────────────────────────┐
│             CHROME EXTENSION                  │
│                                               │
│  background.js                                │
│      │                                        │
│      │ context menu                           │
│      v                                        │
│  content.js                                   │
│      │                                        │
│      │ extraction + storage + iframe          │
│      v                                        │
│  injected iframe                              │
│      │                                        │
└──────┼────────────────────────────────────────┘
       │
       v
┌───────────────────────────────────────────────┐
│            REACT LEARNING WORKSPACE            │
│                                               │
│  App.tsx                                      │
│      │                                        │
│      ├── thread state                         │
│      ├── selected thread                      │
│      ├── sidebar state                        │
│      ├── search/rename/modal state            │
│      ├── AI response state                    │
│      └── localStorage persistence             │
│                                               │
└───────────────────────────────────────────────┘
```

---

## 5.2 React project

The React project is responsible for:

- rendering the learning workspace,
- showing threads,
- displaying messages,
- creating/handling thread state,
- handling selected thread state,
- handling sidebar state,
- persisting threads,
- displaying AI responses,
- and providing the UI loaded inside the extension iframe.

---

## 5.3 Chrome extension

The Chrome extension is responsible for:

- browser integration,
- context-menu registration,
- content-script injection,
- supported-site matching,
- page/context extraction,
- iframe injection,
- communication with the React application,
- and Chrome storage interaction.

---

## 5.4 Background service worker

`background.js` is a Manifest V3 service worker.

The confirmed context-menu implementation:

```js
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "createThread",
    title: "Create Doubt Thread",
    contexts: ["selection"],
  });
});
```

When clicked:

```js
chrome.contextMenus.onClicked.addListener(
  (info, tab) => {
    if (info.menuItemId === "createThread") {
      chrome.tabs.sendMessage(tab.id, {
        action: "CREATE_THREAD",
        text: info.selectionText,
      });
    }
  }
);
```

---

## 5.5 Content script

`content.js` is injected into supported sites.

It is responsible for:

- running on supported AI websites,
- creating the sidebar iframe,
- handling browser-page interaction,
- using extraction logic,
- receiving/sending extension messages,
- and participating in context capture.

The content script contains:

```js
import {
  extractConversation
} from "./extractConversation";
```

---

## 5.6 Iframe

The React application is not directly embedded into the host page's DOM.

Instead, the extension creates:

```js
const iframe = document.createElement("iframe");
```

and loads:

```js
iframe.src = chrome.runtime.getURL(
  "dist/index.html"
);
```

This creates a separation between:

```text
Host AI website
```

and:

```text
React learning UI
```

The iframe is positioned as a fixed right-side panel.

---

## 5.7 Chrome storage communication

The React application listens to:

```js
chrome.storage.onChanged
```

The available code shows the React application reacting to a `selectedText` storage change.

The flow is roughly:

```text
Extension captures selected text
          |
          v
chrome.storage.local
          |
          v
React listens through
chrome.storage.onChanged
          |
          v
React reads:
- selectedText
- sourceUrl
- pageText
          |
          v
Create Thread
```

---

## 5.8 Data flow

### Doubt creation flow

```text
1. User selects text
        |
2. Right-click
        |
3. "Create Doubt Thread"
        |
4. background.js receives click
        |
5. background.js sends message to content.js
        |
6. content.js gathers relevant context
        |
7. selected text/source/page context is transferred
        |
8. React receives storage/message event
        |
9. React creates Thread
        |
10. Thread becomes selected
        |
11. AI processing occurs
        |
12. AI response is appended
```

---

# 6. TECHNOLOGY STACK

## Current / Confirmed

### Frontend

- React
- TypeScript
- Vite
- CSS

Evidence includes:

```ts
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
```

---

### Browser extension

- Chrome Extension
- Manifest V3
- JavaScript content script
- JavaScript background service worker
- Chrome Extensions API
- Chrome Storage API
- Chrome Context Menus API
- Chrome runtime messaging
- iframe embedding of the built React application

---

### Build tooling

- npm
- Vite
- React build output in `dist/`

---

### Persistence

Confirmed:

- browser `localStorage` for React thread state
- `chrome.storage.local` for extension-to-React/context transfer

A server-side database is **not confirmed**.

---

### AI

AI response functionality was implemented/attempted.

The exact final provider/model/API is **UNKNOWN from the available project evidence**.

Do not insert a model name or provider into future code without inspecting the current backend/configuration.

---

## Considered / Planned

The project context indicates plans for:

- better multi-platform extraction,
- Claude,
- Gemini,
- thread memory,
- flashcards,
- notes export,
- AI Tutor Mode.

These are roadmap items and should not be treated as current technologies.

---

# 7. COMPLETE FOLDER / FILE STRUCTURE

Only files supported by the available evidence are listed.

## Workspace-level conceptual structure

```text
C:\
│
├── ai-learning-workspace\
│   │
│   └── [React/Vite application]
│       ├── src/
│       ├── dist/
│       ├── package.json
│       ├── package-lock.json
│       └── ...
│
└── extension\
    ├── manifest.json
    ├── background.js
    ├── content.js
    ├── extractConversation.*   [exact extension/filename not fully verified]
    ├── dist/
    └── ...
```

### Important naming note

Some earlier conversation screenshots/context referred to:

```text
ai-learning-workspace/
└── ai-learning-workspace-extension/
```

as the React project.

Other conversation text called the React project simply:

```text
ai-learning-workspace/
```

The reliable rule is:

> **The Chrome `extension` folder is separate.**
>
> The exact name/path of the React project should be checked on the current machine before issuing commands.

---

## React project files

### `src/App.tsx`

**Status:** IMPORTANT / IMPLEMENTED / NEEDS CURRENT VERIFICATION

Responsibilities evidenced by previous code:

- thread state
- selected thread
- modal state
- search state
- renaming state
- typing/loading state
- sidebar state
- localStorage persistence
- Chrome storage listener
- thread creation
- AI response update
- message handling

Important state:

```ts
const [selectedThreadId, setSelectedThreadId] =
  useState<number | null>(null);

const [showModal, setShowModal] =
  useState(false);

const [searchTerm, setSearchTerm] =
  useState("");

const [renamingThread, setRenamingThread] =
  useState<Thread | null>(null);

const [isTyping, setIsTyping] =
  useState(false);

const [sidebarOpen, setSidebarOpen] =
  useState(true);
```

---

### `src/main.tsx`

Confirmed entry point:

```ts
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

### `src/index.css`

Confirmed to contain UI styling.

Available evidence includes styles for:

```css
.sidebar {
  width: 280px;
  border-right: 1px solid #ddd;
  padding: 15px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.thread-view {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.chat-input {
  display: flex;
  border-top: 1px solid #ddd;
  padding: 15px;
}

.chat-input input {
  flex: 1;
  padding: 10px;
}

.chat-input button {
  margin-left: 10px;
  padding: 10px 20px;
}
```

The exact current stylesheet is not available.

---

### `package.json`

Confirmed to exist.

Exact dependencies/scripts are not available in the current evidence.

Do not invent them.

---

### `dist/`

Vite-generated build output.

Important distinction:

```text
React dist/
```

is the build artifact.

The extension actually loads its own:

```text
extension/dist/index.html
```

The user manually copies the complete React `dist` into the extension.

---

# Chrome extension files

## `manifest.json`

Confirmed configuration included:

```json
{
  "manifest_version": 3,
  "name": "AI Learning Workspace",
  "version": "1.0",

  "permissions": [
    "storage",
    "activeTab",
    "scripting",
    "contextMenus"
  ],

  "host_permissions": [
    "https://chatgpt.com/*",
    "https://claude.ai/*",
    "https://gemini.google.com/*"
  ],

  "background": {
    "service_worker": "background.js"
  },

  "content_scripts": [
    {
      "matches": [
        "https://chatgpt.com/*",
        "https://claude.ai/*",
        "https://gemini.google.com/*"
      ],
      "js": ["content.js"]
    }
  ],

  "action": {
    "default_title": "AI Learning Workspace"
  }
}
```

The project later also had:

```json
"web_accessible_resources": [
  {
    "resources": [
      "dist/index.html",
      "dist/assets/index-DCsseBSf.js",
      "dist/assets/index-CU6Dsk7D.css",
      "dist/favicon.svg",
      "dist/icons.svg"
    ],
    "matches": ["<all_urls>"]
  }
]
```

### Important warning

The hashed filenames are historical examples from the evidence.

**Do not assume those exact hashes are still correct.**

Inspect the current `extension/dist/assets/` and current `manifest.json`.

---

## `background.js`

Confirmed responsibilities:

- create context menu on extension installation,
- react to context-menu clicks,
- send selected text to the content script.

Core flow:

```js
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "createThread",
    title: "Create Doubt Thread",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(
  (info, tab) => {
    if (info.menuItemId === "createThread") {
      chrome.tabs.sendMessage(tab.id, {
        action: "CREATE_THREAD",
        text: info.selectionText,
      });
    }
  }
);
```

---

## `content.js`

Confirmed responsibilities:

- extension initialization,
- logging,
- iframe injection,
- sidebar width handling,
- conversation extraction import,
- browser/extension communication.

Important code:

```js
import {
  extractConversation
} from "./extractConversation";

console.log("AI Learning Workspace loaded");
```

Sidebar width:

```js
let sidebarWidth =
  Number(localStorage.getItem("ai-sidebar-width")) || 700;
```

Iframe:

```js
const iframe = document.createElement("iframe");

iframe.src = chrome.runtime.getURL(
  "dist/index.html"
);
```

Positioning:

```js
iframe.style.position = "fixed";
iframe.style.top = "0";
iframe.style.right = "0";
iframe.style.width = sidebarWidth + "px";
iframe.style.height = "100vh";
```

The complete current file is not available in the reconstruction.

---

## `extractConversation`

The existence of this module is supported by:

```js
import {
  extractConversation
} from "./extractConversation";
```

Its exact path, extension, implementation, selectors, and final behavior are not available.

Therefore it must be inspected before modifying conversation extraction.

---

# 8. FEATURES

## Completed / Implemented

### Feature: Chrome context-menu doubt creation

**Status:** IMPLEMENTED

**Purpose:** Let the learner create a thread from selected text.

**Implementation:** Manifest + background context menu + message to content script.

**Important files:**

- `manifest.json`
- `background.js`
- `content.js`

**Dependencies:**

- Chrome Context Menus API
- active content script

**Known issues:** Current installation/functionality needs verification.

**Next action:** Test selection → right-click → menu item → message delivery.

---

### Feature: Injected learning sidebar

**Status:** IMPLEMENTED / PREVIOUSLY WORKED

**Purpose:** Show the React learning workspace beside the AI website.

**Implementation:** Fixed-position iframe.

**Important files:**

- `content.js`
- React build `dist/`

**Known issues:** Width/resizing and current injection behavior need verification.

**Next action:** Confirm initial state and open/close behavior.

---

### Feature: Thread model

**Status:** IMPLEMENTED

**Purpose:** Represent a doubt as a persistent conversation.

Thread structure evidenced:

```ts
{
  id,
  title,
  context,
  sourceUrl,
  createdAt,
  updatedAt,
  messages
}
```

**Next action:** Inspect the current TypeScript interface and confirm it matches all producers/consumers.

---

### Feature: localStorage thread persistence

**Status:** IMPLEMENTED

**Purpose:** Keep threads across React/browser refresh.

**Implementation:**

```ts
localStorage.setItem(
  "threads",
  JSON.stringify(threads)
);
```

**Next action:** Verify persistence after full page refresh.

---

### Feature: Selected text + source context

**Status:** IMPLEMENTED

**Purpose:** Preserve what the learner was looking at.

**Implementation:**

- selected text
- source URL
- page text snippet

**Next action:** Verify the current values are actually stored on every supported platform.

---

### Feature: AI response handling

**Status:** IMPLEMENTED / BACKEND STATE UNKNOWN

**Purpose:** Add AI answers to threads.

**Implementation:** React state update after an AI response.

**Known issue:** Exact backend/API implementation is not available.

**Next action:** Inspect current backend and test one real request.

---

## Partially completed

### Feature: Sidebar resizing

**Status:** PARTIALLY IMPLEMENTED

Width is persisted/read through:

```js
localStorage.getItem("ai-sidebar-width")
```

but complete drag logic is not available in the evidence.

---

### Feature: Conversation extraction

**Status:** PARTIALLY IMPLEMENTED

An `extractConversation` module exists/is referenced.

A captured debug payload once contained:

```text
conversation: Array(0)
```

Therefore extraction should be treated as incomplete until tested.

---

### Feature: Multi-platform support

**Status:** PARTIALLY IMPLEMENTED

The manifest matches:

- ChatGPT
- Claude
- Gemini

However, that only establishes URL-level support.

It does not prove equivalent extraction functionality on all three platforms.

---

## Planned

### Thread memory

Status: PLANNED

Goal: improve AI continuity and preserve richer context across interactions.

---

### Better context extraction

Status: PLANNED / PARTIALLY STARTED

Goal: capture useful conversation/page context more reliably.

---

### Claude support improvements

Status: PLANNED

---

### Gemini support improvements

Status: PLANNED

---

### Flashcards

Status: PLANNED

---

### Notes export

Status: PLANNED

---

### AI Tutor Mode

Status: PLANNED

---

### Automated build/copy

Status: PLANNED

Proposed command:

```bash
npm run build-extension
```

---

# 9. IMPORTANT CODE / IMPLEMENTATION DETAILS

## 9.1 Thread data model

The project uses a thread-oriented model.

A representative implementation is:

```ts
const newThread: Thread = {
  id: threadId,
  title: text,
  context: contextData,
  sourceUrl,
  createdAt: now,
  updatedAt: now,
  messages: [
    {
      sender: "User",
      text,
      timestamp: now,
    },
  ],
};
```

Important:

- `id` uses `Date.now()`.
- `title` initially uses captured text.
- `context` includes selected text/page context.
- `sourceUrl` is retained.
- timestamps are ISO strings.
- the initial user message is inserted immediately.

---

## 9.2 Temporary storage cleanup

After reading selected text, the React code removes:

```js
chrome.storage.local.remove(
  "selectedText"
);
```

This appears intended to prevent stale selected text from being processed repeatedly.

Because duplicate threads were previously reported, this area deserves verification.

---

## 9.3 Thread selection

Newly created threads are selected:

```ts
setSelectedThreadId(threadId);
```

This is intended to make the newly created doubt immediately visible.

---

## 9.4 Thread persistence

React state is mirrored into browser local storage:

```ts
useEffect(() => {
  localStorage.setItem(
    "threads",
    JSON.stringify(threads)
  );
}, [threads]);
```

The current initialization/read logic is not fully available, so verify how the app loads the stored value on startup.

---

## 9.5 AI message update

The project used a functional state update:

```ts
setThreads((prevThreads) =>
  prevThreads.map((thread) =>
    thread.id === threadId
      ? {
          ...thread,
          messages: [
            ...thread.messages,
            {
              sender: "AI",
              text: aiReply,
              timestamp:
                new Date().toISOString(),
            },
          ],
        }
      : thread
  )
);
```

This is important because it updates only the selected thread rather than replacing the entire thread list.

Do not replace this with a non-functional state update without understanding the existing async flow.

---

## 9.6 Chrome storage event

React listens for:

```js
chrome.storage.onChanged.addListener(
  async (changes) => {
```

and checks:

```js
if (!changes.selectedText)
  return;
```

The listener retrieves:

```js
const text =
  changes.selectedText.newValue;

const sourceUrl =
  changes.sourceUrl?.newValue;

const pageText =
  changes.pageText?.newValue;
```

---

## 9.7 Context construction

The intended context is:

```text
Selected Text:
[selected text]

Original Page Context:
[first 2000 characters of page text]
```

This is important because the eventual AI prompt should not rely only on the selected sentence.

---

## 9.8 iframe URL

The extension loads:

```js
chrome.runtime.getURL(
  "dist/index.html"
)
```

Therefore the file must exist in the **Chrome extension's own** `dist/`.

This is why the manual build-copy step matters.

---

## 9.9 Sidebar width

Current/historical logic:

```js
let sidebarWidth =
  Number(localStorage.getItem("ai-sidebar-width")) || 700;
```

The default of `700` was too wide for the user's screen and caused the "white part covering half of my screen" problem.

Future changes should preserve:

- persisted width,
- sensible minimum/maximum bounds,
- open/close behavior.

---

# 10. IMPORTANT DECISIONS WE MADE

## Decision 1 — Keep React project and Chrome extension separate

**Decision:** The React/Vite learning workspace and the Chrome extension are separate projects.

Reason:

- React handles UI/application logic.
- Extension handles browser integration.
- The extension loads the React build from its own `dist`.

This separation was repeatedly clarified after folder-structure confusion.

---

## Decision 2 — React is loaded through an iframe

**Decision:** The extension injects the React workspace as an iframe.

Reason supported by implementation:

```js
iframe.src = chrome.runtime.getURL(
  "dist/index.html"
);
```

This keeps the learning workspace isolated from the host AI site's DOM.

---

## Decision 3 — Context menu is the doubt entry point

**Decision:** The learner creates a doubt by selecting text and using:

```text
Create Doubt Thread
```

This is the main extension interaction established in the prototype.

---

## Decision 4 — Preserve source/context

**Decision:** A thread should retain:

- selected text,
- source URL,
- conversation title where available,
- page/conversation context.

This prevents a thread from becoming detached from the material that caused the doubt.

---

## Decision 5 — Stabilize Version 1 before adding advanced features

**Decision:** Do not proceed to advanced features until the basic system is stable.

The intended stable baseline is:

```text
React build
     ↓
Extension load
     ↓
Sidebar
     ↓
Context menu
     ↓
Thread creation
     ↓
AI response
     ↓
Resize
     ↓
Close/open
     ↓
Persistence
     ↓
Source/context
```

---

## Decision 6 — Manual `dist` copy is acceptable for now

The user currently copies the entire React `dist` into the extension manually.

Automation was proposed as a future improvement, not as a prerequisite.

---

# 11. BUGS AND ISSUES

## Fixed / Previously resolved

### Issue: Context menu missing

**Status:** PREVIOUSLY ADDRESSED

**What changed:** `contextMenus` permission and context-menu creation were added.

**Current status:** Needs current verification.

---

### Issue: React UI/iframe not accessible

**Status:** PARTIALLY ADDRESSED

**What changed:** `web_accessible_resources` was added to the manifest.

**Current status:** Needs verification, especially asset names.

---

### Issue: Sidebar close/collapse

**Status:** PREVIOUSLY REPORTED AS WORKING

**Current status:** Needs verification.

---

### Issue: Backend startup

**Status:** PREVIOUSLY REPORTED AS WORKING

The user asked how to start the backend and later reported that it worked.

Exact command/path is not present in the available evidence.

**Current status:** UNKNOWN.

---

## Open / Needs verification

### Issue: Sidebar resizing

**Status:** OPEN / NEEDS VERIFICATION**

Cause: Width handling existed, but the complete drag implementation is not present in the available evidence.

What was tried:

- storing width in localStorage,
- applying width to iframe.

Remaining work:

- inspect current drag handler,
- test resizing,
- enforce min/max width,
- confirm persistence.

---

### Issue: Duplicate thread creation

**Status:** NEEDS VERIFICATION**

Reported symptom:

> creating a doubt thread appeared to create multiple threads.

Potentially relevant code:

- Chrome storage listener
- temporary `selectedText` removal
- context-menu message flow
- React listener lifecycle
- React StrictMode
- duplicate event/listener registration

Do not assume any one of these is the cause until current code is inspected and tested.

---

### Issue: Hardcoded Vite asset hashes

**Status:** OPEN / NEEDS VERIFICATION**

Historical manifest listed hashed files:

```text
index-DCsseBSf.js
index-CU6Dsk7D.css
```

These can change between builds.

Current manifest and generated assets must be compared.

---

### Issue: Conversation extraction can return empty array

**Status:** OPEN / NEEDS VERIFICATION**

A debug payload contained:

```text
conversation: Array(0)
```

This could mean:

- extractor did not find messages,
- the page structure changed,
- the test page had no extractable conversation,
- or extraction had not yet been implemented for that case.

Do not assume which one without testing.

---

### Issue: White/large sidebar area

**Status:** PARTIALLY ADDRESSED / NEEDS VERIFICATION**

Historical default width:

```text
700px
```

was visibly too large.

Need to inspect current CSS/JS and verify the actual width behavior.

---

# 12. SETUP FROM ZERO

Because exact dependency versions and backend files are not available in the current evidence, these instructions intentionally avoid inventing version numbers or backend commands.

## 12.1 Required software

Confirmed/strongly implied:

- Node.js
- npm
- Google Chrome
- VS Code or another editor

Exact versions are UNKNOWN.

---

## 12.2 Restore React project

Go to the React project.

If the React project is nested under the workspace, it may be:

```text
ai-learning-workspace/
└── ai-learning-workspace-extension/
```

If the current local folder is instead the React project itself, use that directory.

Verify by checking for:

```text
package.json
src/
```

Then:

```bash
npm install
```

---

## 12.3 Build React

Run:

```bash
npm run build
```

Expected result:

- Vite build completes
- no TypeScript/build errors
- `dist/` is generated/updated

Do not proceed if this fails.

---

## 12.4 Copy build into extension

Copy the **entire React `dist/` folder** into:

```text
extension/dist/
```

Replace the old extension `dist` contents rather than leaving stale assets mixed in.

---

## 12.5 Load extension in Chrome

Open:

```text
chrome://extensions
```

Enable:

```text
Developer mode
```

Load/unpack the `extension` folder if it is not already loaded.

If already loaded, click:

```text
Reload
```

---

## 12.6 Open supported AI platform

The manifest has been configured for:

```text
https://chatgpt.com/*
https://claude.ai/*
https://gemini.google.com/*
```

Start with ChatGPT because that was the main debugging/test environment documented in the available history.

---

## 12.7 Inspect content script

Open DevTools.

Expected historical debug messages included:

```text
AI Learning Workspace loaded
```

Other expected messages from the planned health check included:

```text
iframe added
iframe loaded
```

If the current code uses different logs, use the actual current logs instead.

---

## 12.8 Test context menu

Select text.

Right-click.

Expected:

```text
Create Doubt Thread
```

Click it.

Expected:

- sidebar opens,
- new thread is created,
- selected text appears,
- source context is attached.

---

## 12.9 Test AI response

Expected:

```text
User message
      ↓
loading
      ↓
AI response
```

If the request fails:

- inspect browser console,
- inspect backend console if one exists,
- inspect network request,
- do not rewrite the UI before locating the failing layer.

---

# 13. HOW TO RUN THE PROJECT RIGHT NOW

## React

From the React project:

```bash
npm run build
```

Then copy the complete:

```text
dist/
```

into:

```text
extension/dist/
```

---

## Extension

Reload the extension from:

```text
chrome://extensions
```

Then refresh the target website.

For a clean page reload:

```text
Ctrl + Shift + R
```

---

## Backend

**UNKNOWN**

The available evidence confirms that a backend existed or was being used, but it does not preserve:

- exact folder,
- exact command,
- exact port,
- exact endpoint,
- exact framework.

Therefore no backend command should be fabricated.

Before giving a future command, inspect the repository for:

```text
package.json
server files
.env
README
requirements.txt
pyproject.toml
```

or equivalent.

---

# 14. TESTING / VERIFICATION STATUS

## Planned Version 1 health check

### Phase 0 — Environment

- [ ] React dependencies installed
- [ ] React build succeeds

### Phase 1 — Build copy

- [ ] Entire React `dist` copied
- [ ] `extension/dist/index.html` exists
- [ ] Current assets match current build

### Phase 2 — Extension

- [ ] Extension loads
- [ ] No manifest errors

### Phase 3 — Content script

- [ ] `AI Learning Workspace loaded`
- [ ] iframe created
- [ ] iframe loaded

### Phase 4 — Initial UI

- [ ] Sidebar does not permanently cover page
- [ ] Sidebar is in correct position
- [ ] Initial open/closed state is correct

### Phase 5 — Context menu

- [ ] Select text
- [ ] Right-click
- [ ] `Create Doubt Thread` appears

### Phase 6 — Thread creation

- [ ] Sidebar opens
- [ ] One thread is created
- [ ] No duplicate thread
- [ ] Selected text appears
- [ ] New thread selected

### Phase 7 — React console

- [ ] App starts
- [ ] React renders
- [ ] No extension-related red errors

### Phase 8 — AI

- [ ] User message visible
- [ ] Loading state appears
- [ ] AI reply appears
- [ ] No endless loading

### Phase 9 — Sidebar controls

- [ ] Close works
- [ ] Reopen works
- [ ] Second doubt opens correctly

### Phase 10 — Resize

- [ ] Divider/resize control works
- [ ] Width changes smoothly
- [ ] Width remains after refresh

### Phase 11 — Persistence

- [ ] Threads survive refresh
- [ ] Messages remain
- [ ] No duplicate initialization

### Phase 12 — Context

- [ ] Selected text saved
- [ ] Source URL saved
- [ ] Conversation title saved where available
- [ ] Page/conversation context saved

### Phase 13 — Error check

- [ ] No extension-originated red console errors
- [ ] ChatGPT's unrelated warnings are not mistaken for project errors

---

## Important testing principle

> **Do not move to the next phase if the current phase fails.**

This was explicitly chosen to avoid repeatedly changing multiple layers at once and losing track of the source of bugs.

---

# 15. GIT / VERSION CONTROL

The project history discussed a desired Git workflow:

```text
main
develop
feature/context-extraction
feature/thread-memory
feature/claude-support
feature/export
```

However, the available evidence does **not** provide a reliable current:

- branch,
- commit hash,
- commit message,
- uncommitted diff,
- remote,
- or Git status.

Therefore:

**CURRENT GIT STATE: UNKNOWN**

Before continuing substantial work, run:

```bash
git status
git branch --show-current
git log --oneline -10
```

Do not claim a branch or commit is current until those commands are checked.

---

# 16. ENVIRONMENT / CONFIGURATION

## Chrome permissions

Confirmed:

```text
storage
activeTab
scripting
contextMenus
```

---

## Host permissions

Confirmed:

```text
https://chatgpt.com/*
https://claude.ai/*
https://gemini.google.com/*
```

---

## Background service worker

Confirmed:

```json
"background": {
  "service_worker": "background.js"
}
```

---

## Content script

Confirmed:

```json
"content_scripts": [
  {
    "matches": [
      "https://chatgpt.com/*",
      "https://claude.ai/*",
      "https://gemini.google.com/*"
    ],
    "js": ["content.js"]
  }
]
```

---

## Web-accessible resources

Historical configuration included:

```text
dist/index.html
dist/assets/*
dist/favicon.svg
dist/icons.svg
```

The exact current asset list must be verified.

---

## Environment variables

**UNKNOWN**

No verified list of environment variable names is available in the current project evidence.

Never put secrets, API keys, passwords, or tokens in this document.

---

## Ports

**UNKNOWN**

A backend was used/referenced, but its port is not preserved in the available evidence.

---

# 17. REQUIREMENTS AND CONSTRAINTS

## Functional

The workspace should:

- capture selected text,
- create a doubt thread,
- preserve source/context,
- display the thread,
- allow AI interaction,
- persist threads,
- support sidebar controls.

---

## Browser integration

The extension should work on supported AI platforms.

The manifest currently targets:

- ChatGPT
- Claude
- Gemini

---

## UI

The sidebar should:

- appear on the right,
- not permanently consume an excessive portion of the screen,
- be resizable,
- support closing/reopening,
- remember width.

---

## Data/context

A thread should retain:

- selected text,
- source URL,
- conversation title where available,
- context,
- messages,
- timestamps.

---

## Stability

A core project constraint established during development:

> Do not add advanced features until the current baseline is stable.

---

## Project organization

Another important constraint:

> The React/Vite project and Chrome extension are separate projects.

When giving future instructions, explicitly label files as:

```text
React project:
...
```

or:

```text
Chrome extension:
...
```

This prevents the folder confusion that occurred during earlier work.

---

## Explicitly avoid

Do not:

- assume `extension` is inside the React project,
- assume a backend port,
- assume an API provider,
- assume the latest Vite asset hashes,
- assume resizing is fixed,
- assume extraction works on all platforms,
- rewrite the entire application before testing the current code.

---

# 18. DO NOT BREAK

## 18.1 Extension-to-React communication

Preserve the communication chain:

```text
context menu
    ↓
background.js
    ↓
content.js
    ↓
storage/message
    ↓
React iframe
```

---

## 18.2 Thread persistence

Do not remove:

```js
localStorage.setItem(
  "threads",
  JSON.stringify(threads)
);
```

without replacing it with an equally reliable persistence mechanism.

---

## 18.3 Source/context preservation

Do not reduce a thread to only the selected text if the source URL/page context is available.

---

## 18.4 New-thread selection

The current design selects the newly created thread:

```ts
setSelectedThreadId(threadId);
```

Preserve that behavior.

---

## 18.5 Sidebar isolation

The React app is loaded through:

```text
extension/dist/index.html
```

Do not casually replace the iframe architecture with direct DOM injection into ChatGPT without a deliberate architectural decision.

---

## 18.6 Separate project boundaries

Always distinguish:

```text
React/Vite application
```

from:

```text
Chrome extension
```

They are not the same folder/project.

---

# 19. WORK STILL LEFT

# Priority 1 — Do Next

## 1. Run the complete Version 1 health check

**Why:** Current September state is not verified.

**Affected areas:**

- React
- extension
- content script
- iframe
- thread system
- AI
- storage

**Done when:** Every Phase 0–14 item passes.

---

## 2. Verify current project paths

Confirm the actual current filesystem structure.

Expected conceptual structure:

```text
ai-learning-workspace/
    React project

extension/
    Chrome extension
```

If the React project is nested, record its exact path.

**Done when:** Exact paths are known and documented.

---

## 3. Build React and inspect generated assets

Run:

```bash
npm run build
```

Then inspect:

```text
dist/
dist/assets/
```

Compare generated asset names with the extension manifest.

**Done when:** The extension loads the exact current build without stale asset references.

---

## 4. Verify thread creation exactly once

Test:

```text
select text
→ right click
→ Create Doubt Thread
```

Check whether exactly one thread appears.

If duplicates occur, inspect:

- listener registration,
- React StrictMode effects,
- storage cleanup,
- context-menu events,
- message flow.

**Done when:** One click produces one thread.

---

## 5. Verify AI backend end-to-end

Find the current backend first.

Do not guess its command/port.

Then test:

```text
thread
→ user message
→ backend request
→ AI provider
→ response
→ React message
```

**Done when:** A real AI response appears without endless loading or console/network errors.

---

## 6. Finish/verify sidebar resizing

Inspect current `content.js` and any resize-related code.

Verify:

- minimum width,
- maximum width,
- dragging,
- persistence,
- refresh behavior.

**Done when:** The sidebar can be resized and remembers its width.

---

# Priority 2 — After That

## 7. Verify context extraction

Test on ChatGPT first.

Check:

- selected text,
- source URL,
- chat title,
- conversation messages,
- page context.

Then separately test Claude and Gemini.

---

## 8. Remove fragile hardcoded asset references

If the manifest still lists Vite's hashed filenames, replace the fragile approach with a build-safe design.

This should be done only after understanding the current manifest/build process.

---

## 9. Automate the React → extension build process

Implement a reliable command such as:

```bash
npm run build-extension
```

Expected:

```text
build React
     ↓
copy entire dist
     ↓
extension/dist updated
```

---

## 10. Clean up debug logging

After the pipeline is stable, reduce unnecessary logs such as:

```text
BEFORE THREAD
AFTER SETTHREADS
STORAGE RECEIVED
POSTING TO IFRAME
```

Keep useful diagnostics where appropriate.

---

# Priority 3 — Later

Only after the baseline is stable:

1. Better context extraction
2. Thread memory
3. Improved Claude support
4. Improved Gemini support
5. Flashcards
6. Notes export
7. AI Tutor Mode
8. Additional learning tools
9. More robust Git workflow
10. Production packaging/deployment

---

# 20. EXACT NEXT STEPS

1. **Open the current React project and verify its exact filesystem path.**
2. **Check that `package.json` and `src/` are present.**
3. Run:
   ```bash
   npm install
   ```
   if dependencies need restoring.
4. Run:
   ```bash
   npm run build
   ```
5. Confirm the build succeeds.
6. Replace `extension/dist/` with the **entire newly generated React `dist/`**.
7. Inspect `extension/manifest.json`.
8. Compare its `web_accessible_resources` with the newly generated `extension/dist/assets/`.
9. Open:
   ```text
   chrome://extensions
   ```
10. Reload the AI Learning Workspace extension.
11. Open ChatGPT.
12. Hard-refresh:
   ```text
   Ctrl + Shift + R
   ```
13. Open DevTools and verify the content script runs.
14. Select text.
15. Right-click.
16. Confirm:
   ```text
   Create Doubt Thread
   ```
17. Click it.
18. Verify exactly one new thread appears.
19. Verify selected text appears.
20. Verify source URL/context appears.
21. Verify the AI response works.
22. Verify sidebar close.
23. Verify sidebar reopen.
24. Verify sidebar resize.
25. Refresh ChatGPT and verify width persistence.
26. Refresh again and verify thread persistence.
27. Check console for extension-originated errors.
28. Only after all of the above pass, begin advanced feature development.

---

# 21. PROJECT DECISIONS STILL NEEDED

## 21.1 Exact current React project path

**Decision/verification needed:** What is the exact path/name of the React project on the current machine?

The project history contains multiple ways of describing it.

---

## 21.2 Current backend structure

Need to identify:

- backend folder,
- framework,
- start command,
- port,
- endpoint,
- AI provider,
- current environment variables.

---

## 21.3 Final build strategy

Current:

```text
npm run build
→ manual dist copy
```

Future:

```text
npm run build-extension
```

Decision can be made after Version 1 stabilization.

---

## 21.4 Final conversation extraction strategy

Need to decide how much context to capture:

- selected text,
- surrounding page text,
- complete conversation,
- title,
- source URL,
- platform metadata.

This should be driven by actual extractor reliability.

---

# 22. KNOWN RISKS

## 22.1 Vite hashed assets

Hardcoded hashed filenames can become stale after a new build.

---

## 22.2 React StrictMode / event listeners

The React entry point uses:

```tsx
<StrictMode>
```

The storage listener is created inside an effect.

If cleanup is missing, development-mode behavior can contribute to duplicate listeners/events.

This is a hypothesis/risk, **not a confirmed root cause** of duplicate threads.

---

## 22.3 Host website DOM changes

Conversation extraction depends on website structure.

ChatGPT, Claude, and Gemini can change their DOM.

Therefore extraction selectors are inherently fragile.

---

## 22.4 Extension permissions

The extension uses broad host permissions for the supported AI platforms.

Any future change should preserve only the permissions actually required.

---

## 22.5 Client-side persistence

Threads currently use browser localStorage.

This means persistence is tied to the browser/profile and is not yet a demonstrated cloud-backed database system.

---

## 22.6 Manual build synchronization

Manual copying of `dist` creates a risk of:

- stale files,
- missing assets,
- mismatched manifest references,
- testing an old React build.

---

## 22.7 Backend uncertainty

The exact backend architecture is not preserved in the available handoff evidence.

This makes it risky to modify AI communication until the current backend is inspected.

---

# 23. IMPORTANT CONTEXT ABOUT HOW WE WORKED ON THIS PROJECT

## 23.1 Work incrementally

The preferred development approach became:

```text
Change one thing
     ↓
Build
     ↓
Test
     ↓
Confirm
     ↓
Move to next thing
```

---

## 23.2 Do not make broad rewrites during debugging

Earlier broad changes caused "so many errors".

The better approach is:

1. inspect current code,
2. identify the failing layer,
3. make the smallest necessary change,
4. rebuild,
5. test.

---

## 23.3 Explicitly identify which project a file belongs to

Use labels:

```text
React project:
src/App.tsx
```

or:

```text
Chrome extension:
content.js
```

This is particularly important because the two projects have separate `dist` directories.

---

## 23.4 Verify before adding features

The project explicitly moved toward a release-like health check.

Do not continue into advanced features while the baseline is unstable.

---

## 23.5 Avoid unnecessary rewriting

The user has previously asked for full code when necessary, but future changes should still preserve working code rather than replacing entire files unless the current implementation requires it.

---

# 24. CURRENT SOURCE OF TRUTH

Use this priority order.

## Highest authority

### 1. Current local source code

The actual files currently on disk are the most authoritative source.

Always inspect them before making changes.

---

### 2. Current generated build

The current:

```text
dist/
```

and:

```text
extension/dist/
```

show what Chrome will actually run.

---

### 3. Current manifest

`extension/manifest.json` determines extension permissions, content scripts, background worker, and web-accessible resources.

---

### 4. Latest confirmed project decisions

Important confirmed decisions:

- React and extension are separate projects.
- Manual `dist` copying is currently used.
- Version 1 should be stabilized before advanced features.

---

### 5. Older conversations

Use older conversations for historical reasoning and implementation details, but do not assume they represent the current code.

---

# 25. HANDOFF INSTRUCTIONS FOR THE NEXT CHAT

## You are continuing this project.

Before making changes, understand the following:

### Project identity

This is **AI Learning Workspace**, a browser-integrated learning workspace.

It combines:

1. a React/Vite learning UI,
2. a separate Chrome extension.

---

### Architecture

```text
Supported AI website
      |
      v
Chrome extension
      |
      ├── background.js
      ├── content.js
      ├── extraction
      └── iframe
              |
              v
       React workspace
              |
              ├── threads
              ├── messages
              ├── AI response
              ├── search/rename
              └── persistence
```

---

### Do not confuse the folders

The Chrome extension is **not** the React application.

Treat:

```text
React project
```

and:

```text
extension
```

as separate projects.

The React build is manually copied into the extension:

```text
React dist/
     ↓
extension/dist/
```

---

### Current phase

The project is in:

> **Version 1 stabilization / verification**

Do not immediately add flashcards, tutor mode, thread memory, or other advanced features.

---

### Current priority

Run the full health check.

Start with:

```bash
npm run build
```

Then copy the entire `dist` into the extension.

Reload Chrome.

Test the complete pipeline.

---

### Important files

React:

```text
src/App.tsx
src/main.tsx
src/index.css
package.json
dist/
```

Extension:

```text
manifest.json
background.js
content.js
extractConversation.*
dist/
```

The exact complete tree should be checked on disk.

---

### Important existing behavior

Do not remove:

```text
Create Doubt Thread
```

Do not remove:

```js
chrome.storage.onChanged
```

without understanding its role.

Do not remove thread persistence.

Do not remove source URL/context preservation.

Do not rewrite the iframe architecture casually.

---

### Known problem areas

Pay particular attention to:

1. sidebar resizing,
2. duplicate thread creation,
3. stale Vite asset names in manifest,
4. conversation extraction,
5. backend/API configuration,
6. extension ↔ React communication.

---

### Important uncertainty

The exact current backend and current Git state are not preserved in the available context.

Do not invent:

- backend commands,
- ports,
- API endpoints,
- model names,
- Git branches,
- commit hashes.

Inspect the current repository first.

---

### How to proceed

Use this order:

```text
1. Inspect current filesystem
2. Inspect package.json
3. Inspect manifest.json
4. Build React
5. Copy dist
6. Reload extension
7. Test content script
8. Test context menu
9. Test thread creation
10. Test AI
11. Test close/open
12. Test resize
13. Test persistence
14. Test context/source
15. Fix failures
16. Only then continue roadmap
```

---

# 26. FINAL PROJECT SNAPSHOT

**PROJECT:**  
AI Learning Workspace

**PURPOSE:**  
A browser-integrated learning workspace that lets learners capture selected content as organized doubt threads and discuss those doubts with AI while preserving source/context.

**CURRENT STATUS:**  
IN PROGRESS — core prototype exists, but the complete current Version 1 state is not verified as of September 13, 2026.

**CURRENT PHASE:**  
Version 1 stabilization / end-to-end verification.

**LAST COMPLETED TASK:**  
Core prototype functionality was implemented across the React UI and Chrome extension, including context-menu-based doubt creation, iframe sidebar, thread state, storage, context capture, and AI-response handling. Exact latest runtime state needs verification.

**CURRENT TASK:**  
Verify the complete existing pipeline before adding advanced features.

**IMMEDIATE NEXT STEP:**  
Run:

```bash
npm run build
```

from the current React project, then copy the entire generated `dist` into `extension/dist` and begin the Version 1 health check.

**COMPLETION ESTIMATE:**  
UNKNOWN. A percentage would be speculative because the current September runtime/test state is not documented.

**MAJOR FEATURES COMPLETED / IMPLEMENTED:**  

- React/Vite learning UI
- Chrome Manifest V3 extension
- ChatGPT/Claude/Gemini host configuration
- Context menu
- Selected-text capture
- Injected iframe sidebar
- Thread creation
- Thread selection
- Thread persistence via localStorage
- Chrome storage communication
- Source URL capture
- Page-context capture
- AI-response state/update flow

**MAJOR FEATURES REMAINING:**  

- Full Version 1 verification
- Reliable sidebar resizing
- Confirmed duplicate-thread fix
- Robust conversation extraction
- Confirmed backend/API integration
- Build-copy automation
- Better context extraction
- Thread memory
- Stronger Claude/Gemini support
- Flashcards
- Notes export
- AI Tutor Mode

**OPEN BUGS / VERIFICATION ITEMS:**  

- Current build status
- Current extension status
- Sidebar resize
- Possible duplicate thread creation
- Manifest asset hashes
- Conversation extraction
- Backend details
- Current persistence behavior
- Current Git state

**BLOCKERS:**  
No confirmed permanent blocker. Several areas require verification before further development.

**TECH STACK:**  

- React
- TypeScript
- Vite
- CSS
- JavaScript
- Chrome Extension Manifest V3
- Chrome Storage API
- Chrome Context Menus API
- iframe-based React integration
- localStorage
- AI backend/provider — exact current implementation UNKNOWN

**IMPORTANT FILES:**  

```text
React:
src/App.tsx
src/main.tsx
src/index.css
package.json
dist/

Extension:
manifest.json
background.js
content.js
extractConversation.*
dist/
```

**HOW TO RUN:**  

```text
1. Enter React project
2. npm install (if needed)
3. npm run build
4. Copy entire React dist → extension/dist
5. Open chrome://extensions
6. Reload AI Learning Workspace
7. Open ChatGPT
8. Hard refresh
9. Run Version 1 health check
```

**HOW TO TEST:**  

```text
Build
→ load extension
→ verify content script
→ select text
→ Create Doubt Thread
→ verify one thread
→ verify context/source
→ verify AI response
→ close/reopen sidebar
→ resize
→ refresh
→ verify width persistence
→ verify thread persistence
→ inspect console
```

---

# END OF PROJECT_CONTEXT.md
