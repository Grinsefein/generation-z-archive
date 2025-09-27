import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: var(--current-bg);
  color: var(--current-text);
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
`;

const BackLink = styled(Link)`
  font-size: 1rem;
  color: var(--primary-color);
  text-decoration: none;
  border: 1px solid var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--primary-color);
    color: white;
  }
`;

const NotAuthorized: React.FC = () => {
  return (
    <Container>
      <Title>Access Denied</Title>
      <Message>You do not have permission to view this page.</Message>
      <BackLink to="/">Go Back to Home</BackLink>
    </Container>
  );
};

export default NotAuthorized;