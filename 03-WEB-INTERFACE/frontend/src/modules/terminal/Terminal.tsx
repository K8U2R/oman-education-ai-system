import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import { terminalCommands } from './TerminalCommands';

const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const currentLineRef = useRef<string>('');

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm.js
    const terminal = new XTerm({
      theme: {
        background: '#0f172a',
        foreground: '#f8fafc',
        cursor: '#3b82f6',
        selection: '#1e293b',
      },
      fontSize: 14,
      fontFamily: 'Fira Code, Consolas, Monaco, monospace',
      cursorBlink: true,
      cursorStyle: 'block',
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    terminal.loadAddon(fitAddon);
    terminal.loadAddon(webLinksAddon);
    terminal.open(terminalRef.current);

    fitAddon.fit();

    // Welcome message
    terminal.writeln('مرحباً بك في FlowForge IDE Terminal');
    terminal.writeln('اكتب "help" للأوامر المتاحة');
    terminal.write('$ ');

    // Handle input
    terminal.onData(async (data) => {
      const code = data.charCodeAt(0);

      if (code === 13) {
        // Enter key
        terminal.write('\r\n');
        const command = currentLineRef.current.trim();

        if (command) {
          if (command === 'clear') {
            terminal.clear();
            terminal.write('$ ');
            currentLineRef.current = '';
            return;
          }

          const result = await terminalCommands.executeCommand(command);
          if (result.success) {
            if (result.output) {
              terminal.writeln(result.output);
            }
          } else {
            terminal.writeln(`\x1b[31m${result.error || 'حدث خطأ'}\x1b[0m`);
          }
        }

        terminal.write('$ ');
        currentLineRef.current = '';
      } else if (code === 127) {
        // Backspace
        if (currentLineRef.current.length > 0) {
          currentLineRef.current = currentLineRef.current.slice(0, -1);
          terminal.write('\b \b');
        }
      } else if (code >= 32) {
        // Printable characters
        currentLineRef.current += data;
        terminal.write(data);
      }
    });

    xtermRef.current = terminal;
    fitAddonRef.current = fitAddon;

    // Handle resize
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      terminal.dispose();
    };
  }, []);

  return <div ref={terminalRef} className="h-full w-full p-4" />;
};

export default Terminal;

