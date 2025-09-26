import React from 'react';
import styled from 'styled-components';

const CardWrapper = styled.div`
  background-color: var(--current-card-bg);
  color: var(--current-text);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
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
    transition: left 0.6s ease;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(14, 165, 233, 0.2);
    border-color: var(--primary-color);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-4px) scale(1.01);
  }
  
  h3 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    font-family: var(--font-heading);
    font-size: 1.25rem;
    color: var(--primary-color);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  p {
    margin: 0 0 1rem 0;
    line-height: 1.6;
    color: var(--current-text);
    opacity: 0.9;
  }
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    transition: all 0.2s ease;
    
    &:hover {
      color: var(--secondary-color);
      transform: translateX(2px);
    }
  }
`;

const CardIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 0.5rem;
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 0.9rem;
  color: #6b7280;
`;

const CategoryTag = styled.span`
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

interface CardProps {
  title: string;
  icon?: string;
  category?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, icon, category, children, onClick }) => {
  return (
    <CardWrapper onClick={onClick}>
      <h3>
        {icon && <CardIcon>{icon}</CardIcon>}
        {title}
      </h3>
      {children}
      <CardMeta>
        {category && <CategoryTag>{category}</CategoryTag>}
        <span>Read more →</span>
      </CardMeta>
    </CardWrapper>
  );
};

export default Card;
