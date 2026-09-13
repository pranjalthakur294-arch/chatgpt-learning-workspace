// src/components/ThreadView.tsx

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import type { Message } from "../types/thread";

interface ThreadViewProps {
  title: string;
  context: string;
  sourceUrl?: string;
  messages: Message[];
  isTyping: boolean;
}

function ThreadView({
  title,
  context,
  sourceUrl,
  messages,
  isTyping,
}: ThreadViewProps) {
  const [showContext, setShowContext] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowContext(false);
  }, [title, context]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  return (
    <div className="thread-view">
      <h2>{title}</h2>

      {(context || sourceUrl) && (
        <div className="thread-context-container">
          <button
            type="button"
            className="context-toggle-btn"
            onClick={() => setShowContext(!showContext)}
          >
            <span>{showContext ? "▾" : "▸"}</span>
            <span>View source context</span>
          </button>

          {showContext && (
            <div className="context-panel">
              {sourceUrl && (
                <div className="context-source-link">
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    🔗 Open Original Chat
                  </a>
                </div>
              )}
              {context && (
                <pre className="context-content">{context.trim()}</pre>
              )}
            </div>
          )}
        </div>
      )}

      {messages.map((msg, index) => (
        <div
          key={index}
          className={
            msg.sender === "AI"
              ? msg.type === "explanation"
                ? "message ai-message explanation-message"
                : "message ai-message"
              : "message user-message"
          }
        >
          <div>
  <strong>
    {msg.type === "explanation" ? "💡 AI Explanation: " : `${msg.sender}: `}
  </strong>

  {msg.sender === "AI" ? (
    <ReactMarkdown>
      {msg.text}
    </ReactMarkdown>
  ) : (
    msg.text
  )}
</div>

<small className="message-time">
  {new Date(
    msg.timestamp
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}
</small>
        </div>
      ))}

      {isTyping && (
        <div className="typing-indicator">
          AI is typing...
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default ThreadView;