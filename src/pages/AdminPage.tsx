import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminContainer = styled.div`
  padding: 2rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-bottom: 2px solid ${(props) => (props.$active ? 'var(--primary-color)' : 'transparent')};
  background: none;
  cursor: pointer;
  font-weight: ${(props) => (props.$active ? 'bold' : 'normal')};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 0.5rem;
  border-bottom: 2px solid var(--primary-color);
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: var(--primary-color);
  color: white;

  &:hover {
    background-color: #0ea5e9;
  }
`;

interface Submission {
  id: string;
  title: string;
  status: string;
}

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'submissions' | 'users'>('submissions');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/'); // Redirect non-admin users to the home page
    }
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 'submissions') {
      fetchSubmissions();
    } else {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase.from('contributions').select('*');
    if (error) {
      console.error('Error fetching submissions:', error);
    } else {
      setSubmissions(data || []);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('profiles').select('id, email, username, role');
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data || []);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contributions')
        .update({ status: 'approved' })
        .eq('id', id);
      if (error) throw error;
      fetchSubmissions();
    } catch (err) {
      console.error('Error approving submission:', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contributions')
        .update({ status: 'rejected' })
        .eq('id', id);
      if (error) throw error;
      fetchSubmissions();
    } catch (err) {
      console.error('Error rejecting submission:', err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleSetAdmin = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', id);
      if (error) throw error;
      fetchUsers();
    } catch (err) {
      console.error('Error setting user as admin:', err);
    }
  };

  return (
    <AdminContainer>
      <Tabs>
        <Tab $active={activeTab === 'submissions'} onClick={() => setActiveTab('submissions')}>
          Submissions
        </Tab>
        <Tab $active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          Users
        </Tab>
      </Tabs>

      {activeTab === 'submissions' && (
        <div>
          <h2>Manage Submissions</h2>
          <Table>
            <thead>
              <tr>
                <TableHeader>Title</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>{submission.title}</TableCell>
                  <TableCell>{submission.status}</TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleApprove(submission.id)}>Approve</ActionButton>
                    <ActionButton onClick={() => handleReject(submission.id)}>Reject</ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h2>Manage Users</h2>
          <Table>
            <thead>
              <tr>
                <TableHeader>Username</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username || 'N/A'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleDeleteUser(user.id)}>Delete</ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </AdminContainer>
  );
};

export default AdminPage;