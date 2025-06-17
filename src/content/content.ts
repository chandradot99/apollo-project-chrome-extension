// Content script that runs on web pages
console.log("Chrome extension content script loaded");

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener(
  (message: any, sender: any, sendResponse: any) => {
    console.log("Content script received message:", message);

    switch (message.type) {
      case "GET_PAGE_INFO":
        const pageInfo = {
          title: document.title,
          url: window.location.href,
          domain: window.location.hostname,
          timestamp: Date.now(),
        };
        sendResponse({ success: true, data: pageInfo });
        break;

      case "HIGHLIGHT_ELEMENTS":
        highlightElements(message.selector || "p");
        sendResponse({ success: true });
        break;

      case "REMOVE_HIGHLIGHTS":
        removeHighlights();
        sendResponse({ success: true });
        break;

      default:
        sendResponse({ success: false, error: "Unknown message type" });
    }
  }
);

// Function to highlight elements on the page
function highlightElements(selector: string): void {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element, index) => {
    if (element instanceof HTMLElement) {
      element.style.backgroundColor = "#fef3c7";
      element.style.border = "2px solid #f59e0b";
      element.style.borderRadius = "4px";
      element.classList.add("extension-highlight");
    }
  });

  // Send message to background script to update badge
  chrome.runtime.sendMessage({
    type: "UPDATE_BADGE",
    text: elements.length.toString(),
  });
}

// Function to remove highlights
function removeHighlights(): void {
  const highlightedElements = document.querySelectorAll(".extension-highlight");
  highlightedElements.forEach((element) => {
    if (element instanceof HTMLElement) {
      element.style.backgroundColor = "";
      element.style.border = "";
      element.style.borderRadius = "";
      element.classList.remove("extension-highlight");
    }
  });

  // Clear badge
  chrome.runtime.sendMessage({
    type: "UPDATE_BADGE",
    text: "",
  });
}

// Optional: Add a floating button to the page
function addFloatingButton(): void {
  const button = document.createElement("button");
  button.textContent = "🚀";
  button.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    font-size: 20px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    transition: all 0.3s ease;
  `;

  button.addEventListener("click", () => {
    highlightElements("p");
  });

  button.addEventListener("mouseenter", () => {
    button.style.transform = "scale(1.1)";
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "scale(1)";
  });

  document.body.appendChild(button);
}

// Initialize content script
document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded, content script ready");
  // Uncomment the line below if you want a floating button on every page
  // addFloatingButton();
});

// Export to make this a module
export default {};
