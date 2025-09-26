import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ContributionForm from '../components/ContributionForm';
import { Button } from '../components/Button';

const ContributeWrapper = styled.div`
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
  min-height: calc(100vh - 200px);
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(14, 165, 233, 0.1);
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-family: var(--font-heading);
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: var(--current-text);
  opacity: 0.8;
  max-width: 600px;
  margin: 0 auto 2rem auto;
`;

const GuidelinesSection = styled.div`
  background-color: var(--current-card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const GuidelinesTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--current-text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const GuidelinesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const GuidelineItem = styled.li`
  padding: 0.5rem 0;
  color: var(--current-text);
  opacity: 0.9;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  
  &::before {
    content: '✓';
    color: var(--primary-color);
    font-weight: bold;
    margin-top: 0.1rem;
  }
`;

const FeatureHighlights = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const FeatureCard = styled.div`
  background: rgba(14, 165, 233, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(14, 165, 233, 0.1);
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--current-text);
`;

const FeatureDescription = styled.p`
  color: var(--current-text);
  opacity: 0.8;
  font-size: 0.9rem;
  line-height: 1.5;
`;

interface ContributeProps {
  onAuthClick?: () => void;
}

const Contribute: React.FC<ContributeProps> = ({ onAuthClick }) => {
  const navigate = useNavigate();

  const handleSubmissionSuccess = () => {
    // Optionally show a success message or redirect
    console.log('Contribution submitted successfully');
  };

  return (
    <ContributeWrapper>
      <BackButton onClick={() => navigate('/')}>
        ← Back to Home
      </BackButton>

      <HeaderSection>
        <Title>Contribute to SkibidiDB</Title>
        <Subtitle>
          Help us expand our dictionary by submitting new terms, definitions, and examples. 
          Your contributions will be reviewed by our community moderators.
        </Subtitle>
      </HeaderSection>

      <GuidelinesSection>
        <GuidelinesTitle>📝 Submission Guidelines</GuidelinesTitle>
        <GuidelinesList>
          <GuidelineItem>
            <strong>Be accurate:</strong> Provide clear, accurate definitions with proper context
          </GuidelineItem>
          <GuidelineItem>
            <strong>Include examples:</strong> Add real usage examples to help others understand the term
          </GuidelineItem>
          <GuidelineItem>
            <strong>Check for duplicates:</strong> Make sure the term isn't already in our database
          </GuidelineItem>
          <GuidelineItem>
            <strong>Be respectful:</strong> Avoid offensive, discriminatory, or harmful content
          </GuidelineItem>
          <GuidelineItem>
            <strong>Provide context:</strong> Include origin information when possible
          </GuidelineItem>
          <GuidelineItem>
            <strong>Use proper formatting:</strong> Write in clear, readable language
          </GuidelineItem>
        </GuidelinesList>
      </GuidelinesSection>

      <FeatureHighlights>
        <FeatureCard>
          <FeatureIcon>🎯</FeatureIcon>
          <FeatureTitle>Easy Submission</FeatureTitle>
          <FeatureDescription>
            Simple form with helpful guidance to make contributing quick and easy.
          </FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureIcon>👥</FeatureIcon>
          <FeatureTitle>Community Driven</FeatureTitle>
          <FeatureDescription>
            Your contributions help build the most comprehensive Gen Z dictionary.
          </FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureIcon>⚡</FeatureIcon>
          <FeatureTitle>Quick Review</FeatureTitle>
          <FeatureDescription>
            Our moderators review submissions quickly to get your terms published fast.
          </FeatureDescription>
        </FeatureCard>
      </FeatureHighlights>

      <ContributionForm onSubmit={handleSubmissionSuccess} onAuthClick={onAuthClick} />

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Button onClick={() => navigate('/')}>
          Browse Existing Terms
        </Button>
      </div>
    </ContributeWrapper>
  );
};

export default Contribute;
