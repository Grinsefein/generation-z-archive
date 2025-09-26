import React from 'react';
import styled from 'styled-components';

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

interface HeaderProps {
  onMenuToggle: () => void;
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, onThemeToggle, isDarkMode }) => {
  return (
    <HeaderWrapper>
      <Logo>SkibidiDB</Logo>
      <HeaderControls>
        <DarkModeToggle onClick={onThemeToggle} title="Toggle dark mode">
          {isDarkMode ? '☀️' : '🌙'}
        </DarkModeToggle>
        <HamburgerMenu onClick={onMenuToggle} title="Open menu">
          ☰
        </HamburgerMenu>
      </HeaderControls>
    </HeaderWrapper>
  );
};

export default Header;
