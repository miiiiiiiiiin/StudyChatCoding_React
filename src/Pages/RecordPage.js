import { useState, useEffect } from "react";
import "./RecordPage.css";
import { useNavigate } from "react-router-dom";
import { useProblem } from "../ProblemContext";
import { useUser } from '../UserContext.js';

export default function RecordPage() {
  const navigate = useNavigate();
  const { setResponse } = useProblem();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, isLoggedIn } = useUser();

  // 목록 로드
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/LoginPage"); // 로그인 안되어있으면 튕겨냄
      return;
    }

    if (!user?.id) return; // user.id 없으면 요청하지 않음

    const loadRecords = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/api/sessions?userId=${user.id}`);
        if (!res.ok) {
          setRecords([]);
          return;
        }
        const data = await res.json();
        setRecords(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecords();
  }, [isLoggedIn, user?.id, navigate]);

  // 다시보기
  const onReplay = async (sessionId) => {
    try {
      if (!user?.id) return;

      // 0) 다시보기 모드 플래그
      sessionStorage.setItem("replayMode", "true");

      // 1) 대화 기록 먼저 시도
      const tRes = await fetch(`http://localhost:8080/api/sessions/${sessionId}/messages`);
      if (tRes.ok && tRes.status !== 204) {
        const messagesText = await tRes.text();
        sessionStorage.setItem("replayMessages", messagesText);
      } else {
        console.log("대화 기록 없음 또는 조회 실패");
        sessionStorage.removeItem("replayMessages");
      }

      // 2) 문제 텍스트는 항상 요청해서 Context에 심어주기
      const pRes = await fetch(`http://localhost:8080/api/problems/by-session?sessionId=${sessionId}`);
      if (pRes.ok) {
        const text = await pRes.text();
        sessionStorage.setItem("sessionId", sessionId);
        setResponse({ reply: text, isProblem: true });
      } else {
        console.error("문제 텍스트 복원 실패");
      }

      // 3) 메인으로 이동
      navigate("/main", { state: { replay: true } });
    } catch (e) {
      console.error("다시보기 중 오류:", e);
    }
  };

  return (
    <div className="Recode-container">
      <div className="main-wrapper record-wrapper">
        <div className="chat-container">
          <div className="page-header">
            <h2 className="page-title">대화 기록</h2>
          </div>

          {loading && <p style={{ padding: 16 }}>불러오는 중...</p>}

          <div className="records-container">
            {records.map((r) => (
              <div key={r.sessionId} className="RecordBox">
                <div className="record-header">
                  <div className="level-badge">레벨 {r.difficulty ?? "-"}</div>
                  <div className={`status-badge ${r.solved ? 'solved' : 'pending'}`}>
                    {r.solved ? '✓ 성공' : ' 실패 '}
                  </div>
                </div>

                <h3 className="record-title">{r.title ?? "제목 없음"}</h3>

                <div className="record-footer">
                  <div className="record-info">
                    <span className="info-item">
                      📅 {r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}
                    </span>
                    <span className="info-item">
                      🔄 {(r.hintsUsed ?? 0)}번 시도
                    </span>
                  </div>
                  <button className="view-button" onClick={() => onReplay(r.sessionId)}>
                    다시보기
                  </button>
                </div>
              </div>
            ))}
          </div>

          {(!loading && records.length === 0) && (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p className="empty-text">아직 기록이 없어요!</p>
              <p className="empty-subtext">문제를 풀고 첫 기록을 남겨보세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
