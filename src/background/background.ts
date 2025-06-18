// src/background/background.ts
chrome.runtime.onInstalled.addListener((details: any) => {
  console.log("Extension installed (Side Panel Mode):", details);

  // Initialize storage with default values
  chrome.storage.sync.set({
    count: 0,
    isEnabled: true,
    mode: "sidepanel",
  });

  // Enable side panel for all sites
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

// Handle extension icon click to open side panel
chrome.action.onClicked.addListener(async (tab: any) => {
  // Open the side panel for the current tab
  await chrome.sidePanel.open({ tabId: tab.id });
});

// Handle messages from content script or side panel
chrome.runtime.onMessage.addListener(
  (message: any, sender: any, sendResponse: any) => {
    console.log("Background received message:", message);

    switch (message.type) {
      case "GET_TAB_INFO":
        // For side panel, try multiple approaches to get tab info
        console.log("Getting tab info for side panel...");

        // Method 1: Query with tabs permission
        chrome.tabs.query(
          { active: true, currentWindow: true },
          (tabs: any[]) => {
            console.log("Method 1 - currentWindow tabs:", tabs);

            if (tabs && tabs.length > 0 && tabs[0] && tabs[0].url) {
              sendResponse({
                success: true,
                data: {
                  url: tabs[0].url,
                  title: tabs[0].title,
                  id: tabs[0].id,
                },
              });
            } else {
              // Method 2: Try lastFocusedWindow
              chrome.tabs.query(
                { active: true, lastFocusedWindow: true },
                (tabs2: any[]) => {
                  console.log("Method 2 - lastFocusedWindow tabs:", tabs2);

                  if (tabs2 && tabs2.length > 0 && tabs2[0] && tabs2[0].url) {
                    sendResponse({
                      success: true,
                      data: {
                        url: tabs2[0].url,
                        title: tabs2[0].title,
                        id: tabs2[0].id,
                      },
                    });
                  } else {
                    // Method 3: Try without window restriction
                    chrome.tabs.query({ active: true }, (tabs3: any[]) => {
                      console.log("Method 3 - all active tabs:", tabs3);

                      if (tabs3 && tabs3.length > 0 && tabs3[0]) {
                        sendResponse({
                          success: true,
                          data: {
                            url: tabs3[0].url || "Permission required",
                            title: tabs3[0].title || "Permission required",
                            id: tabs3[0].id,
                          },
                        });
                      } else {
                        sendResponse({
                          success: false,
                          error: "No tabs found",
                          data: {
                            url: "No active tab found",
                            title: "Please refresh extension",
                            id: null,
                          },
                        });
                      }
                    });
                  }
                }
              );
            }
          }
        );

        return true; // Keep the message channel open for async response

      case "FETCH_ARXIV_PAGE":
        // Handle ArXiv page fetching to bypass CORS issues
        const { url } = message;

        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `HTTP ${response.status}: ${response.statusText}`
              );
            }
            return response.text();
          })
          .then((html) => {
            sendResponse({
              success: true,
              data: html,
            });
          })
          .catch((error) => {
            console.error("Error fetching ArXiv page:", error);
            sendResponse({
              success: false,
              error: error.message,
            });
          });

        return true; // Keep the message channel open for async response

      case "UPDATE_BADGE":
        chrome.action.setBadgeText({
          text: message.text || "",
          tabId: sender.tab?.id,
        });
        chrome.action.setBadgeBackgroundColor({ color: "#3b82f6" });
        sendResponse({ success: true });
        break;

      case "TOGGLE_SIDE_PANEL":
        if (sender.tab?.id) {
          chrome.sidePanel.setOptions({
            tabId: sender.tab.id,
            enabled: message.enabled,
          });
        }
        sendResponse({ success: true });
        break;

      default:
        sendResponse({ success: false, error: "Unknown message type" });
    }
  }
);

// Handle tab updates - important for side panel to stay in sync
chrome.tabs.onUpdated.addListener(
  (tabId: number, changeInfo: any, tab: any) => {
    if (changeInfo.status === "complete" && tab.url) {
      console.log("Tab updated:", tab.url);
      // Notify side panel about tab change if it's open
      chrome.runtime
        .sendMessage({
          type: "TAB_UPDATED",
          tabInfo: {
            url: tab.url,
            title: tab.title,
            id: tab.id,
          },
        })
        .catch(() => {
          // Side panel might not be open, ignore error
        });
    }
  }
);

// Handle tab activation (when user switches tabs)
chrome.tabs.onActivated.addListener((activeInfo: any) => {
  chrome.tabs.get(activeInfo.tabId, (tab: any) => {
    console.log("Tab activated:", tab);
    // Notify side panel about active tab change
    chrome.runtime
      .sendMessage({
        type: "TAB_ACTIVATED",
        tabInfo: {
          url: tab.url,
          title: tab.title,
          id: tab.id,
        },
      })
      .catch(() => {
        // Side panel might not be open, ignore error
      });
  });
});

// Export to make this a module
export default {};
