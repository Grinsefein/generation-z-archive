import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { Button } from './Button';

const LoginContainer = styled.div`
  background-color: var(--current-card-bg);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const Title = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--current-text);
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--current-text);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 1rem;
  background-color: var(--current-bg);
  color: var(--current-text);
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const ErrorMessage = styled.div`
  color: #ff4757;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: #2ed573;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 1rem;
  text-decoration: underline;
  
  &:hover {
    color: var(--secondary-color);
  }
`;

const ForgotPasswordButton = styled.button`
  background: none;
  border: none;
  color: var(--current-text);
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  opacity: 0.8;
  text-decoration: underline;
  
  &:hover {
    opacity: 1;
  }
`;

interface LoginFormProps {
  onToggleMode: () => void;
  onClose?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode, onClose }) => {
  const { signIn, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Login successful!');
      if (onClose) {
        setTimeout(onClose, 1000);
      }
    }
    
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const { error } = await resetPassword(email);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Password reset email sent! Check your inbox.');
    }
    
    setLoading(false);
  };

  return (
    <LoginContainer>
      <Title>Welcome Back!</Title>
      
      {showForgotPassword ? (
        <div>
          <p style={{ marginBottom: '1rem', color: 'var(--current-text)', opacity: 0.8 }}>
            Enter your email address and we'll send you a password reset link.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }}>
            <FormGroup>
              <Label htmlFor="reset-email">Email Address</Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </FormGroup>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}
            
            <Button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
            
            <ToggleButton type="button" onClick={() => setShowForgotPassword(false)}>
              Back to Login
            </ToggleButton>
          </form>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
          </FormGroup>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          <Button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
          
          <ForgotPasswordButton type="button" onClick={() => setShowForgotPassword(true)}>
            Forgot your password?
          </ForgotPasswordButton>
          
          <ToggleButton type="button" onClick={onToggleMode}>
            Don't have an account? Sign up
          </ToggleButton>
        </form>
      )}
    </LoginContainer>
  );
};

export default LoginForm;
