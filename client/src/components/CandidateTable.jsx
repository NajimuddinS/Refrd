const CandidateTable = ({ candidates, loading, onStatusUpdate, onDeleteCandidate }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Reviewed':
        return 'status-reviewed';
      case 'Hired':
        return 'status-hired';
      default:
        return 'status-pending';
    }
  };

  const handleStatusChange = (candidateId, newStatus) => {
    onStatusUpdate(candidateId, newStatus);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by referring a new candidate.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="table-header">Name</th>
            <th className="table-header">Email</th>
            <th className="table-header">Phone</th>
            <th className="table-header">Job Title</th>
            <th className="table-header">Status</th>
            <th className="table-header">Resume</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {candidates.map((candidate) => (
            <tr key={candidate._id} className="hover:bg-gray-50">
              <td className="table-cell">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {candidate.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                  </div>
                </div>
              </td>
              <td className="table-cell">
                <div className="text-sm text-gray-900">{candidate.email}</div>
              </td>
              <td className="table-cell">
                <div className="text-sm text-gray-900">{candidate.phone}</div>
              </td>
              <td className="table-cell">
                <div className="text-sm text-gray-900">{candidate.jobTitle}</div>
              </td>
              <td className="table-cell">
                <select
                  value={candidate.status}
                  onChange={(e) => handleStatusChange(candidate._id, e.target.value)}
                  className={`text-xs font-medium rounded-full px-2 py-1 ${getStatusBadge(candidate.status)} border-none outline-none`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Hired">Hired</option>
                </select>
              </td>
              <td className="table-cell">
                {candidate.resume ? (
                  <a
                    href={candidate.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </a>
                ) : (
                  <span className="text-gray-400">No resume</span>
                )}
              </td>
              <td className="table-cell text-right text-sm font-medium">
                <button
                  onClick={() => onDeleteCandidate(candidate._id)}
                  className="text-red-600 hover:text-red-900"
                  title="Delete candidate"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateTable;