import React, { useState } from 'react';
import styled from 'styled-components';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import UserProfile from './UserProfile';
import { useAuth } from '../contexts/AuthContext';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: var(--current-bg);
  border-radius: 16px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalSlideIn 0.3s ease-out;
  
  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-50px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--current-text);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  z-index: 10;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: var(--primary-color);
  }
`;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'profile';
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const { user } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'profile'>(initialMode);

  React.useEffect(() => {
    if (user) {
      setMode('profile');
    } else {
      setMode(initialMode);
    }
  }, [user, initialMode]);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  const handleToggleMode = () => {
    if (mode === 'login') {
      setMode('register');
    } else {
      setMode('login');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <ModalOverlay onClick={handleBackdropClick}>
      <ModalContent>
        <CloseButton onClick={handleClose}>×</CloseButton>
        
        {user ? (
          <UserProfile onClose={handleClose} />
        ) : mode === 'login' ? (
          <LoginForm onToggleMode={handleToggleMode} onClose={handleClose} />
        ) : (
          <RegisterForm onToggleMode={handleToggleMode} onClose={handleClose} />
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default AuthModal;
