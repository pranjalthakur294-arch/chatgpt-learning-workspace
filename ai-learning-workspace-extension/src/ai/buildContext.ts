import type { Message } from "../types/thread";

export function buildContext(
  context: string,
  messages: Message[]
) {
  return `
Thread Context:
${context}

Conversation:
${messages
  .map(
    (msg) =>
      `${msg.sender}: ${msg.text}`
  )
  .join("\n")}
`;
}