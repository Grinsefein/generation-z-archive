import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import styled from 'styled-components';
import { Button } from './Button';

const ProfileContainer = styled.div`
  background-color: var(--current-card-bg);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  margin: 0 0 0.25rem 0;
  color: var(--current-text);
`;

const UserEmail = styled.p`
  color: var(--current-text);
  opacity: 0.7;
  margin: 0;
  font-size: 0.9rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`;

const StatCard = styled.div`
  background: rgba(14, 165, 233, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid rgba(14, 165, 233, 0.1);
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: var(--current-text);
  opacity: 0.8;
  font-size: 0.9rem;
`;

const SectionTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.2rem;
  margin: 2rem 0 1rem 0;
  color: var(--current-text);
`;

const ContributionsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const ContributionItem = styled.div`
  background: var(--current-bg);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ContributionTitle = styled.div`
  font-weight: 600;
  color: var(--current-text);
`;

const ContributionStatus = styled.span<{ status: string }>`
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

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--current-text);
  opacity: 0.7;
`;

interface UserProfileProps {
  onClose?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user, signOut } = useAuth();
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalContributions: 0,
    approvedContributions: 0,
    pendingContributions: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user contributions
      const { data: contributionsData, error: contributionsError } = await supabase
        .from('contributions')
        .select('*')
        .eq('submitted_by', user?.id)
        .order('submitted_at', { ascending: false });

      if (contributionsError) {
        console.error('Error fetching contributions:', contributionsError);
        return;
      }

      setContributions(contributionsData || []);

      // Calculate stats
      const total = contributionsData?.length || 0;
      const approved = contributionsData?.filter(c => c.status === 'approved').length || 0;
      const pending = contributionsData?.filter(c => c.status === 'pending').length || 0;

      setStats({
        totalContributions: total,
        approvedContributions: approved,
        pendingContributions: pending
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    if (onClose) {
      onClose();
    }
  };

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const initials = getInitials(displayName);

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar>{initials}</Avatar>
        <UserInfo>
          <UserName>{displayName}</UserName>
          <UserEmail>{user.email}</UserEmail>
        </UserInfo>
        <Button onClick={handleSignOut} style={{ background: '#ef4444' }}>
          Sign Out
        </Button>
      </ProfileHeader>

      <StatsGrid>
        <StatCard>
          <StatNumber>{stats.totalContributions}</StatNumber>
          <StatLabel>Total Contributions</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.approvedContributions}</StatNumber>
          <StatLabel>Approved Terms</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.pendingContributions}</StatNumber>
          <StatLabel>Pending Review</StatLabel>
        </StatCard>
      </StatsGrid>

      <SectionTitle>Your Contributions</SectionTitle>
      {loading ? (
        <EmptyState>Loading your contributions...</EmptyState>
      ) : contributions.length === 0 ? (
        <EmptyState>
          You haven't contributed any terms yet. 
          <br />
          <Button 
            onClick={onClose}
            style={{ marginTop: '1rem' }}
          >
            Start Contributing
          </Button>
        </EmptyState>
      ) : (
        <ContributionsList>
          {contributions.map((contribution) => (
            <ContributionItem key={contribution.id}>
              <ContributionTitle>
                {contribution.icon} {contribution.title}
              </ContributionTitle>
              <ContributionStatus status={contribution.status}>
                {contribution.status}
              </ContributionStatus>
            </ContributionItem>
          ))}
        </ContributionsList>
      )}
    </ProfileContainer>
  );
};

export default UserProfile;
