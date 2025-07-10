// components/ResumeViewer.js
import { XMarkIcon } from '@heroicons/react/24/outline';

const ResumeViewer = ({ resumeUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-medium text-gray-900">Resume Preview</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close resume viewer"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4 h-[80vh]">
          <iframe 
            src={resumeUrl} 
            className="w-full h-full border rounded-lg"
            title="Resume Preview"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeViewer;