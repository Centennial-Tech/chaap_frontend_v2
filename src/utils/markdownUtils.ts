// Shared markdown utility functions for document processing

/**
 * Converts markdown to HTML with inline styles for Word document generation
 */
export const markdownToHtml = (markdown: string): string => {
  const lines = markdown.split('\n');
  let result = [];
  let currentList = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) {
      // Empty line - close any open list
      if (inList && currentList.length > 0) {
        result.push(`<ul style="margin: 10px 0; padding-left: 20px;">${currentList.join('')}</ul>`);
        currentList = [];
        inList = false;
      }
      result.push('<br>');
      continue;
    }

    // Check for headers
    if (line.startsWith('# ')) {
      if (inList && currentList.length > 0) {
        result.push(`<ul style="margin: 10px 0; padding-left: 20px;">${currentList.join('')}</ul>`);
        currentList = [];
        inList = false;
      }
      const content = line.substring(2)
        .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold; color: #1f2937;">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #4b5563;">$1</em>')
        .replace(/`(.*?)`/g, '<code style="background-color: #f3f4f6; color: #374151; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 14px;">$1</code>');
      result.push(`<h1 style="font-size: 24px; font-weight: bold; color: #1f2937; margin: 20px 0 10px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">${content}</h1>`);
    } else if (line.startsWith('## ')) {
      if (inList && currentList.length > 0) {
        result.push(`<ul style="margin: 10px 0; padding-left: 20px;">${currentList.join('')}</ul>`);
        currentList = [];
        inList = false;
      }
      const content = line.substring(3)
        .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold; color: #1f2937;">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #4b5563;">$1</em>')
        .replace(/`(.*?)`/g, '<code style="background-color: #f3f4f6; color: #374151; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 14px;">$1</code>');
      result.push(`<h2 style="font-size: 20px; font-weight: bold; color: #374151; margin: 16px 0 8px 0;">${content}</h2>`);
    } else if (line.startsWith('### ')) {
      if (inList && currentList.length > 0) {
        result.push(`<ul style="margin: 10px 0; padding-left: 20px;">${currentList.join('')}</ul>`);
        currentList = [];
        inList = false;
      }
      const content = line.substring(4)
        .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold; color: #1f2937;">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #4b5563;">$1</em>')
        .replace(/`(.*?)`/g, '<code style="background-color: #f3f4f6; color: #374151; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 14px;">$1</code>');
      result.push(`<h3 style="font-size: 18px; font-weight: bold; color: #4b5563; margin: 14px 0 7px 0;">${content}</h3>`);
    } else if (line.startsWith('#### ')) {
      if (inList && currentList.length > 0) {
        result.push(`<ul style="margin: 10px 0; padding-left: 20px;">${currentList.join('')}</ul>`);
        currentList = [];
        inList = false;
      }
      const content = line.substring(5)
        .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold; color: #1f2937;">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #4b5563;">$1</em>')
        .replace(/`(.*?)`/g, '<code style="background-color: #f3f4f6; color: #374151; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 14px;">$1</code>');
      result.push(`<h4 style="font-size: 16px; font-weight: bold; color: #6b7280; margin: 12px 0 6px 0;">${content}</h4>`);
    }
    // Check for bullet points
    else if (line.startsWith('- ')) {
      inList = true;
      const content = line.substring(2)
        .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold; color: #1f2937;">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #4b5563;">$1</em>')
        .replace(/`(.*?)`/g, '<code style="background-color: #f3f4f6; color: #374151; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 14px;">$1</code>');
      currentList.push(`<li style="margin: 4px 0; color: #4b5563;">${content}</li>`);
    }
    // Check for numbered lists
    else if (line.match(/^\d+\. /)) {
      inList = true;
      const match = line.match(/^(\d+)\. (.*)/);
      if (match) {
        const number = match[1];
        const content = match[2]
          .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold; color: #1f2937;">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #4b5563;">$1</em>')
          .replace(/`(.*?)`/g, '<code style="background-color: #f3f4f6; color: #374151; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 14px;">$1</code>');
        currentList.push(`<li style="margin: 4px 0; color: #4b5563;">${number}. ${content}</li>`);
      }
    }
    // Regular text
    else {
      if (inList && currentList.length > 0) {
        result.push(`<ul style="margin: 10px 0; padding-left: 20px;">${currentList.join('')}</ul>`);
        currentList = [];
        inList = false;
      }
      const content = line
        .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold; color: #1f2937;">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #4b5563;">$1</em>')
        .replace(/`(.*?)`/g, '<code style="background-color: #f3f4f6; color: #374151; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 14px;">$1</code>');
      result.push(`<p style="margin: 8px 0; line-height: 1.6; color: #374151;">${content}</p>`);
    }
  }

  // Close any remaining list
  if (inList && currentList.length > 0) {
    result.push(`<ul style="margin: 10px 0; padding-left: 20px;">${currentList.join('')}</ul>`);
  }

  return result.join('');
};

/**
 * Strips all markdown formatting from text for plain text downloads
 */
export const stripMarkdown = (markdown: string): string => {
  return markdown
    // Remove headers (keep the text)
    .replace(/^#{1,4}\s+(.*$)/gim, '$1\n')
    // Remove bold and italic markers
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // Remove inline code markers
    .replace(/`(.*?)`/g, '$1')
    // Convert bullet points to simple dashes
    .replace(/^- (.*$)/gim, '- $1')
    // Keep numbered lists as is
    .replace(/^(\d+)\. (.*$)/gim, '$1. $2')
    // Remove extra whitespace and normalize line breaks
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}; 