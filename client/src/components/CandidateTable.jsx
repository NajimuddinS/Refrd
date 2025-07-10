import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const CandidateTable = ({ 
  candidates, 
  loading, 
  onStatusUpdate, 
  onDeleteCandidate, 
  onViewResume,
  onEditCandidate,
  searchTerm,
  showAll = false
}) => {
  const [deleteCandidateId, setDeleteCandidateId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const statusOptions = [
    { value: 'Pending', label: 'Pending', color: 'yellow' },
    { value: 'Reviewed', label: 'Reviewed', color: 'blue' },
    { value: 'Hired', label: 'Hired', color: 'green' },
    { value: 'Rejected', label: 'Rejected', color: 'red' }
  ];

  const getStatusClasses = (status) => {
    const option = statusOptions.find(opt => opt.value === status) || {};
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${option.color}-100 text-${option.color}-800`;
  };

  const handleDeleteClick = (candidateId) => {
    setDeleteCandidateId(candidateId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDeleteCandidate(deleteCandidateId);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setDeleteCandidateId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
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

  return (
    <>
      <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Candidate
              </th>
              {showAll && (
                <>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Contact Info
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Job Details
                  </th>
                </>
              )}
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {candidates.map((candidate) => (
              <tr key={candidate._id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-full w-full rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {candidate.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{candidate.name}</div>
                      <div className="text-gray-500">
                        Added {new Date(candidate.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>
                
                {showAll && (
                  <>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="text-gray-900">{candidate.email}</div>
                      <div>{candidate.phone || 'Not provided'}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="font-medium text-gray-900">{candidate.jobTitle}</div>
                      <div>{candidate.jobDepartment || 'N/A'}</div>
                    </td>
                  </>
                )}
                
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <select
                    value={candidate.status}
                    onChange={(e) => onStatusUpdate(candidate._id, e.target.value)}
                    className={getStatusClasses(candidate.status)}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => onViewResume(candidate._id)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="View resume"
                    >
                      <EyeIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">View resume for {candidate.name}</span>
                    </button>
                    <button
                      onClick={() => onEditCandidate(candidate)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Edit candidate"
                    >
                      <PencilIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Edit {candidate.name}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(candidate._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete candidate"
                    >
                      <TrashIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Delete {candidate.name}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Candidate"
        message="Are you sure you want to delete this candidate? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        danger={true}
      />
    </>
  );
};

export default CandidateTable;