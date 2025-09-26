import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background-color: var(--current-bg);
  color: var(--current-text);
  padding: 2rem 1rem;
  text-align: center;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 3rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FooterLink = styled.a`
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--secondary-color);
  }
`;

const Copyright = styled.p`
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
`;

const Footer: React.FC = () => {
  return (
    <FooterWrapper>
      <FooterContent>
        <FooterLinks>
          <FooterLink href="#">About</FooterLink>
          <FooterLink href="#">Contribute</FooterLink>
          <FooterLink href="#">Categories</FooterLink>
          <FooterLink href="#">Random</FooterLink>
          <FooterLink href="#">Contact</FooterLink>
        </FooterLinks>
        <Copyright>&copy; 2025 SkibidiDB - Your Ultimate Gen Z Dictionary</Copyright>
      </FooterContent>
    </FooterWrapper>
  );
};

export default Footer;
