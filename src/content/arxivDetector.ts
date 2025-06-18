// Content script to detect ArXiv pages and communicate with extension

interface ArXivPageData {
  isArXivPage: boolean;
  arxivId?: string;
  url: string;
  title?: string;
}

class ArXivDetector {
  private static ARXIV_URL_PATTERN = /arxiv\.org\/abs\/([0-9]{4}\.[0-9]{4,5})/;

  static detectCurrentPage(): ArXivPageData {
    const url = window.location.href;
    const isArXivPage = this.ARXIV_URL_PATTERN.test(url);

    if (!isArXivPage) {
      return { isArXivPage: false, url };
    }

    const arxivId = url.match(this.ARXIV_URL_PATTERN)?.[1];
    const title = document
      .querySelector("h1.title")
      ?.textContent?.replace("Title:", "")
      .trim();

    return {
      isArXivPage: true,
      url,
      arxivId,
      title,
    };
  }

  static init() {
    // Send page info to extension when content script loads
    const pageData = this.detectCurrentPage();

    chrome.runtime.sendMessage({
      type: "ARXIV_PAGE_DETECTED",
      data: pageData,
    });

    // Listen for requests from extension
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "GET_ARXIV_PAGE_DATA") {
        sendResponse(this.detectCurrentPage());
      }
    });
  }
}

// Initialize when content script loads
ArXivDetector.init();
