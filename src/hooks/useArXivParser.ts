import { useState } from "react";
import { ArXivParser, ParsedArXivData } from "../services/arxivParser";
import { ArXivPaper } from "../types/project";

export const useArXivParser = (userId: string | undefined) => {
  const [parsing, setParsing] = useState(false);
  const [parsedPaper, setParsedPaper] = useState<ArXivPaper | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const parseArXivUrl = async (url: string): Promise<ParsedArXivData> => {
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    setParsing(true);
    setParseError(null);
    setParsedPaper(null);

    try {
      const result = await ArXivParser.parseFromUrl(url, userId);

      if (result.success && result.paper) {
        setParsedPaper(result.paper);
      } else {
        setParseError(result.error || "Unknown error");
      }

      return result;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to parse ArXiv paper";
      setParseError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setParsing(false);
    }
  };

  const parseCurrentPage = async (): Promise<ParsedArXivData> => {
    return new Promise((resolve) => {
      // Get current tab URL
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const currentTab = tabs[0];
        if (!currentTab.url) {
          resolve({ success: false, error: "No active tab found" });
          return;
        }

        if (!ArXivParser.isArXivUrl(currentTab.url)) {
          resolve({
            success: false,
            error: "Current page is not an ArXiv paper",
          });
          return;
        }

        const result = await parseArXivUrl(currentTab.url);
        resolve(result);
      });
    });
  };

  const clearParsedPaper = () => {
    setParsedPaper(null);
    setParseError(null);
  };

  return {
    parsing,
    parsedPaper,
    parseError,
    parseArXivUrl,
    parseCurrentPage,
    clearParsedPaper,
  };
};
