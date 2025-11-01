import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";
import CorrectPage from './Pages/Correct';
import WrongPage from './Pages/Wrong';
import MainPage from "./Pages/MainPage";
import { ProblemProvider, useProblem } from "./ProblemContext";
import { ResultProvider, useResult } from "./ResultContext";
import menuIcon from './Icon/menu.png'

function AppWrapper() {
  return (
    <ProblemProvider>
      <ResultProvider>
      <App />
      </ResultProvider>
    </ProblemProvider>
  );
}


function App() {
  const navigate = useNavigate();
  const { message, setMessage, setResponse } = useProblem(); // Context 값 사용
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { hint, correct, timer, level, resetAll } = useResult(); // 힌트 사용한 횟수,정답 보낸 횟수 ,소요시간 세서 정답 페이지로 보내는 전역변수

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

//서버에 답장 보내기
  const sendRequest = async () => {
    if (message.trim() === "") return;
    resetAll();
    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "username",
          message: message,
        }),
      });

      const data = await res.json();

      setResponse(data); // Context에 저장
      navigate("/main"); // 결과 페이지로 이동
    } catch (err) {
      console.error("API 호출 실패:", err);
    }
  };



  return (
    <div className="app-container">
      <header className="header">
       <img
          src={menuIcon}
          alt="아이콘"
          className="menu-icon"
          onClick={toggleSidebar}
        />
        <Link to="/" className="mainLink">
          CodeTalk 코드톡 
        </Link>
        <div className="nav">
          {/*<Link to="/mypage" className="subLink">마이페이지</Link>*/}
          
          

        </div>
      </header>

      {/* 사이드바 */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-item">
          <Link to="/records" className="subLink">코드톡 소개</Link>
        </div>
        <div className="sidebar-item">
          <Link to="/records" className="subLink">기록</Link>
        </div>
        <div className="sidebar-item">
          <Link to="/CorrectPage" className="subLink">정답입니다</Link>
        </div>
        <div className="sidebar-item">
          <Link to="/WrongPage" className="subLink">틀렸습니다</Link>
        </div>
      </div>

      <Routes>
        {/* 첫 화면 */}
        <Route
          path="/"
          element={
            <main className="Maincontainer">
              <div className="mainText">
                <h1>AI와 코딩 문제를 풀어보세요!</h1>
                <div className="M_input-area">
                  <label> 문제 난이도 선택: <select name="Level">
                      {[...Array(9)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          레벨 {i + 1}
                        </option>
                      ))}
                    </select></label>
                  <input
                    type="text"
                    placeholder="문제를 입력하세요..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <button className="EnterBtn" 
                onClick={async () => {
                  await sendRequest();
                }}>
                  문제 풀이
                </button>
              </div>
            </main>
          }
        />

        {/* 다른 페이지 */}
        <Route path="/main" element={<MainPage />} />
        <Route path="/mypage" element={<div>마이페이지</div>} />
        <Route path="/CorrectPage" element={<CorrectPage />} />
        <Route path="/WrongPage" element={<WrongPage />} />
        <Route path="/records" element={<div>기록 페이지</div>} />
      </Routes>
    </div>
  );
}

export default AppWrapper;
