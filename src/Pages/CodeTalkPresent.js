import { useState } from "react";
import "./CodeTalkPresent.css";
import { useNavigate } from "react-router-dom";

export default function CodeTalkPresent() {
  const navigate = useNavigate();
  const [activeLevel, setActiveLevel] = useState(null);

  const levels = [
    { level: 1, title: "입출력과 사칙연산", desc: "입력, 출력과 사칙연산을 연습해 봅시다. Hello World!" },
    { level: 2, title: "조건문", desc: "if 등의 조건문을 사용해 봅시다." },
    { level: 3, title: "반복문", desc: "for, while 등의 반복문을 사용해 봅시다." },
    { level: 4, title: "1차원 배열", desc: "배열을 사용해 봅시다." },
    { level: 5, title: "문자열", desc: "문자열을 다루는 문제들을 해결해 봅시다." },
    { level: 6, title: "심화", desc: "지금까지의 프로그래밍 문법으로 더 어려운 문제들을 풀어봅시다." },
    { level: 7, title: "2차원 배열", desc: "배열 안에 배열이 있다면 어떨까요? 2차원 배열을 만들어 봅시다." },
    { level: 8, title: "수학", desc: "수학적 사고력을 길러 봅시다." },
  ];

  const features = [
    { icon: "💬", title: "채팅 기반 대화형", desc: "기존 온라인 저지와 달리 양방향 소통 가능" },
    { icon: "💡", title: "명확한 피드백", desc: "단계별 힌트로 효율적인 문제 해결" },
    { icon: "📝", title: "풀이 기록 제공", desc: "사고 과정을 되짚어보며 이해 심화" },
  ];

  const hints = [
    { step: 1, title: "첫번째 힌트", desc: "문제의 목적과 입출력 형식 설명", color: "#667eea" },
    { step: 2, title: "두번째 힌트", desc: "필요 알고리즘과 자료구조, 핵심 아이디어 설명", color: "#764ba2" },
    { step: 3, title: "세번째 힌트", desc: "의사코드 수준의 코드 구조 설명", color: "#9f7aea" },
  ];

  const steps = [
    { num: "01", title: "레벨 선택", desc: "본인에게 맞는 레벨을 선택하면 레벨에 맞는 코딩 문제를 랜덤으로 가져옵니다." },
    { num: "02", title: "문제 풀이", desc: "문제를 읽고 코드톡이 보내는 힌트와 사용자 맞춤 응답을 통해 정답을 맞춰보세요." },
    { num: "03", title: "결과 확인", desc: "힌트 사용 횟수, 정답 시도 횟수, 소요 시간을 계산해 사용자에게 보여줍니다." },
    { num: "04", title: "기록 열람", desc: "사용자가 대화한 기록들은 기록 페이지에서 다시 찾아볼 수 있습니다." },
  ];

  return (
    <div className="intro-container">
      {/* 히어로 섹션 */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">🚀 코딩 학습 어시스턴트</div>
          <h1 className="hero-title">
            <span className="gradient-text">코드톡</span>
          </h1>
          <p className="hero-subtitle">채팅 형식의 양방향 온라인 저지 프로그램</p>
          <p className="hero-desc">
            AI와 대화하며 코딩 문제를 풀어보세요.<br/>
            단계별 힌트와 맞춤형 피드백으로 효율적인 학습이 가능합니다.
          </p>
          <button className="hero-cta" onClick={() => navigate("/")}>
            시작하기 →
          </button>
        </div>
        <div className="hero-decoration">
          <div className="floating-card card-1">💬</div>
          <div className="floating-card card-2">💻</div>
          <div className="floating-card card-3">✨</div>
        </div>
      </section>

      {/* 사용 단계 */}
      <section className="steps-section">
        <h2 className="section-title">이용 방법</h2>
        <div className="steps-grid">
          {steps.map((step, idx) => (
            <div key={idx} className="step-card">
              <div className="step-num">{step.num}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 차별점 */}
      <section className="features-section">
        <h2 className="section-title">기존 온라인 저지와의 차별점</h2>
        <div className="features-grid">
          {features.map((f, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 힌트 시스템 */}
      <section className="hints-section">
        <h2 className="section-title">3단계 힌트 시스템</h2>
        <div className="hints-grid">
          {hints.map((h, idx) => (
            <div key={idx} className="hint-card" style={{ borderColor: h.color }}>
              <div className="hint-step" style={{ background: h.color }}>{h.step}</div>
              <h3 className="hint-title">{h.title}</h3>
              <p className="hint-desc">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 응답 시스템 */}
      <section className="response-section">
        <h2 className="section-title">사용자 응답에 따른 답변</h2>
        <div className="response-grid">
          <div className="response-card wrong">
            <div className="response-icon">❌</div>
            <h3>오답일 경우</h3>
            <p>사용자 답변을 파악하고 틀린 부분을 간략하게 설명합니다.</p>
          </div>
          <div className="response-card correct">
            <div className="response-icon">✅</div>
            <h3>정답일 경우</h3>
            <p>사용자 답변을 파악하고 맞은 이유를 간략하게 설명합니다.</p>
          </div>
        </div>
      </section>

      {/* 레벨 설명 */}
      <section className="levels-section">
        <h2 className="section-title">레벨 설명</h2>
        <div className="levels-grid">
          {levels.map((l, idx) => (
            <div 
              key={idx} 
              className={`level-card ${activeLevel === idx ? 'active' : ''}`}
              onMouseEnter={() => setActiveLevel(idx)}
              onMouseLeave={() => setActiveLevel(null)}
            >
              <div className="level-num">Lv.{l.level}</div>
              <h3 className="level-title">{l.title}</h3>
              <p className="level-desc">{l.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 에디터 소개 */}
      <section className="editor-section">
        <h2 className="section-title">강력한 코드 에디터</h2>
        <div className="editor-features">
          <div className="editor-card">
            <div className="editor-icon">⌨️</div>
            <h3>Monaco Editor</h3>
            <p>VSCode와 동일한 에디터 엔진 사용</p>
          </div>
          <div className="editor-card">
            <div className="editor-icon">🔤</div>
            <h3>C / Java 지원</h3>
            <p>두 가지 언어로 문제 풀이 가능</p>
          </div>
          <div className="editor-card">
            <div className="editor-icon">🤖</div>
            <h3>AI 디버깅</h3>
            <p>GPT 기반 코드 분석 및 피드백</p>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="cta-section">
        <h2>지금 바로 코드톡과 함께 코딩을 시작하세요!</h2>
        <p>* 문제 출처: 백준</p>
        <button className="cta-button" onClick={() => navigate("/")}>
          학습 시작하기
        </button>
      </section>
    </div>
  );
}