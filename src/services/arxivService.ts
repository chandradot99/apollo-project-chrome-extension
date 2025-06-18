// src/services/arxivService.ts
import { ArXivPaper } from "../types/project";
import { Timestamp } from "firebase/firestore";

export interface ParsedArXivData {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  subjects: string[];
  submittedDate: string;
  updatedDate?: string;
  pdfUrl: string;
  arxivUrl: string;
  doi?: string;
  categories: string[];
  comments?: string;
}

export const parseArXivPage = async (url: string): Promise<ParsedArXivData> => {
  // Extract ArXiv ID from URL
  const arxivIdMatch = url.match(/arxiv\.org\/abs\/(\d+\.\d+)/);
  if (!arxivIdMatch) {
    throw new Error("Invalid ArXiv URL format");
  }

  const arxivId = arxivIdMatch[1];

  try {
    // Use background script to fetch ArXiv page to bypass CORS
    const response = await chrome.runtime.sendMessage({
      type: "FETCH_ARXIV_PAGE",
      url: url,
    });

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch ArXiv page");
    }

    const html = response.data;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Parse title
    const titleElement = doc.querySelector(".title");
    const title = titleElement?.textContent?.replace("Title:", "").trim() || "";

    // Parse authors
    const authorsElement = doc.querySelector(".authors");
    const authorLinks = authorsElement?.querySelectorAll("a");
    const authors: string[] = [];
    authorLinks?.forEach((link) => {
      const authorName = link.textContent?.trim();
      if (authorName) {
        authors.push(authorName);
      }
    });

    // Parse abstract
    const abstractElement = doc.querySelector(".abstract");
    const abstract =
      abstractElement?.textContent?.replace("Abstract:", "").trim() || "";

    // Parse subjects/categories
    const subjectsElement = doc.querySelector(".subjects");
    const subjectsText =
      subjectsElement?.textContent?.replace("Subjects:", "").trim() || "";
    const subjects = subjectsText
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);

    // Parse submission date
    const submissionElement = doc.querySelector(".submission-history");
    const submissionText = submissionElement?.textContent || "";
    const dateMatch = submissionText.match(/\[v1\]\s+(.+?)\s+\(/);
    const submittedDate = dateMatch ? dateMatch[1].trim() : "";

    // Parse updated date if available
    const updatedMatch = submissionText.match(/\[v\d+\]\s+(.+?)\s+\(/g);
    const updatedDate =
      updatedMatch && updatedMatch.length > 1
        ? updatedMatch[updatedMatch.length - 1]
            .match(/\[v\d+\]\s+(.+?)\s+\(/)?.[1]
            .trim()
        : undefined;

    // Parse DOI if available
    const doiElement = doc.querySelector(".doi a");
    const doi =
      doiElement?.getAttribute("href")?.replace("https://doi.org/", "") ||
      undefined;

    // Parse comments if available
    const commentsElement = doc.querySelector(".comments");
    const comments =
      commentsElement?.textContent?.replace("Comments:", "").trim() ||
      undefined;

    // Generate URLs
    const pdfUrl = `https://arxiv.org/pdf/${arxivId}.pdf`;
    const arxivUrl = url;

    // Extract main categories
    const categories =
      subjects.length > 0 ? [subjects[0].split("(")[0].trim()] : [];

    return {
      id: arxivId,
      title,
      authors,
      abstract,
      subjects,
      submittedDate,
      updatedDate,
      pdfUrl,
      arxivUrl,
      doi,
      categories,
      comments,
    };
  } catch (error) {
    console.error("Error parsing ArXiv page:", error);
    throw new Error(
      `Failed to parse ArXiv paper: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const convertToArXivPaper = (
  parsedData: ParsedArXivData,
  addedBy: string
): ArXivPaper => {
  return {
    id: parsedData.id,
    title: parsedData.title,
    authors: parsedData.authors,
    abstract: parsedData.abstract,
    subjects: parsedData.subjects,
    submittedDate: parsedData.submittedDate,
    updatedDate: parsedData.updatedDate,
    pdfUrl: parsedData.pdfUrl,
    arxivUrl: parsedData.arxivUrl,
    doi: parsedData.doi,
    categories: parsedData.categories,
    comments: parsedData.comments,
    addedAt: Timestamp.now(),
    addedBy,
  };
};
