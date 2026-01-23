import React from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import { Loader2 } from 'lucide-react'

interface CodeEditorProps {
  code: string
  language?: string
  onChange?: (value: string | undefined) => void
  readOnly?: boolean
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language = 'python',
  onChange,
  readOnly = false,
}) => {
  const handleEditorDidMount: OnMount = (editor, _monaco) => {
    // Optional: Configure editor settings here
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      fontFamily: "'Fira Code', 'Consolas', monospace",
    })
  }

  return (
    <div className="h-full w-full bg-[#1e1e1e] rounded-lg overflow-hidden border border-border">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={code}
        theme="vs-dark"
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          wordWrap: 'on',
          automaticLayout: true,
        }}
        loading={
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading Editor...</span>
          </div>
        }
      />
    </div>
  )
}
