// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle";
import TopBar from "./components/TopBar"; // TopBar 컴포넌트 경로
import NavBar from "./components/NavBar";
import Swipe from "./pages/Swipe";
import Search from "./pages/Search";
import AddBong from "./pages/AddBong";
import Feed from "./pages/Feed";
import MyPage from "./pages/MyPage";

import DetailBong from "./pages/Bong/DetailBong";

import Login from "./pages/User/Login";
import KakaoCallback from "./pages/User/KakaoCallback";
import NaverCallback from "./pages/User/NaverCallback";
import FindAccount from "./pages/User/FindAccount";
import Register from "./pages/User/Register";

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Router basename="/">
        <div className="app-container">
          <TopBar />
          <Routes>
            <Route path="/" element={<Swipe />} />
            <Route path="/search" element={<Search />} />
            <Route path="/add-bong" element={<AddBong />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/my-page" element={<MyPage />} />

            <Route path="/detail/:progrmRegistNo" element={<DetailBong />} />

            <Route path="/user/login" element={<Login />} />
            <Route path="/auth/callback/kakao" element={<KakaoCallback />} />
            <Route path="/auth/callback/naver" element={<NaverCallback />} />
            <Route path="/user/find-account" element={<FindAccount />} />
            <Route path="/user/register" element={<Register />} />

          </Routes>
          <NavBar /> {/* NavBar를 app-container의 자식으로 포함 */}
        </div>
      </Router>
    </>
  );
};

export default App;
