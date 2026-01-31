import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Components
import IntroScreen from './components/IntroScreen';
import Loader from './components/Loader';
import Navbar from './components/Navbar'; // 👈 Navbar Import

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import BookingPage from './pages/BookingPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';

const AppContent = () => {
  const location = useLocation();
  const [pageLoading, setPageLoading] = useState(false);
  const [firstLoadDone, setFirstLoadDone] = useState(false);

  useEffect(() => {
    if (!firstLoadDone) {
      setFirstLoadDone(true);
      return;
    }
    setPageLoading(true);
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {pageLoading && <Loader />}
      
      {/* ✅ NAVBAR IS HERE NOW - FOR ALL PAGES */}
      <Navbar /> 
      
      <div className={pageLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/success" element={<BookingSuccessPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  const [introVisible, setIntroVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroVisible(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {introVisible && <IntroScreen />}
      <AppContent />
    </Router>
  );
}

export default App;