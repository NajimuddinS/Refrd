import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CandidateTable from '../components/CandidateTable';
import ReferralModal from '../components/ReferralModal';
import UpdateCandidateModal from '../components/UpdateCandidateModal';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

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
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };

  const handleUpdateCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Append all updated fields to formData
      Object.keys(updatedData).forEach(key => {
        if (key !== 'resume' && updatedData[key] !== undefined) {
          formData.append(key, updatedData[key]);
        }
      });
      
      // Append resume file if it exists
      if (updatedData.resume) {
        formData.append('resume', updatedData.resume);
      }

      const response = await fetch(`https://refrd.onrender.com/api/candidates/${selectedCandidate._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        fetchCandidates();
        setShowUpdateModal(false);
      } else {
        console.error('Failed to update candidate');
      }
    } catch (error) {
      console.error('Error updating candidate:', error);
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
        } else {
          console.error('Failed to delete candidate');
        }
      } catch (error) {
        console.error('Error deleting candidate:', error);
      }
    }
  };

  const handleReferralSubmit = () => {
    setShowReferralModal(false);
    fetchCandidates();
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = searchTerm 
      ? candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchesStatus = statusFilter !== 'all' 
      ? candidate.status === statusFilter 
      : true;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Candidate Management</h1>
              <p className="text-gray-600 mt-1">All candidates in the system</p>
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
                  placeholder="Search candidates..."
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
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <CandidateTable 
            candidates={filteredCandidates}
            loading={loading}
            searchTerm={searchTerm}
            onViewResume={viewResume}
            onUpdateCandidate={handleUpdateCandidate}
            onDeleteCandidate={handleDeleteCandidate}
          />
        </div>

        {showReferralModal && (
          <ReferralModal
            onClose={() => setShowReferralModal(false)}
            onSubmit={handleReferralSubmit}
          />
        )}

        {showUpdateModal && selectedCandidate && (
          <UpdateCandidateModal
            candidate={selectedCandidate}
            onClose={() => setShowUpdateModal(false)}
            onSubmit={handleUpdateSubmit}
          />
        )}

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

export default Candidates;