import { Message } from '../../components/MessageList';

/**
 * تنسيق الرسائل للعرض
 */
export function formatMessageContent(content: string): string {
  // تنظيف المحتوى من HTML غير آمن
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}

/**
 * استخراج الكود من الرسالة
 */
export function extractCodeBlocks(content: string): Array<{ language: string; code: string }> {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks: Array<{ language: string; code: string }> = [];
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
    });
  }

  return blocks;
}

/**
 * استخراج الروابط من الرسالة
 */
export function extractLinks(content: string): Array<{ url: string; text: string }> {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const links: Array<{ url: string; text: string }> = [];
  let match;

  while ((match = urlRegex.exec(content)) !== null) {
    links.push({
      url: match[1],
      text: match[1],
    });
  }

  return links;
}

/**
 * تحويل الرسائل إلى Markdown
 */
export function messagesToMarkdown(messages: Message[]): string {
  return messages
    .map((msg) => {
      const role = msg.role === 'user' ? 'المستخدم' : 'المساعد';
      const timestamp = msg.timestamp.toLocaleString('ar-SA');
      return `## ${role} (${timestamp})\n\n${msg.content}\n\n---\n\n`;
    })
    .join('\n');
}

/**
 * تحويل الرسائل إلى JSON
 */
export function messagesToJSON(messages: Message[]): string {
  return JSON.stringify(
    messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp.toISOString(),
    })),
    null,
    2
  );
}

/**
 * تصدير المحادثة
 */
export function exportChat(messages: Message[], format: 'json' | 'markdown'): void {
  let content: string;
  let filename: string;
  let mimeType: string;

  if (format === 'json') {
    content = messagesToJSON(messages);
    filename = `chat-${Date.now()}.json`;
    mimeType = 'application/json';
  } else {
    content = messagesToMarkdown(messages);
    filename = `chat-${Date.now()}.md`;
    mimeType = 'text/markdown';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

