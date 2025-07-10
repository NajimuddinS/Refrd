import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';

const CandidateTable = ({ 
  candidates, 
  loading, 
  onStatusUpdate, 
  onDeleteCandidate, 
  onViewResume,
  searchTerm,
  showAll = false // Default to false if not provided
}) => {
  const getStatusBadge = (status) => {
    const baseClasses = "text-xs font-medium rounded-full px-3 py-1";
    
    switch (status) {
      case 'Pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Reviewed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'Hired':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleStatusChange = (candidateId, newStatus) => {
    onStatusUpdate(candidateId, newStatus);
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Candidate
            </th>
            {showAll && (
              <>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Details
                </th>
              </>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {candidates.map((candidate) => (
            <tr key={candidate._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">
                      {candidate.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(candidate.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </td>
              
              {showAll && (
                <>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{candidate.email}</div>
                    <div className="text-sm text-gray-500">{candidate.phone || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{candidate.jobTitle}</div>
                    <div className="text-sm text-gray-500">{candidate.jobDepartment || 'N/A'}</div>
                  </td>
                </>
              )}
              
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={candidate.status}
                  onChange={(e) => onStatusUpdate(candidate._id, e.target.value)}
                  className={getStatusBadge(candidate.status)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onViewResume(candidate._id)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="View resume"
                  >
                    <EyeIcon className="h-5 w-5" />
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

export default CandidateTable;