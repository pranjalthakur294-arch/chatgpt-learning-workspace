import { useState } from "react";

interface CreateThreadModalProps {
  onCreate: (
  title: string,
  context: string
) => void;
  onClose: () => void;
}

function CreateThreadModal({
  onCreate,
  onClose,
}: CreateThreadModalProps) {
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");

  const handleCreate = () => {
    if (!title.trim()) return;

    onCreate(title, context);
    setTitle("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create Thread</h2>

        <input
          type="text"
          placeholder="Thread title..."
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />
        <input
  type="text"
  placeholder="Thread context..."
  value={context}
  onChange={(e) =>
    setContext(e.target.value)
  }
/>

        <div className="modal-actions">
          <button onClick={onClose}>
            Cancel
          </button>

          <button onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateThreadModal;