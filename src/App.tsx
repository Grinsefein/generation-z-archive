import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import FloatingContributeButton from './components/FloatingContributeButton';
import AuthModal from './components/AuthModal';


const Home = lazy(() => import('./pages/Home'));
const TermDetail = lazy(() => import('./pages/TermDetail'));
const Contribute = lazy(() => import('./pages/Contribute'));
const Moderation = lazy(() => import('./pages/Moderation'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'profile'>('login');

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

  const openAuthModal = (mode: 'login' | 'register' | 'profile' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <AuthProvider>
        <AppWrapper>
          <Header 
            onMenuToggle={toggleSidebar}
            onThemeToggle={toggleTheme}
            isDarkMode={isDarkMode}
            onAuthClick={openAuthModal}
          />
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={closeSidebar}
            onAuthClick={openAuthModal}
          />
          <MainContent>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home onAuthClick={openAuthModal} />} />
                <Route path="/term/:term" element={<TermDetail />} />
                <Route path="/contribute" element={<Contribute onAuthClick={openAuthModal} />} />
                <Route path="/moderation" element={<Moderation />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </MainContent>
          <Footer />
          <FloatingContributeButton onAuthClick={openAuthModal} />
          <AuthModal 
            isOpen={isAuthModalOpen}
            onClose={closeAuthModal}
            initialMode={authModalMode}
          />
        </AppWrapper>
      </AuthProvider>
    </>
  );
}

export default App;
