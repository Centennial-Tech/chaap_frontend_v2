// Shared download service for document generation and downloads
import { markdownToHtml, stripMarkdown } from './markdownUtils';

export interface DownloadOptions {
  format: "pdf" | "doc" | "txt";
  content: string;
  filename?: string;
  reportType?: "adverse" | "capa" | "meeting" | "document";
  title?: string;
}

export interface ReportData {
  generated_report?: string;
  predicted_report?: string;
  [key: string]: any;
}

/**
 * Shared download service for all document types
 */
export class DownloadService {
  /**
   * Main download function that handles all document formats
   */
  static async downloadDocument(options: DownloadOptions): Promise<void> {
    const { format, content, filename, reportType = "document", title } = options;

    if (!content) {
      throw new Error("No content provided for download");
    }

    let blob: Blob;
    let finalFilename = filename || this.generateFilename(reportType, format);

    if (format === "pdf") {
      await this.generateStyledPDF(content, finalFilename, reportType, title);
      return;
    } else if (format === "doc") {
      const htmlContent = markdownToHtml(content);
      const docContent = this.generateDocContent(htmlContent, title || this.getDefaultTitle(reportType));
      blob = new Blob([docContent], { type: "application/msword" });
    } else {
      // For TXT format, strip all markdown formatting
      const plainText = stripMarkdown(content);
      blob = new Blob([plainText], { type: "text/plain" });
    }

    this.downloadBlob(blob, finalFilename);
  }

  /**
   * Generate styled PDF with proper formatting
   */
  static async generateStyledPDF(
    content: string, 
    filename: string, 
    reportType: string = "document",
    title?: string
  ): Promise<void> {
    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // PDF styling constants
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const lineHeight = 6;
      const maxLineWidth = pageWidth - margin * 2;

      let yPosition = margin;

      // Add header
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "bold");
      const documentTitle = title || this.getDefaultTitle(reportType);
      doc.text(documentTitle, margin, yPosition);
      yPosition += 15;

      // Add a line separator
      doc.setLineWidth(0.5);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Helper function to render text with inline formatting
      const renderFormattedText = (text: string, x: number, y: number, fontSize: number = 12, color: [number, number, number] = [60, 60, 60]) => {
        doc.setFontSize(fontSize);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.setFont("helvetica", "normal");
        
        // Use the shared stripMarkdown function for consistent markdown removal
        const cleanText = stripMarkdown(text);
        
        // Render the cleaned text
        const textWidth = doc.getTextWidth(cleanText);
        doc.text(cleanText, x, y);
        
        return textWidth; // Return the width used
      };

      // Helper function to render multi-line formatted text
      const renderMultiLineFormattedText = (text: string, x: number, startY: number, fontSize: number = 12, color: [number, number, number] = [60, 60, 60]) => {
        doc.setFontSize(fontSize);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.setFont("helvetica", "normal");
        
        // Use the shared stripMarkdown function for consistent markdown removal
        const cleanText = stripMarkdown(text);
        
        let currentY = startY;
        const words = cleanText.split(' ');
        let currentLine = '';
        
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const testWidth = doc.getTextWidth(testLine);
          
          if (testWidth <= maxLineWidth) {
            currentLine = testLine;
          } else {
            // Render current line if it has content
            if (currentLine) {
              doc.text(currentLine, x, currentY);
              currentY += lineHeight;
            }
            currentLine = word;
          }
        }
        
        // Render remaining text
        if (currentLine) {
          doc.text(currentLine, x, currentY);
          currentY += lineHeight;
        }
        
        return currentY; // Return the final Y position
      };

      // Parse markdown-like content
      const lines = content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Check if we need a new page (leave more space for footer)
        if (yPosition > pageHeight - margin - 20) {
          doc.addPage();
          yPosition = margin;
        }

        if (!line) {
          yPosition += lineHeight / 2; // Small space for empty lines
          continue;
        }

        // Handle headers
        if (line.startsWith("# ")) {
          const headerText = stripMarkdown(line.substring(2));
          doc.setFontSize(18);
          doc.setTextColor(50, 50, 50);
          doc.setFont("helvetica", "bold");
          const wrappedHeader = doc.splitTextToSize(headerText, maxLineWidth);
          doc.text(wrappedHeader, margin, yPosition);
          yPosition += wrappedHeader.length * lineHeight + 5;
        } else if (line.startsWith("## ")) {
          const headerText = stripMarkdown(line.substring(3));
          doc.setFontSize(16);
          doc.setTextColor(60, 60, 60);
          doc.setFont("helvetica", "bold");
          const wrappedHeader = doc.splitTextToSize(headerText, maxLineWidth);
          doc.text(wrappedHeader, margin, yPosition);
          yPosition += wrappedHeader.length * lineHeight + 4;
        } else if (line.startsWith("### ")) {
          const headerText = stripMarkdown(line.substring(4));
          doc.setFontSize(14);
          doc.setTextColor(70, 70, 70);
          doc.setFont("helvetica", "bold");
          const wrappedHeader = doc.splitTextToSize(headerText, maxLineWidth);
          doc.text(wrappedHeader, margin, yPosition);
          yPosition += wrappedHeader.length * lineHeight + 3;
        } else if (line.startsWith("#### ")) {
          const headerText = stripMarkdown(line.substring(5));
          doc.setFontSize(13);
          doc.setTextColor(80, 80, 80);
          doc.setFont("helvetica", "bold");
          const wrappedHeader = doc.splitTextToSize(headerText, maxLineWidth);
          doc.text(wrappedHeader, margin, yPosition);
          yPosition += wrappedHeader.length * lineHeight + 2;
        }
        // Handle bullet points
        else if (line.startsWith("- ") || line.startsWith("* ")) {
          const bulletText = stripMarkdown(line.substring(2));
          doc.setFontSize(12);
          doc.setTextColor(80, 80, 80);
          doc.setFont("helvetica", "normal");
          
          // Add bullet point
          doc.text("• ", margin + 5, yPosition);
          
          // Simple text wrapping for cleaned text
          const wrappedBullet = doc.splitTextToSize(bulletText, maxLineWidth - 10);
          doc.text(wrappedBullet, margin + 10, yPosition);
          yPosition += wrappedBullet.length * lineHeight + 2;
        }
        // Handle numbered lists
        else if (line.match(/^\d+\. /)) {
          const match = line.match(/^(\d+\. )(.*)/);
          if (match) {
            const listNumber = match[1];
            const listText = stripMarkdown(match[2]);
            
            doc.setFontSize(12);
            doc.setTextColor(80, 80, 80);
            doc.setFont("helvetica", "normal");
            
            // Add list number
            doc.text(listNumber, margin + 5, yPosition);
            const numberWidth = doc.getTextWidth(listNumber);
            
            // Simple text wrapping for cleaned text
            const wrappedText = doc.splitTextToSize(listText, maxLineWidth - 5 - numberWidth);
            doc.text(wrappedText, margin + 5 + numberWidth, yPosition);
            yPosition += wrappedText.length * lineHeight + 2;
          }
        }
        // Handle code blocks
        else if (line.startsWith("```")) {
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.setFont("courier", "normal");

          // Find the end of code block
          let codeContent = "";
          let j = i + 1;
          while (j < lines.length && !lines[j].startsWith("```")) {
            codeContent += lines[j] + "\n";
            j++;
          }

          // Draw code block background
          const codeHeight = (codeContent.split("\n").length - 1) * lineHeight + 8;
          doc.setFillColor(245, 245, 245);
          doc.rect(margin, yPosition - 3, maxLineWidth, codeHeight, "F");

          const wrappedCode = doc.splitTextToSize(codeContent.trim(), maxLineWidth - 10);
          doc.text(wrappedCode, margin + 5, yPosition + 2);
          yPosition += wrappedCode.length * lineHeight + 10;

          i = j; // Skip processed lines
        }
        // Regular text with potential formatting
        else {
          doc.setFontSize(12);
          doc.setTextColor(60, 60, 60);
          doc.setFont("helvetica", "normal");
          
          // Use the shared stripMarkdown function for consistent markdown removal
          const cleanText = stripMarkdown(line);
          
          // Simple text wrapping for cleaned text
          const wrappedText = doc.splitTextToSize(cleanText, maxLineWidth);
          doc.text(wrappedText, margin, yPosition);
          yPosition += wrappedText.length * lineHeight + 3;
        }
      }

      // Add footer with page numbers
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - margin - 20,
          pageHeight - 15
        );

        // Add timestamp
        const timestamp = new Date().toLocaleDateString();
        doc.text(`Generated on ${timestamp}`, margin, pageHeight - 15);
      }

      doc.save(`${filename}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Failed to generate PDF document");
    }
  }

  /**
   * Generate Word document content
   */
  private static generateDocContent(htmlContent: string, title: string): string {
    return `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${title}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 12pt; line-height: 1.5; color: #333; margin: 0.25in; }
          h1, h2, h3, h4 { margin-top: 16px; margin-bottom: 8px; }
          h1 { margin-top: 12px; }
          ul, ol { margin: 8px 0; padding-left: 20px; }
          li { margin: 3px 0; }
          p { margin: 6px 0; }
          code { background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: 'Courier New', monospace; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;
  }

  /**
   * Generate filename based on report type and format
   */
  private static generateFilename(reportType: string, format: string): string {
    const date = new Date().toISOString().split("T")[0];
    const baseName = this.getDefaultTitle(reportType).replace(/\s+/g, '_');
    return `${baseName}_${date}.${format}`;
  }

  /**
   * Get default title based on report type
   */
  private static getDefaultTitle(reportType: string): string {
    switch (reportType) {
      case "adverse":
        return "Adverse Event Report";
      case "capa":
        return "CAPA Report";
      case "meeting":
        return "FDA Meeting Document";
      default:
        return "Document";
    }
  }

  /**
   * Download blob to file
   */
  private static downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }


}