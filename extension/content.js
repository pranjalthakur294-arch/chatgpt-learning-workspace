
console.log("AI Learning Workspace loaded");
function getCleanText(element, excludeSelectors = []) {
  if (!element) return "";
  if (excludeSelectors.length > 0) {
    const clone = element.cloneNode(true);
    excludeSelectors.forEach((selector) => {
      clone.querySelectorAll(selector).forEach((el) => el.remove());
    });
    return (clone.innerText || clone.textContent || "").trim();
  }
  return (element.innerText || element.textContent || "").trim();
}

function extractChatGPTConversation() {
  const roleElements = document.querySelectorAll('[data-message-author-role]');
  const turns = [];

  roleElements.forEach((roleEl) => {
    const rawRole = roleEl.getAttribute("data-message-author-role");
    if (rawRole !== "user" && rawRole !== "assistant") return;

    const role = rawRole;
    let text = "";

    if (role === "assistant") {
      const contentNode = roleEl.querySelector(".markdown") || roleEl;
      text = getCleanText(contentNode, [
        "button",
        '[role="button"]',
        ".text-xs",
        '[data-testid*="button"]'
      ]);
    } else {
      text = getCleanText(roleEl, [
        "button",
        '[role="button"]',
        ".text-xs"
      ]);
    }

    if (text) {
      turns.push({ role, text });
    }
  });

  return turns;
}

function extractClaudeConversation() {
  const turns = [];

  let elements = Array.from(
    document.querySelectorAll(
      '[data-testid="user-message"], [data-testid="assistant-message"]'
    )
  );

  if (elements.length === 0) {
    elements = Array.from(
      document.querySelectorAll(".font-user-message, .font-claude-message")
    );
  }

  elements.forEach((el) => {
    const isUser =
      el.matches('[data-testid="user-message"], .font-user-message') ||
      !!el.closest('[data-testid="user-message"]') ||
      !!el.querySelector(".font-user-message");

    const role = isUser ? "user" : "assistant";

    let text = "";
    if (isUser) {
      text = getCleanText(el, ["button", '[role="button"]', ".text-xs"]);
    } else {
      const contentEl = el.querySelector(".standard-markdown") || el;
      text = getCleanText(contentEl, [
        "button",
        '[role="button"]',
        '[data-testid="thinking-content"]',
        ".thinking-container",
        "details",
        ".text-xs"
      ]);
    }

    if (text) {
      turns.push({ role, text });
    }
  });

  return turns;
}

function extractGeminiConversation() {
  const turns = [];

  let elements = Array.from(
    document.querySelectorAll("user-query, model-response")
  );

  if (elements.length === 0) {
    elements = Array.from(
      document.querySelectorAll(
        ".user-query-container, .model-response-container, .query-content, .response-content"
      )
    );
  }

  elements.forEach((el) => {
    const tagName = el.tagName ? el.tagName.toLowerCase() : "";
    const isUser =
      tagName === "user-query" ||
      el.classList.contains("user-query-container") ||
      el.classList.contains("query-content");

    const role = isUser ? "user" : "assistant";

    let text = "";
    if (isUser) {
      const userTextEl =
        el.querySelector(".query-text, .text-content, p") || el;
      text = getCleanText(userTextEl, ["button", '[role="button"]']);
    } else {
      const responseTextEl =
        el.querySelector(".model-response-text, message-content, .markdown") || el;
      text = getCleanText(responseTextEl, [
        "button",
        '[role="button"]',
        ".citation",
        ".citations-container",
        ".sources-container",
        ".suggestion-chips",
        "mat-chip-listbox",
        "mat-chip-set",
        "mat-chip",
        ".text-xs"
      ]);
    }

    if (text) {
      turns.push({ role, text });
    }
  });

  return turns;
}

function extractFallbackConversation() {
  const articles = document.querySelectorAll("article");
  const turns = [];

  articles.forEach((article, index) => {
    const isUser = !!article.querySelector('[data-message-author-role="user"]');
    const isAssistant = !!article.querySelector('[data-message-author-role="assistant"]');
    const role = isUser ? "user" : isAssistant ? "assistant" : index % 2 === 0 ? "user" : "assistant";

    const text = getCleanText(article, ["button", '[role="button"]', ".text-xs"]);
    if (text) {
      turns.push({ role, text });
    }
  });

  return turns;
}

function extractConversation() {
  const hostname = window.location.hostname;
  let conversation = [];

  try {
    if (hostname.includes("chatgpt.com")) {
      conversation = extractChatGPTConversation();
    } else if (hostname.includes("claude.ai")) {
      conversation = extractClaudeConversation();
    } else if (hostname.includes("gemini.google.com")) {
      conversation = extractGeminiConversation();
    }

    if (conversation.length === 0) {
      conversation = extractFallbackConversation();
    }
  } catch (err) {
    console.error("Conversation extraction error:", err);
    conversation = extractFallbackConversation();
  }

  const cleaned = [];
  conversation.forEach((msg) => {
    if (!msg.text || !msg.text.trim()) return;
    const prev = cleaned[cleaned.length - 1];
    if (prev && prev.role === msg.role && prev.text === msg.text) {
      return;
    }
    cleaned.push({
      role: msg.role === "user" ? "user" : "assistant",
      text: msg.text.trim(),
    });
  });

  return cleaned.slice(-10);
}
let sidebarWidth =
  Number(localStorage.getItem("ai-sidebar-width")) || 700;

const iframe = document.createElement("iframe");

iframe.src = chrome.runtime.getURL(
  "dist/index.html"
);

iframe.style.position = "fixed";
iframe.style.top = "0";
iframe.style.right = "0";
iframe.style.width = sidebarWidth + "px";
iframe.style.height = "100vh";
iframe.style.border = "2px solid red";
iframe.style.background = "white";
iframe.style.zIndex = "999999";
iframe.style.display = "none";

let toggleBtn = null;

function openSidebar() {
  iframe.style.display = "block";
  resizeHandle.style.display = "block";
  if (toggleBtn) {
    toggleBtn.style.display = "none";
  }
  try {
    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: "OPEN_SIDEBAR" }, "*");
    }
  } catch (err) {
    console.error("Failed to post OPEN_SIDEBAR to iframe:", err);
  }
}

function closeSidebar() {
  iframe.style.display = "none";
  resizeHandle.style.display = "none";
  if (toggleBtn) {
    toggleBtn.style.display = "flex";
  }
}

function initChatGPTToggleButton() {
  if (!window.location.hostname.includes("chatgpt.com")) return;
  if (document.getElementById("ai-workspace-toggle-btn")) return;

  toggleBtn = document.createElement("button");
  toggleBtn.id = "ai-workspace-toggle-btn";
  toggleBtn.title = "Open AI Learning Workspace";
  toggleBtn.setAttribute("aria-label", "Open AI Learning Workspace");

  toggleBtn.innerHTML = `
    <span style="font-size: 16px; line-height: 1;">💡</span>
    <span style="font-size: 12px; font-weight: 600; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; letter-spacing: 0.2px;">Workspace</span>
  `;

  Object.assign(toggleBtn.style, {
    position: "fixed",
    right: "0px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: "999998",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px 0 0 8px",
    padding: "8px 10px",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "transform 0.15s ease, background 0.15s ease",
    userSelect: "none",
  });

  toggleBtn.addEventListener("mouseenter", () => {
    toggleBtn.style.background = "#1d4ed8";
    toggleBtn.style.transform = "translateY(-50%) scale(1.04)";
  });

  toggleBtn.addEventListener("mouseleave", () => {
    toggleBtn.style.background = "#2563eb";
    toggleBtn.style.transform = "translateY(-50%) scale(1)";
  });

  toggleBtn.addEventListener("click", () => {
    openSidebar();
  });

  document.body.appendChild(toggleBtn);
}

let iframeReady = false;

iframe.onload = () => {
  iframeReady = true;
  console.log("iframe loaded");
  if (iframe.style.display === "block" && iframe.contentWindow) {
    iframe.contentWindow.postMessage({ type: "OPEN_SIDEBAR" }, "*");
  }
};

document.body.appendChild(iframe);
console.log("Iframe element:", iframe);
console.log("Body contains iframe?", document.body.contains(iframe));
const resizeHandle = document.createElement("div");

resizeHandle.style.position = "fixed";
resizeHandle.style.top = "0";
resizeHandle.style.right = sidebarWidth + "px";
resizeHandle.style.width = "6px";
resizeHandle.style.height = "100vh";
resizeHandle.style.cursor = "col-resize";
resizeHandle.style.background = "#ddd";
resizeHandle.style.zIndex = "1000000";
resizeHandle.style.display = "none";

document.body.appendChild(resizeHandle);
initChatGPTToggleButton();

console.log(
  "iframe added",
  iframe.src
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  console.log("========== CONTENT SCRIPT ==========");
  console.log("Received message:", message);

  if (message.action !== "CREATE_THREAD") {
    return;
  }

  console.log("Opening sidebar...");

  openSidebar();

  console.log("Iframe display:", iframe.style.display);

  const chatTitle = document.title;
  const conversation = extractConversation();

  chrome.storage.local.set(
    {
      selectedText: message.text,
      sourceUrl: window.location.href,
      chatTitle,
      conversation,
    },
    () => {
      console.log("Storage saved");
    }
  );

  console.log("Stored:", message.text);

  sendResponse({ success: true });
});
window.addEventListener("message", (event) => {

  if (event.data && event.data.type === "CLOSE_SIDEBAR") {
    closeSidebar();
  }

});
let isResizing = false;

resizeHandle.addEventListener("mousedown", (e) => {
  isResizing = true;
  iframe.style.pointerEvents = "none";
  document.body.style.userSelect = "none";
  e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
  if (!isResizing) return;

  const width = window.innerWidth - e.clientX;

  sidebarWidth = width;

  iframe.style.width = sidebarWidth + "px";
  resizeHandle.style.right = sidebarWidth + "px";

  localStorage.setItem(
    "ai-sidebar-width",
    sidebarWidth
  );
});

document.addEventListener("mouseup", () => {
  if (!isResizing) return;

  isResizing = false;
  iframe.style.pointerEvents = "auto";
  document.body.style.userSelect = "";
});