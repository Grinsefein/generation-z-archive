import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import TermEditModal from '../components/TermEditModal';
import TermVersionsModal from '../components/TermVersionsModal';

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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const StatCard = styled.div`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #666;
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
  registration_date: string;
  is_suspended: boolean;
}

interface Term {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

interface Report {
  id: string;
  content: string;
  reported_by: string;
  status: string;
}

interface TermVersion {
  title: string;
  status: string;
  created_at: string;
}

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'submissions' | 'users' | 'terms' | 'reports' | 'dashboard'>('submissions');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [statistics, setStatistics] = useState<any>({});
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [termToEdit, setTermToEdit] = useState<Term | null>(null);
  const [isVersionsModalOpen, setVersionsModalOpen] = useState(false);
  const [termVersions, setTermVersions] = useState<TermVersion[]>([]);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/'); // Redirect non-admin users to the home page
    }
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 'submissions') {
      fetchSubmissions();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'terms') {
      fetchTerms();
    } else if (activeTab === 'reports') {
      fetchReports();
    } else {
      fetchStatistics();
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
    const { data, error } = await supabase.from('profiles').select('id, email, username, role, registration_date, is_suspended');
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data || []);
    }
  };

  const fetchTerms = async () => {
    const { data, error } = await supabase.from('terms').select('id, title, status, created_at');
    if (error) {
      console.error('Error fetching terms:', error);
    } else {
      setTerms(data || []);
    }
  };

  const fetchReports = async () => {
    const { data, error } = await supabase.from('reports').select('id, content, reported_by, status');
    if (error) {
      console.error('Error fetching reports:', error);
    } else {
      setReports(data || []);
    }
  };

  const fetchStatistics = async () => {
    const { data, error } = await supabase.rpc('get_statistics');
    if (error) {
      console.error('Error fetching statistics:', error);
    } else {
      setStatistics(data || {});
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

  const handleSuspendUser = async (id: string, isSuspended: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_suspended: !isSuspended })
        .eq('id', id);
      if (error) throw error;
      fetchUsers();
    } catch (err) {
      console.error('Error suspending/unsuspending user:', err);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      alert('Password reset email sent successfully.');
    } catch (err) {
      console.error('Error sending password reset email:', err);
    }
  };

  const handleApproveTerm = async (id: string) => {
    try {
      const { error } = await supabase
        .from('terms')
        .update({ status: 'approved' })
        .eq('id', id);
      if (error) throw error;
      fetchTerms();
    } catch (err) {
      console.error('Error approving term:', err);
    }
  };

  const handleRejectTerm = async (id: string) => {
    try {
      const { error } = await supabase
        .from('terms')
        .update({ status: 'rejected' })
        .eq('id', id);
      if (error) throw error;
      fetchTerms();
    } catch (err) {
      console.error('Error rejecting term:', err);
    }
  };

  const handleResolveReport = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: 'resolved' })
        .eq('id', id);
      if (error) throw error;
      fetchReports();
    } catch (err) {
      console.error('Error resolving report:', err);
    }
  };

  const handleDeleteContent = async (id: string) => {
    try {
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (error) throw error;
      fetchReports();
    } catch (err) {
      console.error('Error deleting content:', err);
    }
  };

  const handleEditTerm = (term: Term) => {
    setTermToEdit(term);
    setEditModalOpen(true);
  };

  const handleSaveTerm = async (updatedTerm: Term) => {
    try {
      const { error } = await supabase
        .from('terms')
        .update({
          title: updatedTerm.title,
          status: updatedTerm.status,
          created_at: updatedTerm.created_at, // Ensure created_at is included
        })
        .eq('id', updatedTerm.id);
      if (error) throw error;
      fetchTerms();
      setEditModalOpen(false);
    } catch (err) {
      console.error('Error saving term:', err);
    }
  };

  // Add versioning support for terms
  const fetchTermVersions = async (termId: string) => {
    try {
      const { data, error } = await supabase
        .from('term_versions')
        .select('*')
        .eq('term_id', termId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching term versions:', err);
      return [];
    }
  };

  const handleViewVersions = async (termId: string) => {
    const versions = await fetchTermVersions(termId);
    setTermVersions(versions);
    setVersionsModalOpen(true);
  };

  // Add search and filter functionality
  const handleSearch = async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('terms')
        .select('*')
        .ilike('title', `%${query}%`);
      if (error) throw error;
      setTerms(data || []);
    } catch (err) {
      console.error('Error searching terms:', err);
    }
  };

  const handleFilter = async (status: string) => {
    try {
      const { data, error } = await supabase
        .from('terms')
        .select('*')
        .eq('status', status);
      if (error) throw error;
      setTerms(data || []);
    } catch (err) {
      console.error('Error filtering terms:', err);
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
        <Tab $active={activeTab === 'terms'} onClick={() => setActiveTab('terms')}>
          Terms
        </Tab>
        <Tab $active={activeTab === 'reports'} onClick={() => setActiveTab('reports')}>
          Reports
        </Tab>
        <Tab $active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
          Dashboard
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
                <TableHeader>Registration Date</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username || 'N/A'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.registration_date || 'N/A'}</TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleSuspendUser(user.id, user.is_suspended)}>
                      {user.is_suspended ? 'Unsuspend' : 'Suspend'}
                    </ActionButton>
                    <ActionButton onClick={() => handleResetPassword(user.email)}>Reset Password</ActionButton>
                    <ActionButton onClick={() => handleDeleteUser(user.id)}>Delete</ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {activeTab === 'terms' && (
        <div>
          <h2>Manage Terms</h2>
          <div>
            <input
              type="text"
              placeholder="Search terms..."
              onChange={(e) => handleSearch(e.target.value)}
            />
            <select onChange={(e) => handleFilter(e.target.value)}>
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <Table>
            <thead>
              <tr>
                <TableHeader>Title</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Created At</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {terms.map((term) => (
                <TableRow key={term.id}>
                  <TableCell>{term.title}</TableCell>
                  <TableCell>{term.status}</TableCell>
                  <TableCell>{new Date(term.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleApproveTerm(term.id)}>Approve</ActionButton>
                    <ActionButton onClick={() => handleRejectTerm(term.id)}>Reject</ActionButton>
                    <ActionButton onClick={() => handleEditTerm(term)}>Edit</ActionButton>
                    <ActionButton onClick={() => handleViewVersions(term.id)}>View Versions</ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
          {isEditModalOpen && termToEdit && (
            <TermEditModal
              term={termToEdit}
              onSave={handleSaveTerm}
              onClose={() => setEditModalOpen(false)}
            />
          )}
          {isVersionsModalOpen && (
            <TermVersionsModal
              versions={termVersions}
              onClose={() => setVersionsModalOpen(false)}
            />
          )}
        </div>
      )}

      {activeTab === 'reports' && (
        <div>
          <h2>Manage Reports</h2>
          <Table>
            <thead>
              <tr>
                <TableHeader>Content</TableHeader>
                <TableHeader>Reported By</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.content}</TableCell>
                  <TableCell>{report.reported_by}</TableCell>
                  <TableCell>{report.status}</TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleResolveReport(report.id)}>Resolve</ActionButton>
                    <ActionButton onClick={() => handleDeleteContent(report.id)}>Delete Content</ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {activeTab === 'dashboard' && (
        <div>
          <h2>Dashboard</h2>
          <StatsGrid>
            <StatCard>
              <StatNumber>{statistics.popularTerms || 0}</StatNumber>
              <StatLabel>Popular Terms</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{statistics.recentContributions || 0}</StatNumber>
              <StatLabel>Recent Contributions</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{statistics.activeUsers || 0}</StatNumber>
              <StatLabel>Active Users</StatLabel>
            </StatCard>
          </StatsGrid>
        </div>
      )}
    </AdminContainer>
  );
};

export default AdminPage;