import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

/////////// C/Java 코드 개발 인풋 에디터 (Monaco) ///////////
export default function CodeEditor({ value, onChange, onReset, language, onLanguageChange }) {
  const editorRef = useRef(null);

  // 언어별 색상 설정
  const themeColors = {
    c: {
      primary: 'rgba(102, 126, 234, 0.2)',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgLight: '#fafbff',
      shadow: 'rgba(102, 126, 234, 0.15)',
      accent: '#667eea',
      icon: 'C',
      name: 'C 언어'
    },
    java: {
      primary: 'rgba(234, 102, 102, 0.2)',
      gradient: 'linear-gradient(135deg, #ea6e6e 0%, #c44569 100%)',
      bgLight: '#fffbfb',
      shadow: 'rgba(234, 102, 102, 0.15)',
      accent: '#ea6e6e',
      icon: 'J',
      name: 'Java'
    }
  };

  const theme = themeColors[language];

  // Monaco Editor 마운트 시 테마 설정
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // C 언어 테마
    monaco.editor.defineTheme('purpleTheme', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '9ca3af', fontStyle: 'italic' },
        { token: 'keyword', foreground: '667eea', fontStyle: 'bold' },
        { token: 'string', foreground: '764ba2' },
        { token: 'number', foreground: '667eea' },
        { token: 'type', foreground: '764ba2' },
        { token: 'function', foreground: '5a67d8' },
        { token: 'variable', foreground: '1f2937' },
        { token: 'identifier', foreground: '1f2937' },
      ],
      colors: {
        'editor.background': '#fafbff',
        'editor.foreground': '#1f2937',
        'editor.lineHighlightBackground': '#f0f2ff',
        'editor.selectionBackground': '#667eea30',
        'editorCursor.foreground': '#667eea',
        'editorLineNumber.foreground': '#9ca3af',
        'editorLineNumber.activeForeground': '#667eea',
        'editor.inactiveSelectionBackground': '#667eea20',
        'editorIndentGuide.background': '#e8e8e8',
        'editorIndentGuide.activeBackground': '#667eea50',
      }
    });

    // Java 테마
    monaco.editor.defineTheme('redTheme', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '9ca3af', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ea6e6e', fontStyle: 'bold' },
        { token: 'string', foreground: 'c44569' },
        { token: 'number', foreground: 'ea6e6e' },
        { token: 'type', foreground: 'c44569' },
        { token: 'function', foreground: 'd64545' },
        { token: 'variable', foreground: '1f2937' },
        { token: 'identifier', foreground: '1f2937' },
      ],
      colors: {
        'editor.background': '#fffbfb',
        'editor.foreground': '#1f2937',
        'editor.lineHighlightBackground': '#fff0f0',
        'editor.selectionBackground': '#ea6e6e30',
        'editorCursor.foreground': '#ea6e6e',
        'editorLineNumber.foreground': '#9ca3af',
        'editorLineNumber.activeForeground': '#ea6e6e',
        'editor.inactiveSelectionBackground': '#ea6e6e20',
        'editorIndentGuide.background': '#e8e8e8',
        'editorIndentGuide.activeBackground': '#ea6e6e50',
      }
    });

    // 언어에 따라 테마 적용
    monaco.editor.setTheme(language === 'c' ? 'purpleTheme' : 'redTheme');
  };

  // 에디터 값 변경 핸들러
  const handleEditorChange = (newValue) => {
    onChange({ target: { value: newValue || '' } });
  };

  // 언어 변경 시 테마도 변경
  const handleLanguageChange = (e) => {
    onLanguageChange(e);
    if (editorRef.current) {
      const monaco = window.monaco;
      if (monaco) {
        monaco.editor.setTheme(e.target.value === 'c' ? 'purpleTheme' : 'redTheme');
      }
    }
  };

  // Monaco 언어 매핑
  const getMonacoLanguage = () => {
    return language === 'c' ? 'c' : 'java';
  };

  const styles = {
    container: {
      width: '100%',
      border: `1.5px solid ${theme.primary}`,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: `0 8px 32px ${theme.shadow}`,
      background: '#ffffff',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: theme.gradient,
      padding: '14px 20px',
      borderBottom: 'none',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    languageIcon: {
      fontSize: '14px',
      fontWeight: '700',
      color: 'white',
      fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, sans-serif',
      width: '28px',
      height: '28px',
      background: 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(10px)',
      border: '1.5px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '8px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    select: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      border: '1.5px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '8px',
      padding: '6px 12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      fontFamily: '"Pretendard", sans-serif',
      backdropFilter: 'blur(10px)',
      outline: 'none',
    },
    headerRight: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
    },
    resetButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      border: '1.5px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '8px',
      padding: '6px 16px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      fontFamily: '"Pretendard", sans-serif',
      transition: 'all 0.2s ease',
      backdropFilter: 'blur(10px)',
    },
    editorWrapper: {
      display: 'flex',       // 부모 flex에 맞춰서 늘어나도록
      border: 'none',
      height: '300px',
      overflow: 'hidden',
    },
  };

  return (
    <div style={styles.container}>
      {/* 헤더 */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.languageIcon}>{theme.icon}</span>
          <select 
            value={language} 
            onChange={handleLanguageChange}
            style={styles.select}
          >
            <option value="c" style={{ color: '#000' }}>C 언어</option>
            <option value="java" style={{ color: '#000' }}>Java</option>
          </select>
        </div>
        <div style={styles.headerRight}>
          <button 
            style={styles.resetButton}
            onClick={onReset}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.35)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            초기화
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div style={styles.editorWrapper}>
        <Editor
          height="500px"
          width="500px"
          language={getMonacoLanguage()}
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            fontFamily: '"SF Mono", "Consolas", "Monaco", "Pretendard", monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            folding: true,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: 'off',
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            padding: { top: 16, bottom: 16 },
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            bracketPairColorization: { enabled: true },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
    </div>
  );
}