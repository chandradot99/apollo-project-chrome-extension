import { ArXivPaper } from "../types/project";
import { Timestamp } from "firebase/firestore";

export interface ParsedArXivData {
  success: boolean;
  paper?: ArXivPaper;
  error?: string;
}

export class ArXivParser {
  private static ARXIV_URL_PATTERN = /arxiv\.org\/abs\/([0-9]{4}\.[0-9]{4,5})/;
  private static ARXIV_API_BASE = "https://export.arxiv.org/api/query?id_list=";

  static isArXivUrl(url: string): boolean {
    return this.ARXIV_URL_PATTERN.test(url);
  }

  static extractArXivId(url: string): string | null {
    const match = url.match(this.ARXIV_URL_PATTERN);
    return match ? match[1] : null;
  }

  static async parseFromUrl(
    url: string,
    userId: string
  ): Promise<ParsedArXivData> {
    try {
      const arxivId = this.extractArXivId(url);
      if (!arxivId) {
        return { success: false, error: "Invalid ArXiv URL" };
      }

      return await this.parseFromId(arxivId, userId);
    } catch (error) {
      console.error("Error parsing ArXiv URL:", error);
      return { success: false, error: "Failed to parse ArXiv paper" };
    }
  }

  static async parseFromId(
    arxivId: string,
    userId: string
  ): Promise<ParsedArXivData> {
    try {
      // Fetch from ArXiv API
      const apiUrl = `${this.ARXIV_API_BASE}${arxivId}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`ArXiv API error: ${response.status}`);
      }

      const xmlText = await response.text();
      const paper = this.parseXMLResponse(xmlText, arxivId, userId);

      if (!paper) {
        return { success: false, error: "Paper not found or parsing failed" };
      }

      return { success: true, paper };
    } catch (error) {
      console.error("Error fetching from ArXiv API:", error);
      return { success: false, error: "Failed to fetch paper data" };
    }
  }

  private static parseXMLResponse(
    xmlText: string,
    arxivId: string,
    userId: string
  ): ArXivPaper | null {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");

      const entry = xmlDoc.querySelector("entry");
      if (!entry) return null;

      // Extract basic info
      const title = entry.querySelector("title")?.textContent?.trim() || "";
      const abstract =
        entry.querySelector("summary")?.textContent?.trim() || "";
      const published =
        entry.querySelector("published")?.textContent?.trim() || "";
      const updated = entry.querySelector("updated")?.textContent?.trim();

      // Extract authors
      const authorElements = entry.querySelectorAll("author name");
      const authors = Array.from(authorElements).map(
        (el) => el.textContent?.trim() || ""
      );

      // Extract categories
      const categoryElements = entry.querySelectorAll("category");
      const categories = Array.from(categoryElements).map(
        (el) => el.getAttribute("term") || ""
      );
      const subjects = Array.from(categoryElements).map(
        (el) => el.getAttribute("scheme") || ""
      );

      // Extract DOI if available
      const doiElement = entry.querySelector("arxiv\\:doi, doi");
      const doi = doiElement?.textContent?.trim();

      // Extract comments if available
      const commentElement = entry.querySelector("arxiv\\:comment, comment");
      const comments = commentElement?.textContent?.trim();

      // Generate URLs
      const pdfUrl = `https://arxiv.org/pdf/${arxivId}.pdf`;
      const arxivUrl = `https://arxiv.org/abs/${arxivId}`;

      const paper: ArXivPaper = {
        id: arxivId,
        title: title.replace(/\s+/g, " "), // Clean up whitespace
        authors,
        abstract: abstract.replace(/\s+/g, " "), // Clean up whitespace
        subjects: subjects.filter((s) => s),
        submittedDate: published,
        updatedDate: updated,
        pdfUrl,
        arxivUrl,
        doi,
        categories: categories.filter((c) => c),
        comments,
        addedAt: Timestamp.now(),
        addedBy: userId,
      };

      return paper;
    } catch (error) {
      console.error("Error parsing XML:", error);
      return null;
    }
  }

  // Alternative method: Parse from webpage (fallback)
  static async parseFromWebpage(
    url: string,
    userId: string
  ): Promise<ParsedArXivData> {
    try {
      const response = await fetch(url);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const arxivId = this.extractArXivId(url);
      if (!arxivId) {
        return { success: false, error: "Invalid ArXiv URL" };
      }

      // Extract data from HTML
      const title =
        doc
          .querySelector("h1.title")
          ?.textContent?.replace("Title:", "")
          .trim() || "";
      const authors = Array.from(doc.querySelectorAll(".authors a")).map(
        (a) => a.textContent?.trim() || ""
      );
      const abstract =
        doc
          .querySelector("blockquote.abstract")
          ?.textContent?.replace("Abstract:", "")
          .trim() || "";

      // Extract submission info
      const submissionInfo =
        doc.querySelector(".submission-history")?.textContent || "";
      const submittedMatch = submissionInfo.match(/\[v1\]\s*(.+?)\s*\(/);
      const submittedDate = submittedMatch ? submittedMatch[1].trim() : "";

      // Extract subjects
      const subjectElements = doc.querySelectorAll(
        ".subjects .primary-subject, .subjects .secondary-subject"
      );
      const subjects = Array.from(subjectElements).map(
        (el) => el.textContent?.trim() || ""
      );

      const paper: ArXivPaper = {
        id: arxivId,
        title,
        authors,
        abstract,
        subjects,
        submittedDate,
        pdfUrl: `https://arxiv.org/pdf/${arxivId}.pdf`,
        arxivUrl: url,
        categories: subjects, // Use subjects as categories for now
        addedAt: Timestamp.now(),
        addedBy: userId,
      };

      return { success: true, paper };
    } catch (error) {
      console.error("Error parsing ArXiv webpage:", error);
      return { success: false, error: "Failed to parse ArXiv webpage" };
    }
  }
}
