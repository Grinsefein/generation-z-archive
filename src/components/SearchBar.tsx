import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';

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
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  border-radius: 8px;
  margin: 0.25rem;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-radius: 2px;
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(236, 72, 153, 0.1));
    transform: translateX(8px);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
    
    &::before {
      transform: scaleY(1);
    }
  }
  
  &.selected {
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(236, 72, 153, 0.2));
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2);
    
    &::before {
      transform: scaleY(1);
    }
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

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 0) {
        const { data, error } = await supabase
          .from('terms')
          .select('term, description, icon')
          .ilike('term', `%${query}%`);

        if (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } else {
          setSuggestions(data || []);
        }
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // Vorschläge anzeigen, aber keine Weiterleitung auslösen
    setShowSuggestions(true);
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
    if (onSearch) {
      onSearch(term); // Weiterleitung oder andere Aktionen nur hier auslösen
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
      <SuggestionsList isVisible={showSuggestions}>
        {suggestions.map((item, index) => (
          <SuggestionItem
            key={item.term}
            onClick={() => handleSuggestionClick(item.term)}
            className={index === selectedIndex ? 'selected' : ''}
          >
            <SuggestionIcon>{item.icon}</SuggestionIcon>
            <SuggestionText>{item.term}</SuggestionText>
            <SuggestionDescription>{item.description}</SuggestionDescription>
          </SuggestionItem>
        ))}
      </SuggestionsList>
    </SearchBarWrapper>
  );
};

export default SearchBar;
