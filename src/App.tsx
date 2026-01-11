import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import JoinPage from './pages/JoinPage'
import LoginPage from './pages/LoginPage';
import CookiePage from './pages/CookiePage';
import UserPage from './pages/UserPage';
import MainPage from './pages/MainPage';
import Header from './components/Header';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cookie" element={<CookiePage />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </>
  )
}

export default App
