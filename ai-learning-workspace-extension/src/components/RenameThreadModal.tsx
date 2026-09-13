import { useState } from "react";

interface RenameThreadModalProps {
  currentTitle: string;
  onRename: (newTitle: string) => void;
  onClose: () => void;
}

function RenameThreadModal({
  currentTitle,
  onRename,
  onClose,
}: RenameThreadModalProps) {
  const [title, setTitle] =
    useState(currentTitle);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Rename Thread</h2>

        <input
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <div className="modal-actions">
          <button onClick={onClose}>
            Cancel
          </button>

          <button
            onClick={() => {
              if (!title.trim()) return;

              onRename(title);
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default RenameThreadModal;