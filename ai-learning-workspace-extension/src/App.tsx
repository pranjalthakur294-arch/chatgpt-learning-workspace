console.log("chrome =", chrome);
console.log("chrome.storage =", chrome.storage);
import { useEffect, useState, useRef } from "react";
import "./App.css";
import CreateThreadModal from "./components/CreateThreadModal";
import { generateTitle } from "./api/generateTitle";
import ThreadList from "./components/ThreadList";
import ThreadView from "./components/ThreadView";
import ChatInput from "./components/ChatInput";
import RenameThreadModal from "./components/RenameThreadModal";
import { buildContext } from "./ai/buildContext";
import type { Thread, Message, MessageType, QuizData, PracticeData } from "./types/thread";
import { sendToAI } from "./api/chat";
import { exportThread } from "./utils/exportThread";

declare const chrome: any;

function normalizeMessage(raw: unknown): Message | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return null;
  }
  const m = raw as Record<string, unknown>;
  if (typeof m.sender !== "string" || typeof m.text !== "string") {
    return null;
  }

  const isValidTimestamp =
    typeof m.timestamp === "string" && !isNaN(Date.parse(m.timestamp));

  const validTypes: MessageType[] = ["chat", "explanation", "quiz", "practice"];
  const msgType =
    typeof m.type === "string" && validTypes.includes(m.type as MessageType)
      ? (m.type as MessageType)
      : undefined;

  const message: Message = {
    sender: m.sender,
    text: m.text,
    timestamp: isValidTimestamp ? (m.timestamp as string) : new Date().toISOString(),
  };

  if (msgType) {
    message.type = msgType;
  }
  if (m.quiz && typeof m.quiz === "object" && !Array.isArray(m.quiz)) {
    message.quiz = m.quiz as QuizData;
  }
  if (m.practice && typeof m.practice === "object" && !Array.isArray(m.practice)) {
    message.practice = m.practice as PracticeData;
  }

  return message;
}

function normalizeThreadCandidate(raw: unknown): Thread | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return null;
  }
  const t = raw as Record<string, unknown>;
  if (
    typeof t.id !== "number" ||
    !Number.isFinite(t.id) ||
    typeof t.title !== "string" ||
    !Array.isArray(t.messages)
  ) {
    return null;
  }

  const validMessages = t.messages
    .map(normalizeMessage)
    .filter((m): m is Message => m !== null);

  const context =
    typeof t.context === "string"
      ? t.context
      : t.context != null
      ? String(t.context)
      : "";

  const isValidCreatedAt =
    typeof t.createdAt === "string" && !isNaN(Date.parse(t.createdAt));
  const isValidUpdatedAt =
    typeof t.updatedAt === "string" && !isNaN(Date.parse(t.updatedAt));

  const now = new Date().toISOString();
  const createdAt = isValidCreatedAt
    ? (t.createdAt as string)
    : isValidUpdatedAt
    ? (t.updatedAt as string)
    : now;
  const updatedAt = isValidUpdatedAt
    ? (t.updatedAt as string)
    : isValidCreatedAt
    ? (t.createdAt as string)
    : now;

  const thread: Thread = {
    id: t.id,
    title: t.title,
    context,
    createdAt,
    updatedAt,
    messages: validMessages,
  };

  if (typeof t.sourceUrl === "string") {
    thread.sourceUrl = t.sourceUrl;
  }

  return thread;
}

function resolveDuplicateThreadIds(threads: Thread[]): {
  threads: Thread[];
  hadDuplicates: boolean;
} {
  let maxId = 0;
  for (const thread of threads) {
    if (thread.id > maxId) {
      maxId = thread.id;
    }
  }

  const seenIds = new Set<number>();
  let hadDuplicates = false;

  const deduplicated = threads.map((thread) => {
    if (!seenIds.has(thread.id)) {
      seenIds.add(thread.id);
      return thread;
    }

    hadDuplicates = true;
    maxId += 1;
    seenIds.add(maxId);
    return {
      ...thread,
      id: maxId,
    };
  });

  return { threads: deduplicated, hadDuplicates };
}

const getDefaultThreads = (): Thread[] => [
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

interface InitialStateResult {
  threads: Thread[];
  shouldSkipInitialPersist: boolean;
}

function loadInitialThreads(): InitialStateResult {
  try {
    const savedThreads = localStorage.getItem("threads");

    if (savedThreads === null) {
      // Key is missing: retain existing default thread behavior
      return {
        threads: getDefaultThreads(),
        shouldSkipInitialPersist: false,
      };
    }

    const parsed: unknown = JSON.parse(savedThreads);

    if (!Array.isArray(parsed)) {
      // Parsed JSON is not an array (e.g. object, number, boolean)
      return {
        threads: getDefaultThreads(),
        shouldSkipInitialPersist: true,
      };
    }

    if (parsed.length === 0) {
      // Preserve intentionally empty thread list
      return {
        threads: [],
        shouldSkipInitialPersist: false,
      };
    }

    const validThreads: Thread[] = [];
    let hasInvalidEntries = false;

    for (const item of parsed) {
      const normalized = normalizeThreadCandidate(item);
      if (normalized) {
        validThreads.push(normalized);
      } else {
        hasInvalidEntries = true;
      }
    }

    if (validThreads.length === 0) {
      // All entries in the array were invalid
      return {
        threads: getDefaultThreads(),
        shouldSkipInitialPersist: true,
      };
    }

    const { threads: resolvedThreads, hadDuplicates } =
      resolveDuplicateThreadIds(validThreads);

    return {
      threads: resolvedThreads,
      shouldSkipInitialPersist: hasInvalidEntries || hadDuplicates,
    };
  } catch {
    // Malformed JSON or localStorage access failure
    return {
      threads: getDefaultThreads(),
      shouldSkipInitialPersist: true,
    };
  }
}

let lastAssignedThreadId = 0;

function generateUniqueThreadId(existingThreads: Thread[] = []): number {
  const now = Date.now();
  let candidate = now > lastAssignedThreadId ? now : lastAssignedThreadId + 1;

  if (existingThreads.length > 0) {
    const existingIds = new Set(existingThreads.map((t) => t.id));
    while (existingIds.has(candidate)) {
      candidate += 1;
    }
  }

  lastAssignedThreadId = candidate;
  return candidate;
}

function App() {
  console.log("APP STARTED");

  console.log("APP COMPONENT RENDERED");
  const [initialState] = useState(() => loadInitialThreads());
  const [threads, setThreads] = useState<Thread[]>(initialState.threads);
  const shouldSkipPersistRef = useRef(initialState.shouldSkipInitialPersist);

  useEffect(() => {
    if (shouldSkipPersistRef.current) {
      if (threads === initialState.threads) {
        return;
      }
      shouldSkipPersistRef.current = false;
    }

    try {
      localStorage.setItem(
        "threads",
        JSON.stringify(threads)
      );
    } catch (err) {
      console.error("Failed to save threads to localStorage:", err);
    }
  }, [threads, initialState.threads]);


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
const activeRequestsRef = useRef(0);
const processedCaptureIdsRef = useRef<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);

const startAiRequest = () => {
  activeRequestsRef.current += 1;
  setIsTyping(true);
};

const finishAiRequest = () => {
  activeRequestsRef.current = Math.max(0, activeRequestsRef.current - 1);
  if (activeRequestsRef.current === 0) {
    setIsTyping(false);
  }
};

  useEffect(() => {
    const handleParentMessage = (event: MessageEvent) => {
      if (event.data?.type === "OPEN_SIDEBAR") {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("message", handleParentMessage);
    return () => window.removeEventListener("message", handleParentMessage);
  }, []);

  const cleanupLegacyCapture = (consumedPayload: {
    captureId?: string | null;
    selectedText?: string;
    sourceUrl?: string;
    chatTitle?: string;
  }) => {
    try {
      if (typeof chrome === "undefined" || !chrome.storage?.local?.get) return;

      chrome.storage.local.get(
        ["captureId", "selectedText", "sourceUrl", "chatTitle"],
        (current: any) => {
          if (chrome.runtime?.lastError || !current) return;

          let shouldRemove = false;

          if (consumedPayload.captureId) {
            if (current.captureId === consumedPayload.captureId) {
              shouldRemove = true;
            }
          } else {
            if (
              !current.captureId &&
              current.selectedText === consumedPayload.selectedText &&
              current.sourceUrl === consumedPayload.sourceUrl &&
              current.chatTitle === consumedPayload.chatTitle
            ) {
              shouldRemove = true;
            }
          }

          if (shouldRemove && chrome.storage.local.remove) {
            chrome.storage.local.remove([
              "selectedText",
              "sourceUrl",
              "chatTitle",
              "conversation",
              "captureId",
            ]);
          }
        }
      );
    } catch (err) {
      console.error("Failed to clean up legacy capture from storage:", err);
    }
  };

  const cleanupCaptureKey = (storageKey?: string | null, payload?: any) => {
    try {
      if (typeof chrome === "undefined") return;

      if (storageKey) {
        if (chrome.storage?.local?.remove) {
          chrome.storage.local.remove([storageKey], () => {
            if (chrome.runtime?.lastError) {
              console.error(
                "Failed to remove capture key:",
                storageKey,
                chrome.runtime.lastError
              );
            }
          });
        }
      } else if (payload) {
        cleanupLegacyCapture(payload);
      }
    } catch (err) {
      console.error("Failed to clean up capture key:", err);
    }
  };

  const processDoubtCapture = async (
    payload: {
      selectedText?: string;
      sourceUrl?: string;
      chatTitle?: string;
      conversation?: any[];
      captureId?: string | null;
      createdAt?: string;
    },
    storageKey?: string | null
  ) => {
    if (
      typeof payload.selectedText !== "string" ||
      payload.selectedText.trim().length === 0
    ) {
      if (storageKey && typeof chrome !== "undefined" && chrome.storage?.local?.remove) {
        chrome.storage.local.remove([storageKey]);
      }
      return;
    }

    const rawCaptureId = payload.captureId;
    const captureId =
      typeof rawCaptureId === "string" && rawCaptureId.trim().length > 0
        ? rawCaptureId.trim()
        : null;

    if (captureId && processedCaptureIdsRef.current.has(captureId)) {
      if (storageKey && typeof chrome !== "undefined" && chrome.storage?.local?.remove) {
        chrome.storage.local.remove([storageKey]);
      }
      return;
    }

    if (captureId) {
      processedCaptureIdsRef.current.add(captureId);
    }

    cleanupCaptureKey(storageKey, {
      captureId,
      selectedText: payload.selectedText,
      sourceUrl: payload.sourceUrl,
      chatTitle: payload.chatTitle,
    });

    console.log("Storage received");

    const text = payload.selectedText;
    const sourceUrl = payload.sourceUrl;
    const chatTitle = payload.chatTitle;
    const conversation = payload.conversation || [];

    const now = new Date().toISOString();
    const threadId = generateUniqueThreadId(threads);

    const contextData = `
Conversation Title:
${chatTitle || ""}

Recent Conversation:
${JSON.stringify(conversation, null, 2)}

Selected Text:
${text}

Source:
${sourceUrl || ""}
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

    setThreads((prev) => [newThread, ...prev]);
    setSelectedThreadId(threadId);
    setSidebarOpen(true);

    const prompt = buildLearningPrompt(
      newThread.title,
      newThread.messages,
      conversation,
      text,
      sourceUrl || ""
    );

    startAiRequest();

    try {
      console.log("BEFORE sendToAI");

      const aiReply = await sendToAI(prompt);

      console.log("AFTER sendToAI", aiReply);

      if (!aiReply) {
        throw new Error("Empty reply from AI service");
      }

      setThreads((prev) =>
        prev.map((thread) =>
          thread.id === threadId
            ? {
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
              }
            : thread
        )
      );

      console.log("AFTER setThreads");
    } catch (err) {
      console.error("sendToAI ERROR:", err);

      setThreads((prev) =>
        prev.map((thread) =>
          thread.id === threadId
            ? {
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
              }
            : thread
        )
      );
    } finally {
      finishAiRequest();
    }
  };

  useEffect(() => {
    if (typeof chrome === "undefined" || !chrome.storage?.onChanged) {
      return;
    }

    const CAPTURE_KEY_PREFIX = "doubt_capture_";

    const listener = (changes: any, areaName?: string) => {
      if (areaName && areaName !== "local") return;

      let handledCaptureKey = false;

      for (const key of Object.keys(changes)) {
        if (key.startsWith(CAPTURE_KEY_PREFIX)) {
          const change = changes[key];
          if (change && change.newValue) {
            handledCaptureKey = true;
            processDoubtCapture(change.newValue, key);
          }
        }
      }

      if (
        !handledCaptureKey &&
        changes.selectedText?.newValue
      ) {
        processDoubtCapture(
          {
            selectedText: changes.selectedText.newValue,
            sourceUrl: changes.sourceUrl?.newValue,
            chatTitle: changes.chatTitle?.newValue,
            conversation: changes.conversation?.newValue || [],
            captureId: changes.captureId?.newValue,
          },
          null
        );
      }
    };

    chrome.storage.onChanged.addListener(listener);

    if (chrome.storage.local?.get) {
      try {
        chrome.storage.local.get(null, (items: any) => {
          if (chrome.runtime?.lastError) {
            console.error("Cold-start storage get error:", chrome.runtime.lastError);
            return;
          }

          if (!items) return;

          const captureKeys = Object.keys(items).filter((key) =>
            key.startsWith(CAPTURE_KEY_PREFIX)
          );

          captureKeys.sort((a, b) => {
            const payloadA = items[a];
            const payloadB = items[b];
            const timeA = payloadA?.createdAt
              ? new Date(payloadA.createdAt).getTime()
              : 0;
            const timeB = payloadB?.createdAt
              ? new Date(payloadB.createdAt).getTime()
              : 0;
            return timeA - timeB;
          });

          for (const key of captureKeys) {
            const payload = items[key];
            if (payload && typeof payload === "object") {
              processDoubtCapture(payload, key);
            }
          }

          if (items.selectedText && captureKeys.length === 0) {
            processDoubtCapture(
              {
                selectedText: items.selectedText,
                sourceUrl: items.sourceUrl,
                chatTitle: items.chatTitle,
                conversation: items.conversation || [],
                captureId: items.captureId,
              },
              null
            );
          }
        });
      } catch (err) {
        console.error("Cold-start recovery error:", err);
      }
    }

    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
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
  id: generateUniqueThreadId(threads),
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
  if (!selectedThreadId || isTyping) return;

  startAiRequest();

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
  finishAiRequest();
}
};

const explainCurrentThread = async () => {
  if (!selectedThreadId || isTyping) return;

  const targetThreadId = selectedThreadId;
  const currentThread = threads.find((t) => t.id === targetThreadId);
  if (!currentThread) return;

  startAiRequest();

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
    finishAiRequest();
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