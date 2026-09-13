chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id: "createThread",
    title: "Create Doubt Thread",
    contexts: ["selection"],
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "createThread",
      title: "Create Doubt Thread",
      contexts: ["selection"],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "createThread") return;

  console.log("========== BACKGROUND ==========");
  console.log("Selected Text:", info.selectionText);
  console.log("Tab ID:", tab.id);

  chrome.tabs.sendMessage(
    tab.id,
    {
      action: "CREATE_THREAD",
      text: info.selectionText,
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error(
          "SEND ERROR:",
          chrome.runtime.lastError.message
        );
      } else {
        console.log("MESSAGE SENT SUCCESSFULLY");
        console.log("Response:", response);
      }
    }
  );
});