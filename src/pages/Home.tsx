import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { Button } from '../components/Button';
import Card from '../components/Card';
import styled from 'styled-components';

const HomeWrapper = styled.div`
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 200px);
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 3rem;
`;

const HeroTitle = styled.h1`
  font-family: var(--font-heading);
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: var(--current-text);
  opacity: 0.8;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const QuickLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const SectionTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 2rem;
  margin: 3rem 0 1.5rem 0;
  color: var(--current-text);
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
`;

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    // Navigate to search results or term detail
    navigate(`/term/${encodeURIComponent(query)}`);
  };

  const handleRandomTerm = () => {
    const randomTerms = ['Skibidi', 'Rizz', 'No Cap', 'Slay', 'Periodt'];
    const randomTerm = randomTerms[Math.floor(Math.random() * randomTerms.length)];
    navigate(`/term/${encodeURIComponent(randomTerm)}`);
  };

  const handlePopularTerms = () => {
    // Navigate to popular terms page or filter
    console.log('Show popular terms');
  };

  const handleNewTerms = () => {
    // Navigate to new terms page or filter
    console.log('Show new terms');
  };

  const mockTerms = [
    {
      title: 'Skibidi',
      icon: '🚽',
      category: 'Meme',
      description: 'A popular meme term that originated from a viral video series featuring toilet characters.',
      onClick: () => navigate('/term/Skibidi')
    },
    {
      title: 'Rizz',
      icon: '😎',
      category: 'Slang',
      description: 'Short for "charisma" - used to describe someone with natural charm and appeal.',
      onClick: () => navigate('/term/Rizz')
    },
    {
      title: 'No Cap',
      icon: '🧢',
      category: 'Slang',
      description: 'Means "no lie" or "for real" - used to emphasize that you\'re telling the truth.',
      onClick: () => navigate('/term/No-Cap')
    },
    {
      title: 'Slay',
      icon: '💅',
      category: 'Slang',
      description: 'To do something exceptionally well, often used in the context of fashion or performance.',
      onClick: () => navigate('/term/Slay')
    },
    {
      title: 'Main Character',
      icon: '🎭',
      category: 'Trend',
      description: 'Refers to having "main character energy" - being the protagonist of your own story.',
      onClick: () => navigate('/term/Main-Character')
    },
    {
      title: 'Touch Grass',
      icon: '🌱',
      category: 'Slang',
      description: 'A phrase telling someone to go outside and get offline, often used when someone is too online.',
      onClick: () => navigate('/term/Touch-Grass')
    }
  ];

  return (
    <HomeWrapper>
      <HeroSection>
        <HeroTitle>SkibidiDB</HeroTitle>
        <HeroSubtitle>
          Your ultimate guide to Generation Z slang, memes, and internet culture. 
          Discover the meaning behind the latest trends and viral terms.
        </HeroSubtitle>
        <SearchBar onSearch={handleSearch} />
      </HeroSection>

      <QuickLinks>
        <Button onClick={handleRandomTerm}>🎲 Random Term</Button>
        <Button onClick={handlePopularTerms}>🔥 Popular Terms</Button>
        <Button onClick={handleNewTerms}>✨ New Terms</Button>
      </QuickLinks>

      <StatsSection>
        <StatCard>
          <StatNumber>500+</StatNumber>
          <StatLabel>Terms & Definitions</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>50K+</StatNumber>
          <StatLabel>Monthly Searches</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>10K+</StatNumber>
          <StatLabel>Active Users</StatLabel>
        </StatCard>
      </StatsSection>

      <SectionTitle>Latest Terms</SectionTitle>
      <Grid>
        {mockTerms.map((term, index) => (
          <Card
            key={index}
            title={term.title}
            icon={term.icon}
            category={term.category}
            onClick={term.onClick}
          >
            <p>{term.description}</p>
          </Card>
        ))}
      </Grid>
    </HomeWrapper>
  );
};

export default Home;
