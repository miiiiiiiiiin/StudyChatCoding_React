import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";
import CorrectPage from './Pages/Correct';
import WrongPage from './Pages/Wrong';
import MainPage from "./Pages/MainPage";
import { ProblemProvider, useProblem } from "./ProblemContext";

function AppWrapper() {
  return (
    <ProblemProvider>
      <App />
    </ProblemProvider>
  );
}

function App() {
  const navigate = useNavigate();
  const { message, setMessage, setResponse } = useProblem(); // Context 값 사용


//서버에 답장 보내기
  const sendRequest = async () => {
    if (message.trim() === "") return;

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
        <Link to="/" className="mainLink">
          코딩훈련 
        </Link>
        <div className="nav">
          {/*<Link to="/mypage" className="subLink">마이페이지</Link>*/}
          <Link to="/records" className="subLink">기록</Link>
          <Link to="/CorrectPage" className="subLink">정답입니다</Link>
          <Link to="/WrongPage" className="subLink">틀렸습니다</Link>

        </div>
      </header>

      <Routes>
        {/* 첫 화면 */}
        <Route
          path="/"
          element={
            <main className="Maincontainer">
              <div className="mainText">
                <h1>AI와 코딩 훈련하기</h1>
                <div className="M_input-area">
                  <label> 문제 난이도 선택: <select name="Level">
                    <option value={1}> 레벨 1 </option>
                    <option value={2}> 레벨 2 </option>
                    <option value={3}> 레벨 3 </option>
                    <option value={4}> 레벨 4 </option>
                    <option value={5}> 레벨 5 </option>
                    <option value={6}> 레벨 6 </option>
                    <option value={7}> 레벨 7 </option>
                    <option value={8}> 레벨 8 </option>
                    <option value={9}> 레벨 9 </option>
                  </select></label>
                  <input
                    type="text"
                    placeholder="문제를 입력하세요..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <button className="EnterBtn" onClick={sendRequest}>
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
