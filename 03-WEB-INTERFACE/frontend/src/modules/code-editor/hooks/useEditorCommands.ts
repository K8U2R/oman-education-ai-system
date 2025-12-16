import { useCallback } from 'react';
import * as monaco from 'monaco-editor';

interface EditorCommands {
  find: () => void;
  replace: () => void;
  goToLine: () => void;
  formatDocument: () => void;
  foldAll: () => void;
  unfoldAll: () => void;
  toggleComment: () => void;
  duplicateLine: () => void;
  deleteLine: () => void;
  moveLineUp: () => void;
  moveLineDown: () => void;
}

export function useEditorCommands(
  editor: monaco.editor.IStandaloneCodeEditor | null
): EditorCommands {
  const find = useCallback(() => {
    if (editor) {
      editor.getAction('actions.find')?.run();
    }
  }, [editor]);

  const replace = useCallback(() => {
    if (editor) {
      editor.getAction('editor.action.startFindReplaceAction')?.run();
    }
  }, [editor]);

  const goToLine = useCallback(() => {
    if (editor) {
      editor.getAction('editor.action.gotoLine')?.run();
    }
  }, [editor]);

  const formatDocument = useCallback(() => {
    if (editor) {
      editor.getAction('editor.action.formatDocument')?.run();
    }
  }, [editor]);

  const foldAll = useCallback(() => {
    if (editor) {
      editor.getAction('editor.foldAll')?.run();
    }
  }, [editor]);

  const unfoldAll = useCallback(() => {
    if (editor) {
      editor.getAction('editor.unfoldAll')?.run();
    }
  }, [editor]);

  const toggleComment = useCallback(() => {
    if (editor) {
      editor.getAction('editor.action.commentLine')?.run();
    }
  }, [editor]);

  const duplicateLine = useCallback(() => {
    if (editor) {
      editor.getAction('editor.action.copyLinesDownAction')?.run();
    }
  }, [editor]);

  const deleteLine = useCallback(() => {
    if (editor) {
      editor.getAction('editor.action.deleteLines')?.run();
    }
  }, [editor]);

  const moveLineUp = useCallback(() => {
    if (editor) {
      editor.getAction('editor.action.moveLinesUpAction')?.run();
    }
  }, [editor]);

  const moveLineDown = useCallback(() => {
    if (editor) {
      editor.getAction('editor.action.moveLinesDownAction')?.run();
    }
  }, [editor]);

  return {
    find,
    replace,
    goToLine,
    formatDocument,
    foldAll,
    unfoldAll,
    toggleComment,
    duplicateLine,
    deleteLine,
    moveLineUp,
    moveLineDown,
  };
}

