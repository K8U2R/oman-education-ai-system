import * as monaco from 'monaco-editor';

/**
 * Configure ESLint-like linting for Monaco Editor
 */
export function configureLinting(language: string) {
  // TypeScript/JavaScript already has built-in diagnostics
  if (language === 'typescript' || language === 'javascript') {
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: false,
      diagnosticCodesToIgnore: [],
    });

    // Set compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types'],
    });
  }

  // Configure JSON validation
  if (language === 'json') {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: true,
      schemas: [],
      trailingCommas: 'ignore',
      comments: 'ignore',
    });
  }
}

/**
 * Add custom validation rules
 */
export function addCustomValidation(
  model: monaco.editor.ITextModel,
  rules: Array<{
    pattern: RegExp;
    message: string;
    severity: monaco.MarkerSeverity;
  }>
) {
  const markers: monaco.editor.IMarkerData[] = [];
  const text = model.getValue();
  const lines = text.split('\n');

  lines.forEach((line, lineNumber) => {
    rules.forEach((rule) => {
      if (rule.pattern.test(line)) {
        markers.push({
          severity: rule.severity,
          message: rule.message,
          startLineNumber: lineNumber + 1,
          startColumn: 1,
          endLineNumber: lineNumber + 1,
          endColumn: line.length + 1,
        });
      }
    });
  });

  if (markers.length > 0) {
    monaco.editor.setModelMarkers(model, 'custom-validation', markers);
  }
}

