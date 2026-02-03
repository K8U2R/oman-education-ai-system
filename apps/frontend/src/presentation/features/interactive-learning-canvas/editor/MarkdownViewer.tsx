import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { motion } from 'framer-motion'

interface MarkdownViewerProps {
  content: string
  isStreaming?: boolean
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, isStreaming = false }) => {
  return (
    <div className="prose prose-invert max-w-none p-4 rtl:text-right" dir="auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {

            return !inline ? (
              <div className="bg-muted/50 rounded-lg p-4 my-4 border border-border overflow-x-auto" dir="ltr">
                <code className={className} {...props}>
                  {children}
                </code>
              </div>
            ) : (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary" {...props}>
                {children}
              </code>
            )
          },
          table({ children }: any) {
            return <div className="overflow-x-auto my-4"><table className="min-w-full divide-y divide-border border">{children}</table></div>
          },
          th({ children }: any) {
            return <th className="bg-muted px-4 py-2 text-right font-medium">{children}</th>
          },
          td({ children }: any) {
            return <td className="px-4 py-2 border-t border-border">{children}</td>
          },
          a({ href, children }: any) {
            return <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
          }
        }}
      >
        {content}
      </ReactMarkdown>

      {isStreaming && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-2.5 h-5 bg-primary ml-1 align-middle rounded-sm"
        />
      )}
    </div>
  )
}
