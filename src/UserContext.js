// UserContext.js 생성
import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);//유저정보 
  const [isLoggedIn, setIsLoggedIn] = useState(false);//로그인 여부
  

  // 새로고침 시 localStorage에서 복구
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData)); // 저장
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user'); // 삭제
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);