import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NotFoundWrapper = styled.div`
  padding: 2rem;
  text-align: center;
`;

const NotFound: React.FC = () => {
  return (
    <NotFoundWrapper>
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Go to Homepage</Link>
    </NotFoundWrapper>
  );
};

export default NotFound;
