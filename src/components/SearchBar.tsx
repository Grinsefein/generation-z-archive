import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const SearchBarWrapper = styled.div`
  width: 100%;
  position: relative;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  background-color: var(--current-card-bg);
  color: var(--current-text);
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1), 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const SuggestionsList = styled.ul<{ isVisible: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--current-card-bg);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  list-style: none;
  padding: 0.5rem 0;
  margin: 0.5rem 0 0 0;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  display: ${props => props.isVisible ? 'block' : 'none'};
`;

const SuggestionItem = styled.li`
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: rgba(14, 165, 233, 0.1);
  }
  
  &.selected {
    background-color: rgba(14, 165, 233, 0.2);
  }
`;

const SuggestionIcon = styled.span`
  font-size: 1.2rem;
`;

const SuggestionText = styled.span`
  font-weight: 500;
`;

const SuggestionDescription = styled.span`
  color: #6b7280;
  font-size: 0.9rem;
  margin-left: auto;
`;

const SearchIcon = styled.span`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #9ca3af;
  pointer-events: none;
`;

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search for terms... 🔎" 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{term: string, description: string, icon: string}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock suggestions data
  const mockSuggestions = [
    { term: 'Skibidi', description: 'Popular meme term', icon: '🚽' },
    { term: 'Rizz', description: 'Charisma or charm', icon: '😎' },
    { term: 'No Cap', description: 'No lie, for real', icon: '🧢' },
    { term: 'Bet', description: 'Agreement or confirmation', icon: '✅' },
    { term: 'Slay', description: 'Doing something exceptionally well', icon: '💅' },
    { term: 'Periodt', description: 'Emphatic period', icon: '💯' },
    { term: 'Main Character', description: 'Protagonist energy', icon: '🎭' },
    { term: 'Touch Grass', description: 'Go outside, get offline', icon: '🌱' }
  ];

  useEffect(() => {
    if (query.length > 0) {
      const filtered = mockSuggestions.filter(item =>
        item.term.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex].term);
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (term: string) => {
    setQuery(term);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    if (onSearch) {
      onSearch(term);
    }
  };

  const handleSearch = () => {
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <SearchBarWrapper>
      <SearchInput
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
      />
      <SearchIcon>🔎</SearchIcon>
      <SuggestionsList isVisible={showSuggestions && suggestions.length > 0}>
        {suggestions.map((suggestion, index) => (
          <SuggestionItem
            key={suggestion.term}
            className={index === selectedIndex ? 'selected' : ''}
            onClick={() => handleSuggestionClick(suggestion.term)}
          >
            <SuggestionIcon>{suggestion.icon}</SuggestionIcon>
            <SuggestionText>{suggestion.term}</SuggestionText>
            <SuggestionDescription>{suggestion.description}</SuggestionDescription>
          </SuggestionItem>
        ))}
      </SuggestionsList>
    </SearchBarWrapper>
  );
};

export default SearchBar;
