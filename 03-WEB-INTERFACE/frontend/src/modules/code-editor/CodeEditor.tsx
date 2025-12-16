import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { useIDE } from '@/core/state/useIDE';
import EditorErrors from './EditorErrors';

interface CodeEditorProps {
  filePath: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ filePath }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { editorTheme, fontSize, wordWrap } = useIDE();
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const language = getLanguageFromPath(filePath);

    // Initialize Monaco Editor
    const editorInstance = monaco.editor.create(editorRef.current, {
      value: `// ${filePath}\n// ابدأ بالكتابة هنا...\n`,
      language,
      theme: editorTheme,
      fontSize: fontSize,
      wordWrap: wordWrap ? 'on' : 'off',
      minimap: { enabled: true },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      renderWhitespace: 'selection',
      lineNumbers: 'on',
      folding: true,
      bracketPairColorization: { enabled: true },
      // Enable error detection
      quickSuggestions: true,
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: 'on',
      tabCompletion: 'on',
      wordBasedSuggestions: 'allDocuments',
    });

    monacoEditorRef.current = editorInstance;
    setEditor(editorInstance);

    // Configure TypeScript/JavaScript diagnostics
    if (language === 'typescript' || language === 'javascript') {
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
        noSuggestionDiagnostics: false,
      });
    }

    return () => {
      editorInstance.dispose();
    };
  }, [filePath, editorTheme, fontSize, wordWrap]);

  useEffect(() => {
    if (monacoEditorRef.current) {
      monacoEditorRef.current.updateOptions({
        theme: editorTheme,
        fontSize: fontSize,
        wordWrap: wordWrap ? 'on' : 'off',
      });
    }
  }, [editorTheme, fontSize, wordWrap]);

  return (
    <div className="h-full flex flex-col">
      <div ref={editorRef} className="flex-1 w-full" />
      {editor && <EditorErrors editor={editor} filePath={filePath} />}
    </div>
  );
};

function getLanguageFromPath(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    py: 'python',
    html: 'html',
    css: 'css',
    scss: 'scss',
    json: 'json',
    md: 'markdown',
    yml: 'yaml',
    yaml: 'yaml',
  };
  return languageMap[ext || ''] || 'plaintext';
}

export default CodeEditor;

