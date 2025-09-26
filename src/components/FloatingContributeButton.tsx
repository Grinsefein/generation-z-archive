import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const FloatingButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.4);
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: float 3s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.1);
    box-shadow: 0 8px 30px rgba(14, 165, 233, 0.6);
    animation: none;
  }
  
  &:active {
    transform: translateY(-2px) scale(1.05);
  }
  
  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
`;

const Tooltip = styled.div<{ isVisible: boolean }>`
  position: absolute;
  right: 70px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  white-space: nowrap;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  pointer-events: none;
  
  &::after {
    content: '';
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-left-color: rgba(0, 0, 0, 0.9);
  }
  
  @media (max-width: 768px) {
    right: 60px;
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`;

interface FloatingContributeButtonProps {
  show?: boolean;
}

const FloatingContributeButton: React.FC<FloatingContributeButtonProps> = ({ show = true }) => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 300;
      setHasScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    navigate('/contribute');
  };

  if (!show) return null;

  return (
    <FloatingButton
      onClick={handleClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      title="Contribute a new term"
    >
      ✨
      <Tooltip isVisible={showTooltip}>
        {hasScrolled ? 'Contribute a term' : 'Share your knowledge!'}
      </Tooltip>
    </FloatingButton>
  );
};

export default FloatingContributeButton;
