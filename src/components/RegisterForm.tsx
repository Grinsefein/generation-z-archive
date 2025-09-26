import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { Button } from './Button';

const RegisterContainer = styled.div`
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

const PasswordRequirements = styled.div`
  background: rgba(14, 165, 233, 0.05);
  padding: 1rem;
  border-radius: 8px;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--current-text);
  opacity: 0.8;
`;

const Requirement = styled.div<{ met: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  
  &::before {
    content: '${props => props.met ? '✓' : '○'}';
    color: ${props => props.met ? '#2ed573' : '#6b7280'};
    font-weight: bold;
  }
`;

interface RegisterFormProps {
  onToggleMode: () => void;
  onClose?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode, onClose }) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    };
  };

  const passwordRequirements = validatePassword(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!Object.values(passwordRequirements).every(Boolean)) {
      setError('Password does not meet requirements');
      setLoading(false);
      return;
    }

    const { error } = await signUp(formData.email, formData.password, {
      full_name: formData.fullName,
      username: formData.username,
    });
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Account created! Please check your email to verify your account.');
      if (onClose) {
        setTimeout(onClose, 2000);
      }
    }
    
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  return (
    <RegisterContainer>
      <Title>Join SkibidiDB!</Title>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Your full name"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="Choose a username"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="your@email.com"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Create a strong password"
            required
          />
          <PasswordRequirements>
            <Requirement met={passwordRequirements.length}>
              At least 8 characters
            </Requirement>
            <Requirement met={passwordRequirements.uppercase}>
              One uppercase letter
            </Requirement>
            <Requirement met={passwordRequirements.lowercase}>
              One lowercase letter
            </Requirement>
            <Requirement met={passwordRequirements.number}>
              One number
            </Requirement>
          </PasswordRequirements>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
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
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
        
        <ToggleButton type="button" onClick={onToggleMode}>
          Already have an account? Sign in
        </ToggleButton>
      </form>
    </RegisterContainer>
  );
};

export default RegisterForm;
