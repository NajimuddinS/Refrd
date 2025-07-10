import { useState, useEffect } from 'react';
import Layout from './Layout';
import CandidateTable from './CandidateTable';
import ReferralModal from './ReferralModal';

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [candidates, searchTerm, statusFilter]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('https://refrd.onrender.com/api/candidates', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCandidates = () => {
    let filtered = candidates;

    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(candidate => candidate.status === statusFilter);
    }

    setFilteredCandidates(filtered);
  };

  const handleReferralSubmit = () => {
    setShowReferralModal(false);
    fetchCandidates();
  };

  const handleStatusUpdate = async (candidateId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://refrd.onrender.com/api/candidates/${candidateId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchCandidates();
      }
    } catch (error) {
      console.error('Error updating candidate status:', error);
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://refrd.onrender.com/api/candidates/${candidateId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          fetchCandidates();
        }
      } catch (error) {
        console.error('Error deleting candidate:', error);
      }
    }
  };

  const viewResume = async (candidateId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://refrd.onrender.com/api/candidates/${candidateId}/resume`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setSelectedResume(url);
      } else {
        console.error('Error fetching resume');
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Candidate Management</h1>
              <p className="text-gray-600 mt-1">Track and manage all referred candidates</p>
            </div>
            <button
              onClick={() => setShowReferralModal(true)}
              className="btn-primary flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors duration-200"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Referral
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email or job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Candidates</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{candidates.length}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {candidates.filter(c => c.status === 'Pending').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Reviewed</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {candidates.filter(c => c.status === 'Reviewed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Hired</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {candidates.filter(c => c.status === 'Hired').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <CandidateTable
            candidates={filteredCandidates}
            loading={loading}
            onStatusUpdate={handleStatusUpdate}
            onDeleteCandidate={handleDeleteCandidate}
            onViewResume={viewResume}
            searchTerm={searchTerm}
            showAll={true} 
          />
        </div>

        {/* Referral Modal */}
        {showReferralModal && (
          <ReferralModal
            onClose={() => setShowReferralModal(false)}
            onSubmit={handleReferralSubmit}
          />
        )}

        {/* Resume Viewer Modal */}
        {selectedResume && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-auto">
              <div className="flex justify-between items-center border-b p-4">
                <h3 className="text-lg font-medium text-gray-900">Resume Preview</h3>
                <button
                  onClick={() => setSelectedResume(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 h-[80vh]">
                <iframe 
                  src={selectedResume} 
                  className="w-full h-full border rounded-lg"
                  title="Resume Preview"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
