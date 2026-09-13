console.log("chrome =", chrome);
console.log("chrome.storage =", chrome.storage);
import { useEffect, useState } from "react";
import "./App.css";
import CreateThreadModal from "./components/CreateThreadModal";
import { generateTitle } from "./api/generateTitle";
import ThreadList from "./components/ThreadList";
import ThreadView from "./components/ThreadView";
import ChatInput from "./components/ChatInput";
import RenameThreadModal from "./components/RenameThreadModal";
import { buildContext } from "./ai/buildContext";
import type { Thread } from "./types/thread";
import { sendToAI } from "./api/chat";
import { exportThread } from "./utils/exportThread";

declare const chrome: any;
function App() {
  console.log("APP STARTED");
  
  console.log("APP COMPONENT RENDERED");
  const [threads, setThreads] = useState<Thread[]>(() => {
  const savedThreads =
    localStorage.getItem("threads");

  if (savedThreads) {
    return JSON.parse(savedThreads);
  }

 return [
  {
  id: 1,
  title: "Context Switch",
  context: "Operating Systems",
  createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
   messages: [
  {
    sender: "User",
    text: "What is context switching?",
    timestamp: new Date().toISOString(),
  },
],
  },
 {
  id: 2,
  title: "Kernel Thread",
  context: "Operating Systems",
  createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
  },
];
});
useEffect(() => {
  localStorage.setItem(
    "threads",
    JSON.stringify(threads)
  );
}, [threads]);  


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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleParentMessage = (event: MessageEvent) => {
      if (event.data?.type === "OPEN_SIDEBAR") {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("message", handleParentMessage);
    return () => window.removeEventListener("message", handleParentMessage);
  }, []);

  useEffect(() => {
    const listener = async (changes: any) => {

    if (!changes.selectedText?.newValue) return;

    const text = changes.selectedText.newValue;

    const sourceUrl =
      changes.sourceUrl?.newValue;

    const chatTitle =
      changes.chatTitle?.newValue;

    const conversation =
      changes.conversation?.newValue || [];

    chrome.storage.local.remove([
      "selectedText",
      "sourceUrl",
      "chatTitle",
      "conversation",
    ]);

    console.log("Storage received");

    const now =
      new Date().toISOString();

    const threadId =
      Date.now();

    const contextData = `
Conversation Title:
${chatTitle}

Recent Conversation:
${JSON.stringify(conversation, null, 2)}

Selected Text:
${text}

Source:
${sourceUrl}
`;

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

    setThreads((prev) => [
      newThread,
      ...prev,
    ]);

    setSelectedThreadId(threadId);

    setSidebarOpen(true);

const prompt = buildLearningPrompt(
  newThread.title,
  newThread.messages,
  conversation,
  text,
  sourceUrl
);

try {
  console.log("BEFORE sendToAI");

  const aiReply = await sendToAI(prompt);

  console.log("AFTER sendToAI", aiReply);

  setThreads((prev) =>
    prev.map((thread) =>
      thread.id === threadId
        ? {
            ...thread,
            messages: [
              ...thread.messages,
              {
                sender: "AI",
                text: aiReply,
                timestamp: new Date().toISOString(),
              },
            ],
          }
        : thread
    )
  );

  console.log("AFTER setThreads");
} catch (err) {
  console.error("sendToAI ERROR:", err);
}
  };

  chrome.storage.onChanged.addListener(
    listener
  );

  return () =>
    chrome.storage.onChanged.removeListener(
      listener
    );

}, []);

useEffect(() => {
  if (
    selectedThreadId === null &&
    threads.length > 0
  ) {
    setSelectedThreadId(threads[0].id);
  }
}, [threads, selectedThreadId]);

const selectedThread =
  threads.find(
    (thread) => thread.id === selectedThreadId
  ) ?? null;
  const sortedThreads = [...threads].sort(
  (a, b) =>
    new Date(b.updatedAt).getTime() -
    new Date(a.updatedAt).getTime()
);
console.log(
  "THREADS:",
  threads
);
const filteredThreads = sortedThreads.filter(
  (thread) =>
    (thread.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
);
const createThread = (
  title: string,
  context: string
) => {
  const now = new Date().toISOString();

  const newThread: Thread = {
  id: Date.now(),
  title,
  context,
  createdAt: now,
  updatedAt: now,
  messages: [],
};

  setThreads((prevThreads) => [
    ...prevThreads,
    newThread,
  ]);

  setSelectedThreadId(newThread.id);

  setShowModal(false);
};
const deleteThread = (threadId: number) => {
  const updatedThreads = threads.filter(
    (thread) => thread.id !== threadId
  );
  

  setThreads(updatedThreads);

  if (selectedThreadId === threadId) {
    if (updatedThreads.length > 0) {
      setSelectedThreadId(updatedThreads[0].id);
    } else {
      setSelectedThreadId(null);
    }
  }
};
const renameThread = (
  threadId: number,
  newTitle: string
) => {
  setThreads((prevThreads) =>
    prevThreads.map((thread) =>
      thread.id === threadId
        ? {
            ...thread,
            title: newTitle,
            updatedAt:
              new Date().toISOString(),
          }
        : thread
    )
  );
};
function buildLearningPrompt(
  threadTitle: string,
  threadMessages: any[],
  conversation: any[],
  selectedText: string,
  sourceUrl: string
) {
  const threadHistory = threadMessages
    .map((m) => `${m.sender}: ${m.text}`)
    .join("\n");

  const originalConversation = conversation
    .map((m: any) => `${m.role.toUpperCase()}:\n${m.text}`)
    .join("\n\n");

  return `
You are an expert tutor helping a student learn.

==============================
CURRENT THREAD
==============================

${threadTitle}

Previous Thread Messages:

${threadHistory}

==============================
ORIGINAL AI CONVERSATION
==============================

${originalConversation}

==============================
CURRENT QUESTION
==============================

Selected Text:

${selectedText}

Source:

${sourceUrl}

==============================
TASK
==============================

1. Explain the selected concept.
2. Relate it to the previous discussion.
3. Mention why it is important.
4. Keep the explanation concise.
5. Use Markdown formatting.
`;
}
const sendMessage = async (text: string) => {
  if (!selectedThreadId) return;

  setIsTyping(true);

  // Add user message
  setThreads((prevThreads) =>
    prevThreads.map((thread) => {
      if (thread.id === selectedThreadId) {
        return {
          ...thread,
          updatedAt: new Date().toISOString(),
          messages: [
            ...thread.messages,
            {
  sender: "User",
  text,
  timestamp: new Date().toISOString(),
},

          ],
        };
      }

      return thread;
    })
  );
const currentThread = threads.find(
  (thread) => thread.id === selectedThreadId
);

try {
  if (
    currentThread &&
    currentThread.messages.length === 0
  ) {
    try {
      const newTitle =
        await generateTitle(text);

      if (newTitle) {
        renameThread(
          selectedThreadId,
          newTitle
        );
      }
    } catch (titleError) {
      console.error("generateTitle error:", titleError);
    }
  }

  await new Promise((resolve) =>
    setTimeout(resolve, 1000)
  );

  const aiReply = await sendToAI(
    buildContext(
      currentThread?.context || "",
      currentThread?.messages || []
    ) +
      "\n\nUser: " +
      text
  );

  if (!aiReply) {
    throw new Error("Empty reply from AI service");
  }

  // Add AI message
  setThreads((prevThreads) =>
    prevThreads.map((thread) => {
      if (thread.id === selectedThreadId) {
        return {
          ...thread,
          updatedAt: new Date().toISOString(),
          messages: [
            ...thread.messages,
            {
              sender: "AI",
              text: aiReply,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      }

      return thread;
    })
  );
} catch (err) {
  console.error("sendToAI ERROR:", err);

  setThreads((prevThreads) =>
    prevThreads.map((thread) => {
      if (thread.id === selectedThreadId) {
        return {
          ...thread,
          updatedAt: new Date().toISOString(),
          messages: [
            ...thread.messages,
            {
              sender: "AI",
              text: "⚠️ Failed to get AI response. Please make sure the local server is running on port 5000 and try again.",
              timestamp: new Date().toISOString(),
            },
          ],
        };
      }

      return thread;
    })
  );
} finally {
  setIsTyping(false);
}
};

const explainCurrentThread = async () => {
  if (!selectedThreadId || isTyping) return;

  const targetThreadId = selectedThreadId;
  const currentThread = threads.find((t) => t.id === targetThreadId);
  if (!currentThread) return;

  setIsTyping(true);

  const contextText = currentThread.context ? `Context:\n${currentThread.context}\n\n` : "";
  const historyText =
    currentThread.messages.length > 0
      ? `Recent Discussion:\n${currentThread.messages.map((m) => `${m.sender}: ${m.text}`).join("\n")}\n\n`
      : "";

  const explanationPrompt = `
Topic / Question:
${currentThread.title}

${contextText}${historyText}TASK:
Explain this concept clearly and concisely for a student.
Please structure your explanation with:
1. Plain-English intuition (what is it conceptually?)
2. A concrete analogy or real-world/code example
3. Key takeaway / why it matters

Focus directly on the selected topic/doubt and its context rather than generating an unrelated general lecture.
Use clean Markdown formatting.
`.trim();

  try {
    const aiReply = await sendToAI(explanationPrompt);

    if (!aiReply) {
      throw new Error("Empty reply from AI service");
    }

    setThreads((prevThreads) =>
      prevThreads.map((thread) => {
        if (thread.id === targetThreadId) {
          return {
            ...thread,
            updatedAt: new Date().toISOString(),
            messages: [
              ...thread.messages,
              {
                sender: "AI",
                text: aiReply,
                timestamp: new Date().toISOString(),
                type: "explanation",
              },
            ],
          };
        }
        return thread;
      })
    );
  } catch (err) {
    console.error("explainCurrentThread ERROR:", err);

    setThreads((prevThreads) =>
      prevThreads.map((thread) => {
        if (thread.id === targetThreadId) {
          return {
            ...thread,
            updatedAt: new Date().toISOString(),
            messages: [
              ...thread.messages,
              {
                sender: "AI",
                text: "⚠️ Failed to get explanation. Please make sure the local server is running on port 5000 and try again.",
                timestamp: new Date().toISOString(),
              },
            ],
          };
        }
        return thread;
      })
    );
  } finally {
    setIsTyping(false);
  }
};

const closeSidebar = () => {
  setSidebarOpen(false);

  window.parent.postMessage(
    {
      type: "CLOSE_SIDEBAR",
    },
    "*"
  );
};

return (
  <>
    {sidebarOpen && (
<div className="app">
  <button
    className="close-sidebar"
    onClick={closeSidebar}
  >
    ✕
  </button>
     <div className="sidebar">
  <button
    className="new-thread-btn"
    onClick={() => setShowModal(true)}
  >
    + New Thread
  </button>

  <input
    className="search-input"
    type="text"
    placeholder="Search threads..."
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(e.target.value)
    }
  />

  <ThreadList
  threads={filteredThreads}
  selectedThreadId={selectedThreadId}
  onSelectThread={setSelectedThreadId}
  onDeleteThread={deleteThread}
  onRenameThread={(threadId) => {
  const thread = threads.find(
    (t) => t.id === threadId
  );

  if (thread) {
    setRenamingThread(thread);
  }
}}
/>
</div>

{selectedThread && (
  <button
    className="export-btn"
    onClick={() =>
      exportThread(selectedThread)
    }
  >
    📄 Export Notes
  </button>
)}
      <div className="main-content">
        {selectedThread && (
          <ThreadView
  title={selectedThread.title}
  context={selectedThread.context}
  sourceUrl={selectedThread.sourceUrl}
  messages={selectedThread.messages}
  isTyping={isTyping}
/>
        )}

       <ChatInput
  onSendMessage={sendMessage}
  onExplain={explainCurrentThread}
  isTyping={isTyping}
/>
      </div>
    </div>

)}
    {showModal && (
      <CreateThreadModal
        onCreate={createThread}
        onClose={() => setShowModal(false)}
      />
    )}
    {renamingThread && (
  <RenameThreadModal
    currentTitle={
      renamingThread.title
    }
    onRename={(newTitle) => {
      renameThread(
        renamingThread.id,
        newTitle
      );

      setRenamingThread(null);
    }}
    onClose={() =>
      setRenamingThread(null)
    }
  />
)}
  </>
);

}



export default App;