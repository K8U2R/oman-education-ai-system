import { useState, useCallback, useRef } from 'react';
import * as monaco from 'monaco-editor';

export function useCodeEditor() {
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const initializeEditor = useCallback(
    (container: HTMLDivElement, options?: monaco.editor.IStandaloneEditorConstructionOptions) => {
      const instance = monaco.editor.create(container, {
        language: 'typescript',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        ...options,
      });

      setEditor(instance);
      return instance;
    },
    []
  );

  const getValue = useCallback(() => {
    return editor?.getValue() || '';
  }, [editor]);

  const setValue = useCallback(
    (value: string) => {
      editor?.setValue(value);
    },
    [editor]
  );

  const getPosition = useCallback(() => {
    if (!editor) return { lineNumber: 1, column: 1 };
    const position = editor.getPosition();
    return position || { lineNumber: 1, column: 1 };
  }, [editor]);

  const setPosition = useCallback(
    (lineNumber: number, column: number) => {
      editor?.setPosition({ lineNumber, column });
      editor?.revealLineInCenter(lineNumber);
    },
    [editor]
  );

  const format = useCallback(() => {
    editor?.getAction('editor.action.formatDocument')?.run();
  }, [editor]);

  const find = useCallback(() => {
    editor?.getAction('actions.find')?.run();
  }, [editor]);

  return {
    editor,
    editorRef,
    initializeEditor,
    getValue,
    setValue,
    getPosition,
    setPosition,
    format,
    find,
  };
}

