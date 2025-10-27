import React from 'react';

export default function CCodeEditor({ value, onChange }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = value.substring(0, start) + '    ' + value.substring(end);
      onChange({ target: { value: newCode } });
      
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const lineCount = value.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const styles = {
    editorWrapper: {
      display: 'flex',
      backgroundColor: '#f5f5f5',
      border: '2px solid #4caf50',
      borderRadius: '8px',
      overflowY: 'auto'
    },
    lineNumbers: {
      backgroundColor: '#4caf50',
      padding: '12px 10px',
      textAlign: 'right',
      color: 'white',
      fontFamily: 'monospace',
      fontSize: '17px',
      userSelect: 'none',
      borderRight: '2px solid #4caf50',
      minWidth: '20px',
    },
    lineNumber: {
      lineHeight: '24px',
    },
    textarea: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      color: 'Black',
      fontFamily: "Pretendard", 
      fontSize: '17px',
      padding: '12px',
      marginLeft: '5px',
      resize: 'none',
      outline: 'none',
      lineHeight: '24px',
      height: '400px',
      border: 'none',
      tabSize: 4,
    },
  };

  return (
    <div style={styles.editorWrapper}>
      <div style={styles.lineNumbers}>
        {lineNumbers.map(num => (
          <div key={num} style={styles.lineNumber}>{num}</div>
        ))}
      </div>

      <textarea
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        style={styles.textarea}
        spellCheck={false}
        placeholder="// C 코드를 입력하세요..."
      />
    </div>
  );
}