// src/components/ThreadView.tsx

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
type Message = {
  sender: string;
  text: string;
  timestamp: string;
};

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
}: ThreadViewProps){const messagesEndRef =
  useRef<HTMLDivElement>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages, isTyping]);
  <div ref={messagesEndRef} />

  return (
    <div className="thread-view">
      <h2>{title}</h2>

      <p className="thread-context">
        {context}
      </p>
      {sourceUrl && (
  <a
    href={sourceUrl}
    target="_blank"
    rel="noreferrer"
  >
    🔗 Open Original Chat
  </a>
)}  

      {messages.map((msg, index) => (
        <div
          key={index}
          className={
            msg.sender === "AI"
              ? "message ai-message"
              : "message user-message"
          }
        >
          <div>
  <strong>{msg.sender}: </strong>

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