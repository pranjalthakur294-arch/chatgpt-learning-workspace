import { saveAs } from "file-saver";

export function exportThread(thread: any) {
  let content = `# ${thread.title}\n\n`;

  content += `Context:\n${thread.context}\n\n`;

  thread.messages.forEach((msg: any) => {
    content += `${msg.sender}:\n`;
    content += `${msg.text}\n\n`;
  });

  const blob = new Blob(
    [content],
    {
      type: "text/markdown;charset=utf-8",
    }
  );

  saveAs(
    blob,
    `${thread.title}.md`
  );
}