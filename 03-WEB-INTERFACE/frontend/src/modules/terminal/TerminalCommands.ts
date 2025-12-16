/**
 * Terminal command handlers
 */

export interface CommandResult {
  success: boolean;
  output: string;
  error?: string;
}

export class TerminalCommands {
  private commandHistory: string[] = [];
  private currentDirectory: string = '/';

  async executeCommand(command: string): Promise<CommandResult> {
    this.commandHistory.push(command);
    const [cmd, ...args] = command.trim().split(' ');

    try {
      switch (cmd.toLowerCase()) {
        case 'help':
          return this.help();
        case 'clear':
          return { success: true, output: '' };
        case 'pwd':
          return { success: true, output: this.currentDirectory };
        case 'ls':
        case 'dir':
          return await this.listFiles();
        case 'cd':
          return await this.changeDirectory(args[0] || '');
        case 'cat':
        case 'type':
          return await this.readFile(args[0] || '');
        case 'echo':
          return { success: true, output: args.join(' ') };
        case 'history':
          return {
            success: true,
            output: this.commandHistory.slice(-10).join('\n'),
          };
        default:
          return {
            success: false,
            output: '',
            error: `الأمر "${cmd}" غير معروف. استخدم "help" للحصول على قائمة الأوامر.`,
          };
      }
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private help(): CommandResult {
    return {
      success: true,
      output: `الأوامر المتاحة:
  help        - عرض هذه المساعدة
  clear       - مسح الشاشة
  pwd         - عرض المجلد الحالي
  ls / dir    - عرض الملفات
  cd [path]   - تغيير المجلد
  cat [file]  - عرض محتوى الملف
  echo [text] - طباعة النص
  history     - عرض سجل الأوامر`,
    };
  }

  private async listFiles(): Promise<CommandResult> {
    try {
      // This would integrate with file system API
      // For now, return mock data
      const { apiClient } = await import('@/services/api/api-client');
      const { API_ENDPOINTS } = await import('@/services/api/endpoints');
      const { useIDE } = await import('@/core/state/useIDE');
      
      const { activeProjectId } = useIDE.getState();
      if (!activeProjectId) {
        return {
          success: false,
          output: '',
          error: 'لا يوجد مشروع نشط',
        };
      }

      try {
        const files = await apiClient.get<string[]>(
          API_ENDPOINTS.files.list(activeProjectId, this.currentDirectory)
        );
        return {
          success: true,
          output: files.join('\n'),
        };
      } catch {
        // Fallback to mock data
        return {
          success: true,
          output: 'src/\npublic/\npackage.json\nREADME.md',
        };
      }
    } catch {
      return {
        success: true,
        output: 'src/\npublic/\npackage.json\nREADME.md',
      };
    }
  }

  private async changeDirectory(path: string): Promise<CommandResult> {
    if (!path) {
      return {
        success: false,
        output: '',
        error: 'يرجى تحديد مسار المجلد',
      };
    }

    try {
      // This would integrate with file system API
      // For now, just update the current directory
      this.currentDirectory = path;
      return {
        success: true,
        output: `تم الانتقال إلى: ${path}`,
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'خطأ في تغيير المجلد',
      };
    }
  }

  private async readFile(filename: string): Promise<CommandResult> {
    if (!filename) {
      return {
        success: false,
        output: '',
        error: 'يرجى تحديد اسم الملف',
      };
    }

    try {
      // This would integrate with file system API
      const { apiClient } = await import('@/services/api/api-client');
      const { API_ENDPOINTS } = await import('@/services/api/endpoints');
      const { useIDE } = await import('@/core/state/useIDE');
      
      const { activeProjectId } = useIDE.getState();
      if (!activeProjectId) {
        return {
          success: false,
          output: '',
          error: 'لا يوجد مشروع نشط',
        };
      }

      try {
        const filePath = this.currentDirectory === '/' 
          ? filename 
          : `${this.currentDirectory}/${filename}`;
        const content = await apiClient.get<string>(
          API_ENDPOINTS.files.read(activeProjectId, filePath)
        );
        return {
          success: true,
          output: `محتوى الملف ${filename}:\n${content}`,
        };
      } catch {
        return {
          success: true,
          output: `محتوى الملف ${filename}:\n[سيتم تحميل المحتوى من API]`,
        };
      }
    } catch {
      return {
        success: true,
        output: `محتوى الملف ${filename}:\n[سيتم تحميل المحتوى من API]`,
      };
    }
  }

  getHistory(): string[] {
    return [...this.commandHistory];
  }

  clearHistory(): void {
    this.commandHistory = [];
  }
}

export const terminalCommands = new TerminalCommands();

