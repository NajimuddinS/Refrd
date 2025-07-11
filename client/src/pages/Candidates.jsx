import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import CandidateTable from "../components/CandidateTable";
import ReferralModal from "../components/ReferralModal";
import UpdateCandidateModal from "../components/UpdateCandidateModal";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [candidates, searchTerm, statusFilter]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://refrd.onrender.com/api/candidates",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterCandidates = () => {
    let filtered = candidates;

    if (searchTerm) {
      filtered = filtered.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (candidate) => candidate.status === statusFilter
      );
    }

    setFilteredCandidates(filtered);
  };

  const viewResume = async (candidateId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://refrd.onrender.com/api/candidates/${candidateId}/resume`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setSelectedResume(url);
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
  };

  const handleUpdateCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowUpdateModal(true);
  };

  // const handleUpdateSubmit = async (formData) => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await fetch(
  //       `https://refrd.onrender.com/api/candidates/${selectedCandidate._id}`,
  //       {
  //         method: 'PUT',
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //         },
  //         body: formData,
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || 'Failed to update candidate');
  //     }

  //     const updatedCandidate = await response.json();

  //     setCandidates(candidates.map(c =>
  //       c._id === updatedCandidate._id ? updatedCandidate : c
  //     ));

  //     setShowUpdateModal(false);
  //     alert('Candidate updated successfully');
  //   } catch (error) {
  //     console.error('Error updating candidate:', error);
  //     alert(error.message || 'Failed to update candidate');
  //   }
  // };

  const handleUpdateSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      // If you're sending FormData, don't set Content-Type header
      // The browser will set it automatically with the correct boundary
      const response = await fetch(
        `https://refrd.onrender.com/api/candidates/${selectedCandidate._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update candidate");
      }

      const updatedCandidate = await response.json();

      // Update the candidates state
      setCandidates(
        candidates.map((c) =>
          c._id === updatedCandidate._id ? updatedCandidate : c
        )
      );

      setShowUpdateModal(false);
      alert("Candidate updated successfully");
    } catch (error) {
      console.error("Error updating candidate:", error);
      alert(error.message || "Failed to update candidate");
    }
  };

  const handleStatusUpdate = async (candidateId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://refrd.onrender.com/api/candidates/${candidateId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedCandidate = await response.json();

      // Update the candidates state
      setCandidates(
        candidates.map((c) =>
          c._id === updatedCandidate._id ? updatedCandidate : c
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update candidate status");
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://refrd.onrender.com/api/candidates/${candidateId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          fetchCandidates();
        } else {
          console.error("Failed to delete candidate");
        }
      } catch (error) {
        console.error("Error deleting candidate:", error);
      }
    }
  };

  const handleReferralSubmit = () => {
    setShowReferralModal(false);
    fetchCandidates();
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Candidate Management
              </h1>
              <p className="text-gray-600 mt-1">All candidates in the system</p>
            </div>
            <button
              onClick={() => setShowReferralModal(true)}
              className="btn-primary flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Referral
            </button>
          </div>
        </div>

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

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <CandidateTable
            candidates={filteredCandidates}
            loading={loading}
            searchTerm={searchTerm}
            onStatusUpdate={handleStatusUpdate}
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
                <h3 className="text-lg font-medium text-gray-900">
                  Resume Preview
                </h3>
                <button
                  onClick={() => setSelectedResume(null)}
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
