// Background script for Chrome extension (Popup Mode)
chrome.runtime.onInstalled.addListener((details: any) => {
  console.log("Extension installed (Popup Mode):", details);

  // Initialize storage with default values
  chrome.storage.sync.set({
    count: 0,
    isEnabled: true,
    mode: "popup",
  });
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener(
  (message: any, sender: any, sendResponse: any) => {
    console.log("Background received message:", message);

    switch (message.type) {
      case "GET_TAB_INFO":
        chrome.tabs.query(
          { active: true, currentWindow: true },
          (tabs: any[]) => {
            if (tabs[0]) {
              sendResponse({
                success: true,
                data: {
                  url: tabs[0].url,
                  title: tabs[0].title,
                  id: tabs[0].id,
                },
              });
            } else {
              sendResponse({ success: false, error: "No active tab found" });
            }
          }
        );
        return true; // Keep the message channel open for async response

      case "UPDATE_BADGE":
        chrome.action.setBadgeText({
          text: message.text || "",
          tabId: sender.tab?.id,
        });
        chrome.action.setBadgeBackgroundColor({ color: "#3b82f6" });
        sendResponse({ success: true });
        break;

      default:
        sendResponse({ success: false, error: "Unknown message type" });
    }
  }
);

// Handle tab updates
chrome.tabs.onUpdated.addListener(
  (tabId: number, changeInfo: any, tab: any) => {
    if (changeInfo.status === "complete" && tab.url) {
      console.log("Tab updated:", tab.url);
      // You can add custom logic here when tabs are updated
    }
  }
);

// Export to make this a module
export default {};
