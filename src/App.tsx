import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import TermDetail from './pages/TermDetail';
import NotFound from './pages/NotFound';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--current-bg);
  color: var(--current-text);
  transition: all 0.3s ease;
`;

const MainContent = styled.main`
  flex: 1;
  background-color: var(--current-bg);
`;

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <AppWrapper>
      <Header 
        onMenuToggle={toggleSidebar}
        onThemeToggle={toggleTheme}
        isDarkMode={isDarkMode}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <MainContent>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/term/:term" element={<TermDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainContent>
      <Footer />
    </AppWrapper>
  );
}

export default App;
