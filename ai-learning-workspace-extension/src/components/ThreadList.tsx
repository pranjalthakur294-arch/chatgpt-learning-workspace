// src/components/ThreadList.tsx
import type { Thread } from "../types/thread";

interface ThreadListProps {
  onRenameThread: (
  threadId: number
) => void;
  threads: Thread[];
  selectedThreadId: number | null;
  onSelectThread: (id: number) => void;
  onDeleteThread: (id: number) => void;
}
function ThreadList({
  threads,
  selectedThreadId,
  onSelectThread,
  onDeleteThread,
  onRenameThread,
}: ThreadListProps){
  return (
    <div className="thread-list">
      <h2>Threads</h2>

     {threads.length === 0 ? (
  <div className="empty-state">
    <p>No threads yet</p>
    <span>Create your first thread.</span>
  </div>
) : (
  threads.map((thread) => (
    <div
      key={thread.id}
      className={
        selectedThreadId === thread.id
          ? "thread-item active"
          : "thread-item"
      }
      onClick={() => onSelectThread(thread.id)}
    >
      <div className="thread-header">
  <div className="thread-title">
    {thread.title}
  </div>

  <div>
    <button
      className="rename-btn"
      onClick={(e) => {
        e.stopPropagation();
        onRenameThread(thread.id);
      }}
    >
      ✏️
    </button>

    <button
      className="delete-btn"
      onClick={(e) => {
        e.stopPropagation();
        onDeleteThread(thread.id);
      }}
    >
      🗑️
    </button>
  </div>
</div>

      <div className="thread-meta">
        {thread.messages.length} message
        {thread.messages.length !== 1 ? "s" : ""}
      </div>
    </div>
  ))
)}
    </div>
  );
}

export default ThreadList;