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

      case "HIGHLIGHT_TEXT":
        highlightElements("p, h1, h2, h3, h4, h5, h6, li, span");
        sendResponse({ success: true });
        break;

      case "REMOVE_HIGHLIGHTS":
        removeHighlights();
        sendResponse({ success: true });
        break;

      case "EXTRACT_LINKS":
        const links = extractAllLinks();
        sendResponse({ success: true, links });
        break;

      case "GET_PAGE_CONTENT":
        const content = getPageContent();
        sendResponse(content);
        break;

      default:
        sendResponse({ success: false, error: "Unknown message type" });
    }
  }
);

// Function to highlight elements on the page
function highlightElements(selector: string): void {
  const elements = document.querySelectorAll(selector);
  let highlightCount = 0;

  elements.forEach((element) => {
    if (
      element instanceof HTMLElement &&
      !element.classList.contains("extension-highlight")
    ) {
      // Only highlight text elements with actual content
      if (element.textContent && element.textContent.trim().length > 0) {
        element.style.backgroundColor = "#fff3cd";
        element.style.border = "1px solid #ffeaa7";
        element.style.borderRadius = "2px";
        element.style.transition = "all 0.3s ease";
        element.classList.add("extension-highlight");
        highlightCount++;
      }
    }
  });

  // Send message to background script to update badge
  chrome.runtime.sendMessage({
    type: "UPDATE_BADGE",
    text: highlightCount > 0 ? highlightCount.toString() : "",
  });

  // Show notification
  showNotification(`Highlighted ${highlightCount} elements`);
}

// Function to remove highlights
function removeHighlights(): void {
  const highlightedElements = document.querySelectorAll(".extension-highlight");
  highlightedElements.forEach((element) => {
    if (element instanceof HTMLElement) {
      element.style.backgroundColor = "";
      element.style.border = "";
      element.style.borderRadius = "";
      element.style.transition = "";
      element.classList.remove("extension-highlight");
    }
  });

  // Clear badge
  chrome.runtime.sendMessage({
    type: "UPDATE_BADGE",
    text: "",
  });

  showNotification(
    `Removed highlights from ${highlightedElements.length} elements`
  );
}

// Function to extract all links from the page
function extractAllLinks(): string[] {
  const links = document.querySelectorAll("a[href]");
  const linkSet = new Set<string>();

  links.forEach((link) => {
    if (link instanceof HTMLAnchorElement) {
      try {
        const url = new URL(link.href, window.location.href);
        // Only include http/https links
        if (url.protocol === "http:" || url.protocol === "https:") {
          linkSet.add(url.href);
        }
      } catch (e) {
        // Invalid URL, skip
      }
    }
  });

  const uniqueLinks = Array.from(linkSet);
  showNotification(`Extracted ${uniqueLinks.length} unique links`);
  return uniqueLinks;
}

// Function to get page content
function getPageContent(): any {
  const content = {
    title: document.title,
    url: window.location.href,
    content: document.body.innerText.substring(0, 5000), // Limit content size
    wordCount: document.body.innerText.split(/\s+/).length,
    linkCount: document.querySelectorAll("a[href]").length,
    imageCount: document.querySelectorAll("img").length,
    headings: Array.from(document.querySelectorAll("h1, h2, h3"))
      .map((h) => h.textContent?.trim())
      .filter(Boolean)
      .slice(0, 10),
    timestamp: Date.now(),
  };

  showNotification(
    `Page saved: ${content.wordCount} words, ${content.linkCount} links`
  );
  return content;
}

// Function to show notifications
function showNotification(message: string): void {
  // Remove existing notification
  const existingNotification = document.querySelector(
    ".extension-notification"
  );
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = "extension-notification";
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    background: #4ade80;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
  `;

  // Add animation styles
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(notification);

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 3000);
}

// Optional: Add a floating button to the page
function addFloatingButton(): void {
  const button = document.createElement("button");
  button.textContent = "🚀";
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
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
    highlightElements("p, h1, h2, h3");
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
