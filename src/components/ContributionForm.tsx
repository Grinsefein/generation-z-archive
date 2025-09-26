import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from './Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const FormContainer = styled.div`
  background-color: var(--current-card-bg);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const FormTitle = styled.h2`
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 1rem;
  background-color: var(--current-bg);
  color: var(--current-text);
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Select = styled.select`
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

const ExampleInput = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const RemoveButton = styled.button`
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.8rem;
  
  &:hover {
    background: #ff3742;
  }
`;

const AddButton = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  
  &:hover {
    background: #0ea5e9;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4757;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const FormSuccessMessage = styled.div`
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

const SuccessModal = styled.div`
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

const SuccessModalContent = styled.div`
  background: white;
  padding: 3rem 2rem;
  border-radius: 16px;
  text-align: center;
  max-width: 500px;
  margin: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
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

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 0.6s ease-out;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
`;

const SuccessTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.8rem;
  color: #10b981;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ModalButton = styled(Button)`
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(14, 165, 233, 0.3);
  }
`;

const LoginPrompt = styled.div`
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(236, 72, 153, 0.1));
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 2rem;
  border: 2px solid rgba(14, 165, 233, 0.2);
`;

const LoginTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--current-text);
`;

const LoginDescription = styled.p`
  color: var(--current-text);
  opacity: 0.8;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const LoginButton = styled(Button)`
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(14, 165, 233, 0.3);
  }
`;

interface ContributionFormProps {
  onSubmit?: () => void;
  onAuthClick?: () => void;
}

const ContributionForm: React.FC<ContributionFormProps> = ({ onSubmit, onAuthClick }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    icon: '',
    category: '',
    definition: '',
    origin: '',
    examples: [''],
    relatedTerms: ['']
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const categories = [
    'Slang', 'Meme', 'Trend', 'Gaming', 'Social Media', 'Music', 'Fashion', 'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleExampleChange = (index: number, value: string) => {
    const newExamples = [...formData.examples];
    newExamples[index] = value;
    setFormData(prev => ({
      ...prev,
      examples: newExamples
    }));
  };

  const addExample = () => {
    setFormData(prev => ({
      ...prev,
      examples: [...prev.examples, '']
    }));
  };

  const removeExample = (index: number) => {
    if (formData.examples.length > 1) {
      const newExamples = formData.examples.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        examples: newExamples
      }));
    }
  };

  const handleRelatedTermChange = (index: number, value: string) => {
    const newRelatedTerms = [...formData.relatedTerms];
    newRelatedTerms[index] = value;
    setFormData(prev => ({
      ...prev,
      relatedTerms: newRelatedTerms
    }));
  };

  const addRelatedTerm = () => {
    setFormData(prev => ({
      ...prev,
      relatedTerms: [...prev.relatedTerms, '']
    }));
  };

  const removeRelatedTerm = (index: number) => {
    if (formData.relatedTerms.length > 1) {
      const newRelatedTerms = formData.relatedTerms.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        relatedTerms: newRelatedTerms
      }));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Term title is required');
      return false;
    }
    if (!formData.definition.trim()) {
      setError('Definition is required');
      return false;
    }
    if (!formData.category) {
      setError('Category is required');
      return false;
    }
    if (formData.examples.every(example => !example.trim())) {
      setError('At least one usage example is required');
      return false;
    }
    return true;
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please sign in to contribute terms');
      if (onAuthClick) {
        setTimeout(() => onAuthClick(), 1000);
      }
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await supabase
        .from('contributions')
        .insert({
          title: formData.title.trim(),
          icon: formData.icon.trim() || '📝',
          category: formData.category,
          definition: formData.definition.trim(),
          origin: formData.origin.trim(),
          examples: formData.examples.filter(example => example.trim()),
          related_terms: formData.relatedTerms.filter(term => term.trim()),
          submitted_by: user.id,
          status: 'pending'
        });

      if (error) {
        throw error;
      }

      setSuccess('Thank you for your contribution! Your term has been submitted for review and will be published once approved by our moderators.');
      setShowSuccessModal(true);
      setFormData({
        title: '',
        icon: '',
        category: '',
        definition: '',
        origin: '',
        examples: [''],
        relatedTerms: ['']
      });
      
      if (onSubmit) {
        onSubmit();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit contribution. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showSuccessModal && (
        <SuccessModal onClick={closeSuccessModal}>
          <SuccessModalContent onClick={(e) => e.stopPropagation()}>
            <SuccessIcon>🎉</SuccessIcon>
            <SuccessTitle>Contribution Submitted!</SuccessTitle>
            <SuccessMessage>
              Thank you for helping us grow SkibidiDB! Your term has been submitted for review 
              and will be published once approved by our moderators. You'll be notified when it goes live!
            </SuccessMessage>
            <ModalButton onClick={closeSuccessModal}>
              Continue Contributing
            </ModalButton>
          </SuccessModalContent>
        </SuccessModal>
      )}
      
      <FormContainer>
        <FormTitle>Contribute a New Term</FormTitle>
        
        {!user && (
          <LoginPrompt>
            <LoginTitle>Sign In to Contribute</LoginTitle>
            <LoginDescription>
              Create an account or sign in to contribute new terms to SkibidiDB. 
              Your contributions help build the ultimate Gen Z dictionary!
            </LoginDescription>
            <LoginButton onClick={onAuthClick}>
              Sign In / Sign Up
            </LoginButton>
          </LoginPrompt>
        )}
        
        <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Term Title *</Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., Skibidi, Rizz, No Cap"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="icon">Icon/Emoji</Label>
          <Input
            id="icon"
            type="text"
            value={formData.icon}
            onChange={(e) => handleInputChange('icon', e.target.value)}
            placeholder="🚽, 😎, 🧢"
            maxLength={10}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="category">Category *</Label>
          <Select
            id="category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="definition">Definition *</Label>
          <TextArea
            id="definition"
            value={formData.definition}
            onChange={(e) => handleInputChange('definition', e.target.value)}
            placeholder="Provide a clear and comprehensive definition of the term..."
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="origin">Origin/Etymology</Label>
          <TextArea
            id="origin"
            value={formData.origin}
            onChange={(e) => handleInputChange('origin', e.target.value)}
            placeholder="Where did this term come from? Any historical context or background information..."
          />
        </FormGroup>

        <FormGroup>
          <Label>Usage Examples *</Label>
          {formData.examples.map((example, index) => (
            <ExampleInput key={index}>
              <Input
                type="text"
                value={example}
                onChange={(e) => handleExampleChange(index, e.target.value)}
                placeholder={`Example ${index + 1}: "Your example here..."`}
              />
              {formData.examples.length > 1 && (
                <RemoveButton type="button" onClick={() => removeExample(index)}>
                  Remove
                </RemoveButton>
              )}
            </ExampleInput>
          ))}
          <AddButton type="button" onClick={addExample}>
            + Add Example
          </AddButton>
        </FormGroup>

        <FormGroup>
          <Label>Related Terms</Label>
          {formData.relatedTerms.map((term, index) => (
            <ExampleInput key={index}>
              <Input
                type="text"
                value={term}
                onChange={(e) => handleRelatedTermChange(index, e.target.value)}
                placeholder="Related term..."
              />
              {formData.relatedTerms.length > 1 && (
                <RemoveButton type="button" onClick={() => removeRelatedTerm(index)}>
                  Remove
                </RemoveButton>
              )}
            </ExampleInput>
          ))}
          <AddButton type="button" onClick={addRelatedTerm}>
            + Add Related Term
          </AddButton>
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <FormSuccessMessage>{success}</FormSuccessMessage>}

        <Button 
          type="submit" 
          disabled={isSubmitting}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner />
              Submitting...
            </>
          ) : (
            'Submit Contribution'
          )}
        </Button>
      </form>
    </FormContainer>
    </>
  );
};

export default ContributionForm;
