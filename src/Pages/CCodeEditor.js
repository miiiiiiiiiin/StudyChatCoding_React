import React from 'react';

export default function CCodeEditor({ value, onChange, onReset }) {
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
  container: {
    width: '100%',
    border: '2px solid',
    borderColor: '#dfdfdf #000000 #000000 #dfdfdf',
    boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(90deg, #000080, #1084d0)',
    padding: '4px 8px',
    height: '28px',
    borderBottom: '2px solid #000000',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  languageIcon: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'white',
    fontFamily: '"굴림", "Gulim", sans-serif',
    width: '16px',
    height: '16px',
    background: '#ffffff',
    border: '1px solid #000000',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000000',
  },
  languageText: {
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    fontFamily: '"굴림", "Gulim", sans-serif',
  },
  resetButton: {
    backgroundColor: '#c0c0c0',
    color: '#000000',
    border: '2px solid',
    borderColor: '#ffffff #000000 #000000 #ffffff',
    borderRadius: '0',
    padding: '2px 10px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: '"굴림", "Gulim", sans-serif',
    height: '20px',
    boxShadow: 'inset -1px -1px 0 #808080, inset 1px 1px 0 #dfdfdf',
  },
  editorWrapper: {
    display: 'flex',
    backgroundColor: '#ffffff',
    border: 'none',
    borderTop: 'none',
    borderBottomLeftRadius: '0',
    borderBottomRightRadius: '0',
    height: '300px',
    overflow: 'hidden',
    boxShadow: 'inset -1px -1px 0 #ffffff, inset 1px 1px 0 #808080',
    margin: '2px',
  },
  lineNumbers: {
    backgroundColor: '#c0c0c0',
    padding: '12px 10px',
    textAlign: 'right',
    color: '#000000',
    fontFamily: '"굴림", "Gulim", monospace',
    fontSize: '14px',
    userSelect: 'none',
    borderRight: '2px solid #808080',
    height: '300px',
    minWidth: '20px',
    boxShadow: 'inset -1px 0 0 #dfdfdf',
  },
  lineNumber: {
    lineHeight: '20px',
  },
  textarea: {
    flex: 1,
    backgroundColor: '#ffffff',
    color: '#000000',
    fontFamily: '"굴림", "Gulim", monospace',
    fontSize: '14px',
    padding: '12px',
    marginLeft: '5px',
    resize: 'none',
    outline: 'none',
    lineHeight: '20px',
    border: 'none',
    tabSize: 4,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
};

  return (
    <div style={styles.container}>
      {/* 헤더 */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          
          <span style={styles.languageText}>C 언어</span>
        </div>
        <button 
          style={styles.resetButton}
          onClick={onReset}
          onMouseOver={(e) => e.target.style.backgroundColor = '#e8f5e9'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
        >
          초기화
        </button>
      </div>

      {/* 에디터 */}
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
    </div>
  );
}