import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { supabase, Contribution } from '../lib/supabase';
import { Button } from '../components/Button';

const ModerationWrapper = styled.div`
  padding: 2rem 1rem;
  max-width: 1000px;
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

const Title = styled.h1`
  font-family: var(--font-heading);
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--current-text);
  text-align: center;
`;

const ContributionCard = styled.div`
  background-color: var(--current-card-bg);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const ContributionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TermTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--current-text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${props => 
    props.status === 'pending' ? '#fbbf24' :
    props.status === 'approved' ? '#10b981' : '#ef4444'
  };
  color: white;
`;

const ContributionContent = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  margin: 1rem 0 0.5rem 0;
  color: var(--current-text);
`;

const SectionContent = styled.p`
  color: var(--current-text);
  opacity: 0.9;
  line-height: 1.6;
`;

const ExamplesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
`;

const ExampleItem = styled.li`
  background: rgba(14, 165, 233, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  color: var(--current-text);
  font-style: italic;
  
  &::before {
    content: '"';
    color: var(--primary-color);
    font-weight: bold;
  }
  
  &::after {
    content: '"';
    color: var(--primary-color);
    font-weight: bold;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ApproveButton = styled(Button)`
  background: #10b981;
  color: white;
  
  &:hover {
    background: #059669;
  }
`;

const RejectButton = styled(Button)`
  background: #ef4444;
  color: white;
  
  &:hover {
    background: #dc2626;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--current-text);
  opacity: 0.7;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--current-text);
  opacity: 0.7;
`;

const Moderation: React.FC = () => {
  const navigate = useNavigate();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = async () => {
    try {
      const { data, error } = await supabase
        .from('contributions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching contributions:', error);
        return;
      }

      setContributions(data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (contributionId: string) => {
    setProcessing(contributionId);
    
    try {
      // Move to terms table
      const contribution = contributions.find(c => c.id === contributionId);
      if (!contribution) return;

      const { error: insertError } = await supabase
        .from('terms')
        .insert({
          title: contribution.title,
          icon: contribution.icon,
          category: contribution.category,
          definition: contribution.definition,
          origin: contribution.origin,
          examples: contribution.examples,
          related_terms: contribution.related_terms,
          submitted_by: contribution.submitted_by,
          status: 'published'
        });

      if (insertError) {
        throw insertError;
      }

      // Update contribution status
      const { error: updateError } = await supabase
        .from('contributions')
        .update({ 
          status: 'approved',
          moderated_by: 'admin', // In a real app, this would be the current user
          moderated_at: new Date().toISOString()
        })
        .eq('id', contributionId);

      if (updateError) {
        throw updateError;
      }

      // Refresh the list
      await fetchContributions();
    } catch (err) {
      console.error('Error approving contribution:', err);
      alert('Failed to approve contribution. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (contributionId: string) => {
    setProcessing(contributionId);
    
    try {
      const { error } = await supabase
        .from('contributions')
        .update({ 
          status: 'rejected',
          moderated_by: 'admin', // In a real app, this would be the current user
          moderated_at: new Date().toISOString()
        })
        .eq('id', contributionId);

      if (error) {
        throw error;
      }

      // Refresh the list
      await fetchContributions();
    } catch (err) {
      console.error('Error rejecting contribution:', err);
      alert('Failed to reject contribution. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <ModerationWrapper>
        <LoadingMessage>Loading contributions...</LoadingMessage>
      </ModerationWrapper>
    );
  }

  return (
    <ModerationWrapper>
      <BackButton onClick={() => navigate('/')}>
        ← Back to Home
      </BackButton>

      <Title>Moderation Dashboard</Title>

      {contributions.length === 0 ? (
        <EmptyMessage>
          No contributions to review at the moment.
        </EmptyMessage>
      ) : (
        contributions.map((contribution) => (
          <ContributionCard key={contribution.id}>
            <ContributionHeader>
              <TermTitle>
                {contribution.icon} {contribution.title}
              </TermTitle>
              <StatusBadge status={contribution.status}>
                {contribution.status}
              </StatusBadge>
            </ContributionHeader>

            <ContributionContent>
              <SectionTitle>Category</SectionTitle>
              <SectionContent>{contribution.category}</SectionContent>

              <SectionTitle>Definition</SectionTitle>
              <SectionContent>{contribution.definition}</SectionContent>

              {contribution.origin && (
                <>
                  <SectionTitle>Origin</SectionTitle>
                  <SectionContent>{contribution.origin}</SectionContent>
                </>
              )}

              {contribution.examples && contribution.examples.length > 0 && (
                <>
                  <SectionTitle>Examples</SectionTitle>
                  <ExamplesList>
                    {contribution.examples.map((example, index) => (
                      <ExampleItem key={index}>{example}</ExampleItem>
                    ))}
                  </ExamplesList>
                </>
              )}

              {contribution.related_terms && contribution.related_terms.length > 0 && (
                <>
                  <SectionTitle>Related Terms</SectionTitle>
                  <SectionContent>
                    {contribution.related_terms.join(', ')}
                  </SectionContent>
                </>
              )}

              <SectionTitle>Submitted By</SectionTitle>
              <SectionContent>{contribution.submitted_by}</SectionContent>

              <SectionTitle>Submitted At</SectionTitle>
              <SectionContent>
                {new Date(contribution.submitted_at).toLocaleString()}
              </SectionContent>
            </ContributionContent>

            {contribution.status === 'pending' && (
              <ActionButtons>
                <ApproveButton 
                  onClick={() => handleApprove(contribution.id)}
                  disabled={processing === contribution.id}
                >
                  {processing === contribution.id ? 'Processing...' : 'Approve'}
                </ApproveButton>
                <RejectButton 
                  onClick={() => handleReject(contribution.id)}
                  disabled={processing === contribution.id}
                >
                  {processing === contribution.id ? 'Processing...' : 'Reject'}
                </RejectButton>
              </ActionButtons>
            )}
          </ContributionCard>
        ))
      )}
    </ModerationWrapper>
  );
};

export default Moderation;
