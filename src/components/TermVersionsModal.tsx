import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 500px;
  max-height: 80%;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h2`
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const VersionList = styled.ul`
  list-style: none;
  padding: 0;
`;

const VersionItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
`;

interface TermVersion {
  title: string;
  status: string;
  created_at: string;
}

interface TermVersionsModalProps {
  versions: TermVersion[];
  onClose: () => void;
}

const TermVersionsModal: React.FC<TermVersionsModalProps> = ({ versions, onClose }) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Term Versions</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <VersionList>
          {versions.map((version: TermVersion, index: number) => (
            <VersionItem key={index}>
              <strong>Version {index + 1}</strong>
              <p>Title: {version.title}</p>
              <p>Status: {version.status}</p>
              <p>Created At: {new Date(version.created_at).toLocaleString()}</p>
            </VersionItem>
          ))}
        </VersionList>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TermVersionsModal;