import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import * as monaco from 'monaco-editor';
import { useErrorStore } from '@/core/error/ErrorStore';

interface EditorErrorsProps {
  editor: monaco.editor.IStandaloneCodeEditor | null;
  filePath: string;
}

interface MonacoMarker {
  severity: monaco.MarkerSeverity;
  message: string;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

const EditorErrors: React.FC<EditorErrorsProps> = ({ editor, filePath }) => {
  const [markers, setMarkers] = useState<MonacoMarker[]>([]);
  const { addError } = useErrorStore();

  useEffect(() => {
    if (!editor) return;

    const updateMarkers = () => {
      const model = editor.getModel();
      if (!model) return;

      const monacoMarkers = monaco.editor.getModelMarkers({ resource: model.uri });
      const editorMarkers: MonacoMarker[] = monacoMarkers.map((marker) => ({
        severity: marker.severity,
        message: marker.message,
        startLineNumber: marker.startLineNumber,
        startColumn: marker.startColumn,
        endLineNumber: marker.endLineNumber,
        endColumn: marker.endColumn,
      }));

      setMarkers(editorMarkers);

      // Add errors to error store
      const errors = editorMarkers.filter((m) => m.severity === monaco.MarkerSeverity.Error);
      const warnings = editorMarkers.filter((m) => m.severity === monaco.MarkerSeverity.Warning);

      errors.forEach((error) => {
        addError({
          level: 'error',
          title: `خطأ في ${filePath}:${error.startLineNumber}`,
          message: error.message,
          details: `السطر ${error.startLineNumber}, العمود ${error.startColumn}`,
          dismissible: true,
        });
      });

      warnings.forEach((warning) => {
        addError({
          level: 'warning',
          title: `تحذير في ${filePath}:${warning.startLineNumber}`,
          message: warning.message,
          details: `السطر ${warning.startLineNumber}, العمود ${warning.startColumn}`,
          dismissible: true,
        });
      });
    };

    // Listen for marker changes
    const disposable = monaco.editor.onDidChangeMarkers((uris) => {
      const model = editor.getModel();
      if (model && uris.includes(model.uri)) {
        updateMarkers();
      }
    });

    // Initial update
    updateMarkers();

    return () => {
      disposable.dispose();
    };
  }, [editor, filePath, addError]);

  if (markers.length === 0) return null;

  const errors = markers.filter((m) => m.severity === monaco.MarkerSeverity.Error);
  const warnings = markers.filter((m) => m.severity === monaco.MarkerSeverity.Warning);

  return (
    <div className="border-t border-ide-border bg-ide-surface">
      <div className="p-2 max-h-32 overflow-y-auto">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-xs font-semibold">
            {errors.length > 0 && `${errors.length} ${errors.length > 1 ? 'أخطاء' : 'خطأ'}`}
            {errors.length > 0 && warnings.length > 0 && ' • '}
            {warnings.length > 0 && `${warnings.length} ${warnings.length > 1 ? 'تحذيرات' : 'تحذير'}`}
          </span>
        </div>
        <div className="space-y-1">
          {markers.map((marker, index) => (
            <div
              key={index}
              className={`text-xs p-1.5 rounded ${
                marker.severity === monaco.MarkerSeverity.Error
                  ? 'bg-red-900/20 text-red-400'
                  : 'bg-yellow-900/20 text-yellow-400'
              }`}
              onClick={() => {
                if (editor) {
                  editor.setPosition({
                    lineNumber: marker.startLineNumber,
                    column: marker.startColumn,
                  });
                  editor.revealLineInCenter(marker.startLineNumber);
                  editor.focus();
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <span className="font-mono">
                {marker.startLineNumber}:{marker.startColumn} - {marker.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorErrors;

