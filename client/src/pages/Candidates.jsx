import { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Layout from '../components/Layout';

const Candidates = () => {
  // State management
  const [state, setState] = useState({
    candidates: [],
    loading: true,
    showReferralModal: false,
    searchTerm: '',
    statusFilter: 'all',
    selectedResume: null,
    selectedCandidate: null,
    showUpdateModal: false,
    candidateToDelete: null,
    showDeleteModal: false
  });

  // Destructure state
  const {
    candidates,
    loading,
    showReferralModal,
    searchTerm,
    statusFilter,
    selectedResume,
    selectedCandidate,
    showUpdateModal,
    candidateToDelete,
    showDeleteModal
  } = state;

  // Helper function to update state
  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Fetch candidates on mount
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        updateState({ loading: true });
        const token = localStorage.getItem('token');
        const response = await fetch('https://refrd.onrender.com/api/candidates', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch candidates');
        
        const data = await response.json();
        updateState({ candidates: data, loading: false });
      } catch (error) {
        console.error('Error fetching candidates:', error);
        updateState({ loading: false });
        alert('Failed to load candidates');
      }
    };

    fetchCandidates();
  }, []);

  // View resume handler
  const viewResume = async (candidateId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://refrd.onrender.com/api/candidates/${candidateId}/resume`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Failed to fetch resume');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      updateState({ selectedResume: url });
    } catch (error) {
      console.error('Error fetching resume:', error);
      alert('Failed to load resume');
    }
  };

  // Update candidate handlers
  const handleUpdateCandidate = (candidate) => {
    updateState({ 
      selectedCandidate: candidate,
      showUpdateModal: true 
    });
  };

  const handleUpdateSubmit = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      Object.entries(updatedData).forEach(([key, value]) => {
        if (key !== 'resume' && value !== undefined) formData.append(key, value);
      });
      
      if (updatedData.resume) formData.append('resume', updatedData.resume);

      const response = await fetch(
        `https://refrd.onrender.com/api/candidates/${selectedCandidate._id}`, 
        {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Failed to update candidate');
      
      alert('Candidate updated successfully');
      updateState({ showUpdateModal: false });
      // Refresh candidates
      const newData = await response.json();
      updateState({ 
        candidates: candidates.map(c => 
          c._id === selectedCandidate._id ? newData : c
        ) 
      });
    } catch (error) {
      console.error('Error updating candidate:', error);
      alert('Failed to update candidate');
    }
  };

  // Delete candidate handlers
  const confirmDelete = (candidateId) => {
    updateState({ 
      candidateToDelete: candidateId,
      showDeleteModal: true 
    });
  };

  const handleDeleteCandidate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://refrd.onrender.com/api/candidates/${candidateToDelete}`, 
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Failed to delete candidate');
      
      alert('Candidate deleted successfully');
      updateState({ 
        showDeleteModal: false,
        candidates: candidates.filter(c => c._id !== candidateToDelete)
      });
    } catch (error) {
      console.error('Error deleting candidate:', error);
      alert('Failed to delete candidate');
    }
  };

  // Filter candidates
  const filteredCandidates = candidates.filter(candidate => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      candidate.name.toLowerCase().includes(searchLower) || 
      candidate.jobTitle?.toLowerCase().includes(searchLower) ||
      candidate.email.toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Candidate table component (kept within the same file)
  const CandidateTable = ({ candidates, loading, onViewResume, onUpdateCandidate, onDeleteCandidate }) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    if (candidates.length === 0) {
      return (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No candidates found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search or filter' : 'Get started by referring a new candidate'}
          </p>
        </div>
      );
    }

    const getStatusClasses = (status) => {
      const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
      switch (status) {
        case 'Pending': return `${base} bg-yellow-100 text-yellow-800`;
        case 'Reviewed': return `${base} bg-blue-100 text-blue-800`;
        case 'Hired': return `${base} bg-green-100 text-green-800`;
        case 'Rejected': return `${base} bg-red-100 text-red-800`;
        default: return `${base} bg-gray-100 text-gray-800`;
      }
    };

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {candidates.map((candidate) => (
              <tr key={candidate._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{candidate.jobTitle}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{candidate.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={candidate.status}
                    onChange={(e) => {/* Add status update handler if needed */}}
                    className={getStatusClasses(candidate.status)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => onViewResume(candidate._id)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="View resume"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onUpdateCandidate(candidate)}
                      className="text-green-600 hover:text-green-900"
                      title="Edit candidate"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDeleteCandidate(candidate._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete candidate"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Candidate Management</h1>
              <p className="text-gray-600 mt-1">All candidates in the system</p>
            </div>
            <button
              onClick={() => updateState({ showReferralModal: true })}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Referral
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => updateState({ searchTerm: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => updateState({ statusFilter: e.target.value })}
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

        {/* Candidate Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <CandidateTable 
            candidates={filteredCandidates}
            loading={loading}
            onViewResume={viewResume}
            onUpdateCandidate={handleUpdateCandidate}
            onDeleteCandidate={confirmDelete}
          />
        </div>

        {/* Update Candidate Modal */}
        {showUpdateModal && selectedCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="flex justify-between items-center border-b p-4">
                <h3 className="text-lg font-medium text-gray-900">Update Candidate</h3>
                <button
                  onClick={() => updateState({ showUpdateModal: false })}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = Object.fromEntries(new FormData(e.target));
                handleUpdateSubmit(formData);
              }} className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      defaultValue={selectedCandidate.name}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      defaultValue={selectedCandidate.email}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      defaultValue={selectedCandidate.phone}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      name="status"
                      id="status"
                      defaultValue={selectedCandidate.status}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      id="jobTitle"
                      defaultValue={selectedCandidate.jobTitle}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                      Resume (optional update)
                    </label>
                    <input
                      type="file"
                      name="resume"
                      id="resume"
                      accept=".pdf,.doc,.docx"
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => updateState({ showUpdateModal: false })}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Update Candidate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Delete Candidate</h3>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Are you sure you want to delete this candidate? This action cannot be undone.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => updateState({ showDeleteModal: false, candidateToDelete: null })}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:col-start-1 sm:text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteCandidate}
                    className="w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm sm:col-start-2 sm:text-sm bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resume Viewer Modal */}
        {selectedResume && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-auto">
              <div className="flex justify-between items-center border-b p-4">
                <h3 className="text-lg font-medium text-gray-900">Resume Preview</h3>
                <button
                  onClick={() => updateState({ selectedResume: null })}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
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