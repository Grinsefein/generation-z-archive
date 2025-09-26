import React, { useState } from 'react';
import styled from 'styled-components';

const SidebarWrapper = styled.aside<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: ${props => props.isOpen ? '0' : '-100%'};
  width: 280px;
  height: 100%;
  background-color: var(--current-bg);
  color: var(--current-text);
  padding: 2rem 1.5rem;
  transition: left 0.3s ease-in-out;
  z-index: 50;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  box-shadow: ${props => props.isOpen ? '4px 0 20px rgba(0, 0, 0, 0.1)' : 'none'};
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
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
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: var(--current-text);
  font-size: 1rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &:hover {
    background-color: rgba(14, 165, 233, 0.1);
    color: var(--primary-color);
  }
`;

const CategoryList = styled.ul<{ isOpen: boolean }>`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: ${props => props.isOpen ? '300px' : '0'};
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
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  color: var(--current-text);
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(14, 165, 233, 0.1);
    color: var(--primary-color);
  }
`;

const SpecialButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border: none;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s ease;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  }
`;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = [
    { name: 'Slang', icon: '🗣️', items: ['Gen Z Slang', 'Internet Slang', 'Regional Slang'] },
    { name: 'Memes', icon: '😂', items: ['Classic Memes', 'Trending Memes', 'Meme Formats'] },
    { name: 'Trends', icon: '📈', items: ['TikTok Trends', 'YouTube Trends', 'Twitter Trends'] },
    { name: 'Emojis', icon: '😊', items: ['Emoji Meanings', 'Symbol Language', 'Reactions'] },
    { name: 'Challenges', icon: '🎯', items: ['Viral Challenges', 'Hashtags', 'Dance Trends'] },
    { name: 'Aesthetics', icon: '🎨', items: ['Subcultures', 'Fashion', 'Visual Styles'] }
  ];

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <SidebarWrapper isOpen={isOpen}>
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
              <NavButton>👤 Login/Profile</NavButton>
            </NavItem>
            
            <NavItem>
              <NavButton>🎲 Random Term</NavButton>
            </NavItem>
            
            <NavItem>
              <SpecialButton>✨ Contribute a Term</SpecialButton>
            </NavItem>
          </NavList>
        </nav>
      </SidebarWrapper>
    </>
  );
};

export default Sidebar;
