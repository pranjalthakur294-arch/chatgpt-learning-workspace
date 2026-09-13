// src/components/ChatInput.tsx

import { useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isTyping: boolean;
}

function ChatInput({
  onSendMessage,
  isTyping,
}: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="chat-input">
      <input
  type="text"
  placeholder="Ask a doubt..."
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  }}
/>
      <button
  onClick={handleSend}
  disabled={isTyping}
>
  Send
</button>
    </div>
  );
}

export default ChatInput;