import React, { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SidebarWrapper = styled.aside<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: ${(props) => (props.$isOpen ? '0' : '-100%')};
  width: 320px;
  height: 100%;
  background-color: var(--current-bg);
  color: var(--current-text);
  padding: 2rem 1.5rem;
  transition: right 0.3s ease-in-out;
  z-index: 50;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  box-shadow: ${(props) => (props.$isOpen ? '-4px 0 20px rgba(0, 0, 0, 0.1)' : 'none')};
  backdrop-filter: blur(10px);
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
  opacity: ${(props) => (props.$isOpen ? '1' : '0')};
  visibility: ${(props) => (props.$isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
`;

const SidebarTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  margin: 0 0 2rem 0;
  color: var(--primary-color);
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.5rem;
`;

const NavButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 1rem 1.25rem;
  background: none;
  border: none;
  color: var(--current-text);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(236, 72, 153, 0.1));
    color: var(--primary-color);
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateX(2px) scale(0.98);
  }
`;

const CategoryList = styled.ul<{ isOpen: boolean }>`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: ${(props) => (props.isOpen ? '300px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
  margin-left: 1rem;
`;

const CategoryItem = styled.li`
  margin-bottom: 0.25rem;
`;

const CategoryLink = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  color: var(--current-text);
  font-size: 0.9rem;
  font-weight: 400;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  margin-left: 0.5rem;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 0;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-radius: 2px;
    transition: height 0.3s ease;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.08), rgba(236, 72, 153, 0.08));
    color: var(--primary-color);
    transform: translateX(8px);
    box-shadow: 0 2px 8px rgba(14, 165, 233, 0.15);

    &::before {
      height: 60%;
    }
  }

  &:active {
    transform: translateX(6px) scale(0.98);
  }
`;

const SpecialButton = styled.button`
  width: 100%;
  text-align: center;
  padding: 1.2rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border: none;
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 1.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
  animation: contributePulse 3s infinite;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }

  &::after {
    content: '✨';
    position: absolute;
    top: -5px;
    right: -5px;
    font-size: 1.2rem;
    animation: sparkle 2s infinite;
  }

  @keyframes contributePulse {
    0%,
    100% {
      box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 6px 20px rgba(14, 165, 233, 0.5);
      transform: scale(1.02);
    }
  }

  @keyframes sparkle {
    0%,
    100% {
      transform: rotate(0deg) scale(1);
      opacity: 1;
    }
    50% {
      transform: rotate(180deg) scale(1.2);
      opacity: 0.8;
    }
  }

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 10px 30px rgba(14, 165, 233, 0.5);
    animation: none;

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-2px) scale(1.02);
  }
`;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthClick?: (mode?: 'login' | 'register' | 'profile') => void;
}

const Sidebar: React.FC<SidebarProps> = memo(({ isOpen, onClose, onAuthClick }) => {
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = [
    { name: 'Slang', icon: '🗣️', items: ['Gen Z Slang', 'Internet Slang', 'Regional Slang'] },
    { name: 'Memes', icon: '😂', items: ['Classic Memes', 'Trending Memes', 'Meme Formats'] },
    { name: 'Trends', icon: '📈', items: ['TikTok Trends', 'YouTube Trends', 'Twitter Trends'] },
    { name: 'Emojis', icon: '😊', items: ['Emoji Meanings', 'Symbol Language', 'Reactions'] },
    { name: 'Challenges', icon: '🎯', items: ['Viral Challenges', 'Hashtags', 'Dance Trends'] },
    { name: 'Aesthetics', icon: '🎨', items: ['Subcultures', 'Fashion', 'Visual Styles'] }
  ];

  const toggleCategory = useCallback((categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  }, [expandedCategory]);

  const handleRandomTerm = useCallback(() => {
    const randomTerms = ['Skibidi', 'Rizz', 'No Cap', 'Slay', 'Periodt'];
    const randomTerm = randomTerms[Math.floor(Math.random() * randomTerms.length)];
    navigate(`/term/${encodeURIComponent(randomTerm)}`);
    onClose();
  }, [navigate, onClose]);

  const handleContribute = useCallback(() => {
    navigate('/contribute');
    onClose();
  }, [navigate, onClose]);

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={onClose} />
      <SidebarWrapper $isOpen={isOpen}>
        <SidebarTitle>Navigation</SidebarTitle>
        <nav>
          <NavList>
            {categories.map((category) => (
              <NavItem key={category.name}>
                <NavButton onClick={() => toggleCategory(category.name)}>
                  <span>{category.icon} {category.name}</span>
                  <span>{expandedCategory === category.name ? '−' : '+'}</span>
                </NavButton>
                <CategoryList isOpen={expandedCategory === category.name}>
                  {category.items.map((item) => (
                    <CategoryItem key={item}>
                      <CategoryLink>{item}</CategoryLink>
                    </CategoryItem>
                  ))}
                </CategoryList>
              </NavItem>
            ))}
            
            <NavItem>
              <NavButton onClick={() => onAuthClick?.('profile')}>👤 Login/Profile</NavButton>
            </NavItem>
            
            <NavItem>
              <NavButton onClick={handleRandomTerm}>🎲 Random Term</NavButton>
            </NavItem>
            
            <NavItem>
              <SpecialButton onClick={handleContribute}>✨ Contribute a Term</SpecialButton>
            </NavItem>
          </NavList>
        </nav>
      </SidebarWrapper>
    </>
  );
});

export default Sidebar;
