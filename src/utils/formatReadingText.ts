/**
 * Formats reading text for display, handling basic markdown and HTML formatting
 */
export interface FormattedText {
  text: string;
  __html?: string;
}

export const formatReadingText = (text: string): FormattedText => {
  if (!text || typeof text !== 'string') {
    return { text: '' };
  }

  // Clean the text first
  let cleanText = text.trim();
  
  // Check if the text contains HTML-like content or markdown
  const hasHtml = /<[^>]+>/.test(cleanText);
  const hasMarkdown = /\*\*.*?\*\*|\*.*?\*|_.*?_/.test(cleanText);
  
  if (hasHtml || hasMarkdown) {
    // Process markdown-like formatting
    let htmlText = cleanText
      // Bold text: **text** or __text__
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      // Italic text: *text* or _text_
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>')
      // Lists
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      // Wrap in paragraphs if not already wrapped
      .replace(/^(?!<[pu])/gm, '<p>')
      .replace(/(?<!>)$/gm, '</p>')
      // Clean up extra paragraph tags
      .replace(/<p><\/p>/g, '')
      .replace(/<p>(<[uo]l>)/g, '$1')
      .replace(/(<\/[uo]l>)<\/p>/g, '$1');

    return {
      text: cleanText,
      __html: htmlText
    };
  }
  
  // For plain text, just handle line breaks
  return {
    text: cleanText,
    __html: cleanText.replace(/\n/g, '<br/>')
  };
};