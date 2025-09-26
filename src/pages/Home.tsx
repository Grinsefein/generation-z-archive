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

const ContributeButton = styled(Button)`
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
  position: relative;
  overflow: hidden;
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(1.02);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
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

const ContributeSection = styled.div`
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(236, 72, 153, 0.1));
  padding: 3rem 2rem;
  border-radius: 16px;
  margin: 3rem 0;
  text-align: center;
  border: 2px solid rgba(14, 165, 233, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 70%);
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

const ContributeTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 2.2rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 1;
`;

const ContributeDescription = styled.p`
  font-size: 1.1rem;
  color: var(--current-text);
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 1;
`;

const ContributeCTA = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
`;

const PrimaryContributeButton = styled(ContributeButton)`
  font-size: 1.2rem;
  padding: 1.2rem 2.5rem;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3); }
    50% { box-shadow: 0 4px 25px rgba(14, 165, 233, 0.5); }
    100% { box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3); }
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  font-weight: 600;
  
  &:hover {
    background: var(--primary-color);
    color: white;
    transform: translateY(-2px);
  }
`;

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
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

  const handleContribute = () => {
    navigate('/contribute');
  };

  const handleLearnMore = () => {
    // Scroll to the contribute section or show more info
    const contributeSection = document.getElementById('contribute-section');
    if (contributeSection) {
      contributeSection.scrollIntoView({ behavior: 'smooth' });
    }
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
        <ContributeButton onClick={handleContribute}>
          ✨ Contribute a Term
        </ContributeButton>
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

      <ContributeSection id="contribute-section">
        <ContributeTitle>Help Us Grow! 🌱</ContributeTitle>
        <ContributeDescription>
          Know a term that's missing? Share your knowledge with the community! 
          Your contributions help make SkibidiDB the ultimate guide to Gen Z culture.
        </ContributeDescription>
        <ContributeCTA>
          <PrimaryContributeButton onClick={handleContribute}>
            🚀 Contribute Now
          </PrimaryContributeButton>
          <SecondaryButton onClick={handleLearnMore}>
            Learn More
          </SecondaryButton>
        </ContributeCTA>
      </ContributeSection>
    </HomeWrapper>
  );
};

export default Home;
