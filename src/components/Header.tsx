import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const HeaderWrapper = styled.header`
  background-color: var(--current-bg);
  color: var(--current-text);
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
`;

const Logo = styled.h1`
  font-family: var(--font-heading);
  font-size: 1.75rem;
  margin: 0;
  color: var(--primary-color);
  font-weight: 700;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HamburgerMenu = styled.button`
  background: none;
  border: none;
  color: var(--current-text);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(14, 165, 233, 0.1);
    color: var(--primary-color);
  }
`;

const DarkModeToggle = styled.button`
  background: none;
  border: none;
  color: var(--current-text);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(14, 165, 233, 0.1);
    color: var(--primary-color);
  }
`;

const AuthButton = styled.button`
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border: none;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

interface HeaderProps {
  onMenuToggle: () => void;
  onThemeToggle: () => void;
  isDarkMode: boolean;
  onAuthClick: (mode?: 'login' | 'register' | 'profile') => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, onThemeToggle, isDarkMode, onAuthClick }) => {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = getInitials(displayName);

  return (
    <HeaderWrapper>
      <Logo>SkibidiDB</Logo>
      <HeaderControls>
        <DarkModeToggle onClick={onThemeToggle} title="Toggle dark mode">
          {isDarkMode ? '☀️' : '🌙'}
        </DarkModeToggle>
        {user ? (
          <UserAvatar 
            onClick={() => onAuthClick('profile')} 
            title={`${displayName} - Click to view profile`}
          >
            {initials}
          </UserAvatar>
        ) : (
          <AuthButton onClick={() => onAuthClick('login')}>
            Sign In
          </AuthButton>
        )}
        <HamburgerMenu onClick={onMenuToggle} title="Open menu">
          ☰
        </HamburgerMenu>
      </HeaderControls>
    </HeaderWrapper>
  );
};

export default Header;
