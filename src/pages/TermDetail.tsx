import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/Card';
import { Button } from '../components/Button';

const TermDetailWrapper = styled.div`
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

const TermHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const TermTitle = styled.h1`
  font-family: var(--font-heading);
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const TermIcon = styled.span`
  font-size: 3rem;
`;

const TermCategory = styled.div`
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 1rem;
`;

const TermDefinition = styled.div`
  background-color: var(--current-card-bg);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  margin: 2rem 0 1rem 0;
  color: var(--current-text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UsageExamples = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
`;

const ExampleBubble = styled.div`
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 20px 20px 20px 5px;
  max-width: 80%;
  margin-left: 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: -10px;
    bottom: 0;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-right-color: var(--primary-color);
    border-bottom: 0;
  }
`;

const TimelineContainer = styled.div`
  background-color: var(--current-card-bg);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
`;

const TimelineItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(14, 165, 233, 0.05);
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
`;

const TimelineDate = styled.div`
  font-weight: 600;
  color: var(--primary-color);
  margin-right: 1rem;
  min-width: 80px;
`;

const TimelineEvent = styled.div`
  flex: 1;
`;

const RelatedTerms = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`;

const RelatedTermCard = styled.div`
  background-color: var(--current-card-bg);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: var(--primary-color);
  }
`;

const PopularityChart = styled.div`
  background-color: var(--current-card-bg);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
`;

const ChartBar = styled.div<{ height: number }>`
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  height: ${props => props.height}px;
  border-radius: 4px;
  margin: 0.25rem;
  min-height: 20px;
  display: flex;
  align-items: end;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ChartContainer = styled.div`
  display: flex;
  align-items: end;
  height: 200px;
  margin: 1rem 0;
  gap: 0.5rem;
`;

const TermDetail: React.FC = () => {
  const { term } = useParams<{ term: string }>();
  const navigate = useNavigate();
  const [termData, setTermData] = useState<any>(null);

  useEffect(() => {
    // Mock data for the term
    const mockTermData = {
      'skibidi': {
        title: 'Skibidi',
        icon: '🚽',
        category: 'Meme',
        definition: 'A popular meme term that originated from a viral video series featuring anthropomorphic toilet characters. The term has become widely used in internet culture to refer to anything related to the series or as a general expression of excitement.',
        origin: 'The term "Skibidi" comes from the "Skibidi Toilet" series created by Alexey Gerasimov (DaFuq!?Boom!) on YouTube. The series features toilet characters with heads that can detach and attach to different bodies, creating a unique and absurd narrative.',
        examples: [
          'That new song is so skibidi!',
          'Skibidi toilet is taking over the internet',
          'I can\'t stop watching skibidi videos'
        ],
        timeline: [
          { date: '2023-01', event: 'First Skibidi Toilet video uploaded' },
          { date: '2023-03', event: 'Series gains viral popularity' },
          { date: '2023-06', event: 'Term enters mainstream internet slang' },
          { date: '2023-09', event: 'Peak popularity with millions of views' }
        ],
        relatedTerms: [
          { title: 'Rizz', icon: '😎', description: 'Charisma or charm' },
          { title: 'No Cap', icon: '🧢', description: 'No lie, for real' },
          { title: 'Slay', icon: '💅', description: 'Doing something exceptionally well' }
        ],
        popularity: [20, 35, 60, 85, 95, 90, 75, 80, 70, 65, 60, 55]
      },
      'rizz': {
        title: 'Rizz',
        icon: '😎',
        category: 'Slang',
        definition: 'Short for "charisma" - used to describe someone with natural charm, appeal, or the ability to attract others romantically or socially.',
        origin: 'The term "rizz" is believed to have originated from the word "charisma" and gained popularity through social media platforms like TikTok and Twitter. It became widely used in 2022-2023.',
        examples: [
          'He\'s got serious rizz with the ladies',
          'My rizz is off the charts today',
          'That outfit gives you major rizz'
        ],
        timeline: [
          { date: '2022-08', event: 'Term first appears on social media' },
          { date: '2022-12', event: 'Gains traction on TikTok' },
          { date: '2023-03', event: 'Becomes mainstream slang' },
          { date: '2023-06', event: 'Peak usage across platforms' }
        ],
        relatedTerms: [
          { title: 'Skibidi', icon: '🚽', description: 'Popular meme term' },
          { title: 'No Cap', icon: '🧢', description: 'No lie, for real' },
          { title: 'Slay', icon: '💅', description: 'Doing something exceptionally well' }
        ],
        popularity: [10, 15, 25, 40, 60, 75, 80, 85, 80, 75, 70, 65]
      }
    };

    const decodedTerm = decodeURIComponent(term || '').toLowerCase();
    const data = mockTermData[decodedTerm as keyof typeof mockTermData];
    setTermData(data);
  }, [term]);

  if (!termData) {
    return (
      <TermDetailWrapper>
        <BackButton onClick={() => navigate('/')}>
          ← Back to Home
        </BackButton>
        <h1>Term not found</h1>
        <p>The term you're looking for doesn't exist in our database yet.</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </TermDetailWrapper>
    );
  }

  return (
    <TermDetailWrapper>
      <BackButton onClick={() => navigate('/')}>
        ← Back to Home
      </BackButton>

      <TermHeader>
        <TermTitle>
          <TermIcon>{termData.icon}</TermIcon>
          {termData.title}
        </TermTitle>
        <TermCategory>{termData.category}</TermCategory>
      </TermHeader>

      <TermDefinition>
        <h2>Definition</h2>
        <p>{termData.definition}</p>
      </TermDefinition>

      <div>
        <SectionTitle>📚 Origin & Etymology</SectionTitle>
        <p>{termData.origin}</p>
      </div>

      <div>
        <SectionTitle>💬 Usage Examples</SectionTitle>
        <UsageExamples>
          {termData.examples.map((example: string, index: number) => (
            <ExampleBubble key={index}>
              "{example}"
            </ExampleBubble>
          ))}
        </UsageExamples>
      </div>

      <TimelineContainer>
        <SectionTitle>📈 Timeline & Popularity</SectionTitle>
        <PopularityChart>
          <h3>Popularity Over Time</h3>
          <ChartContainer>
            {termData.popularity.map((value: number, index: number) => (
              <ChartBar key={index} height={value}>
                {value}%
              </ChartBar>
            ))}
          </ChartContainer>
        </PopularityChart>
        
        <div>
          <h3>Key Events</h3>
          {termData.timeline.map((event: any, index: number) => (
            <TimelineItem key={index}>
              <TimelineDate>{event.date}</TimelineDate>
              <TimelineEvent>{event.event}</TimelineEvent>
            </TimelineItem>
          ))}
        </div>
      </TimelineContainer>

      <div>
        <SectionTitle>🔗 Related Terms</SectionTitle>
        <RelatedTerms>
          {termData.relatedTerms.map((related: any, index: number) => (
            <RelatedTermCard key={index} onClick={() => navigate(`/term/${encodeURIComponent(related.title)}`)}>
              <h4>{related.icon} {related.title}</h4>
              <p>{related.description}</p>
            </RelatedTermCard>
          ))}
        </RelatedTerms>
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <Button onClick={() => navigate('/')}>Explore More Terms</Button>
      </div>
    </TermDetailWrapper>
  );
};

export default TermDetail;
