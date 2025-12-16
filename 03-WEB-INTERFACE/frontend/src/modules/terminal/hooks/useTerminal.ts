import { useState, useCallback, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

export function useTerminal() {
  const [terminal, setTerminal] = useState<XTerm | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const historyIndexRef = useRef(-1);
  const terminalRef = useRef<HTMLDivElement>(null);

  const initializeTerminal = useCallback((container: HTMLDivElement) => {
    const xterm = new XTerm({
      theme: {
        background: '#020617',
        foreground: '#f8fafc',
        cursor: '#4285f4',
      },
      fontSize: 14,
      fontFamily: 'Fira Code, Consolas, monospace',
    });

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);

    xterm.open(container);
    fitAddon.fit();

    xterm.onData((_data) => {
      // Handle terminal input
    });

    setTerminal(xterm);
    return xterm;
  }, []);

  const executeCommand = useCallback((command: string) => {
    if (!terminal) return;

    terminal.writeln(`$ ${command}`);
    setCommandHistory((prev) => [command, ...prev.filter((c) => c !== command)].slice(0, 50));
    historyIndexRef.current = -1;

    // TODO: Execute command via API
    terminal.writeln('Command executed');
  }, [terminal]);

  const getPreviousCommand = useCallback(() => {
    if (commandHistory.length === 0) return '';
    historyIndexRef.current = Math.min(historyIndexRef.current + 1, commandHistory.length - 1);
    return commandHistory[historyIndexRef.current];
  }, [commandHistory]);

  const getNextCommand = useCallback(() => {
    if (historyIndexRef.current <= 0) {
      historyIndexRef.current = -1;
      return '';
    }
    historyIndexRef.current -= 1;
    return commandHistory[historyIndexRef.current];
  }, [commandHistory]);

  const clear = useCallback(() => {
    terminal?.clear();
  }, [terminal]);

  return {
    terminal,
    terminalRef,
    commandHistory,
    initializeTerminal,
    executeCommand,
    getPreviousCommand,
    getNextCommand,
    clear,
  };
}

