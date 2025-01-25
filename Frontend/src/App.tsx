// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle";
import NavBar from "./components/NavBar";
import Swipe from "./pages/Swipe";
import Search from "./pages/Search";
import AddCard from "./pages/AddCard";
import Feed from "./pages/Feed";
import MyPage from "./pages/MyPage";

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/swipe" element={<Swipe />} />
            <Route path="/search" element={<Search />} />
            <Route path="/add-card" element={<AddCard />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/my-page" element={<MyPage />} />
          </Routes>
          <NavBar /> {/* NavBar를 app-container의 자식으로 포함 */}
        </div>
      </Router>
    </>
  );
};

export default App;
