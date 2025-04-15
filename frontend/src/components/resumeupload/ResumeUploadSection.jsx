import React, { useState } from 'react';
import { 
  Upload, 
  FileText,
  Check,
  Eye,
  Download,
  Trash2,
  ChevronRight,
  Brain
} from 'lucide-react';

const ResumeUploadSection = ({ 
  isDragging,
  files,
  uploadProgress,
  analysisStatus,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileInput,
  handleSubmit,
  removeFile
}) => {
  const [jdUploaded, setJdUploaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const handleJdUpload = (e) => {
    const selectedFiles = [...e.target.files];
    if (selectedFiles.length > 0) {
      setJdUploaded(true);
    }
  };

  const handlePreview = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewFile(e.target.result);
      setShowPreview(true);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmitWithCheck = () => {
    if (!jdUploaded) {
      alert('Please upload a job description (JD) before submitting resumes.');
      return;
    }
    handleSubmit();
  };

  return (
    <>
      {/* Upload Area */}
      <div 
        className={`
          relative p-6 sm:p-8 md:p-12 mb-8 rounded-xl transition-all duration-300 transform
          ${isDragging 
            ? 'bg-blue-50 dark:bg-blue-900/30 scale-102 border-2 border-blue-500 border-dashed' 
            : 'bg-white/50 dark:bg-gray-800/50 shadow-lg hover:shadow-xl backdrop-blur-lg backdrop-filter'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center transform transition-all duration-300">
          <Upload className={`w-16 h-16 mx-auto mb-4 text-blue-500 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`} />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Drag & Drop Resumes Here
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Supports PDF and DOCX formats only
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <label className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0">
              <Upload className="w-5 h-5 mr-2" />
              Browse Files
              <input
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileInput}
              />
            </label>
            <button
              onClick={handleSubmitWithCheck}
              disabled={files.length === 0}
              className={`inline-flex items-center px-6 py-3 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 ${
                files.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              <Check className="w-5 h-5 mr-2" />
              Submit Resumes
            </button>
          </div> 
        </div>
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-xl p-4 sm:p-6 transform transition-all duration-500 animate-fade-in-up backdrop-blur-lg backdrop-filter">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Uploaded Files ({files.length})
          </h3>
          <div className="space-y-4">
            {files.map((file, index) => (
              <div 
                key={file.name}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center space-x-2 flex-wrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {uploadProgress[file.name] === 100 ? (
                            <span className="flex items-center text-green-500">
                              <Check className="w-4 h-4 mr-1" /> Uploaded
                            </span>
                          ) : (
                            `Uploading: ${uploadProgress[file.name]}%`
                          )}
                        </div>
                        <div className="text-sm">
                          {analysisStatus[file.name] && (
                            <span className={`flex items-center ${
                              analysisStatus[file.name] === 'Complete' 
                                ? 'text-green-500' 
                                : 'text-blue-500'
                            }`}>
                              <Brain className="w-4 h-4 mr-1" />
                              AI: {analysisStatus[file.name]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handlePreview(file)}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleDownload(file)}
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-2 text-red-500 hover:text-red-700 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => removeFile(file.name)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ 
                        width: `${uploadProgress[file.name]}%`,
                        transition: 'width 0.5s ease-out'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-7xl h-full max-h-screen overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">File Preview</h3>
              <button 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowPreview(false)}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto max-h-full">
              <iframe 
                src={previewFile} 
                className="w-full h-[80vh]" 
                title="File Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Blockchain Verification Explanation */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-xl p-6 sm:p-8 mt-8 transform transition-all duration-500 animate-fade-in-up backdrop-blur-lg backdrop-filter">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          How Blockchain Redefines Credential Verification and Data Security
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              1. Verification That Builds Trust
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              When resumes or job descriptions (JDs) are uploaded, they are transformed into unique, tamper-proof digital signatures called cryptographic hashes. These hashes are compared with verified records stored securely on the blockchain. If the records match, the credentials are authenticated seamlessly. No match? The system flags discrepancies instantly—ensuring accuracy and trust.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              2. Your Data, Your Authority
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Complete Ownership: You maintain absolute control over your data. With private key authorization, only you decide who can access your credentials.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Role-Based Access: Employers and HR professionals are granted permissions tailored to their needs, ensuring privacy and limiting overreach.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              3. Cutting-Edge Security You Can Rely On
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Decentralized Privacy: Blockchain ensures sensitive data like resumes and certificates are never stored directly on-chain. Instead, the information is securely encrypted and stored on decentralized storage solutions (e.g., IPFS), and only references (hashes) are linked to the blockchain.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Tamper-Proof Technology: Data recorded on the blockchain is immutable—it cannot be altered, deleted, or compromised. This guarantees the integrity of your credentials.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Bank-Grade Encryption: Advanced encryption algorithms shield your data at every step of the process, safeguarding against unauthorized access and cyber threats.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              4. Transparency at Its Core
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Every transaction—be it credential verification, access request, or audit log—is tracked on an immutable ledger. This transparent record is accessible to authorized parties, ensuring accountability without compromising privacy.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Why It Matters
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Blockchain doesn’t just verify your credentials—it elevates them to a standard of integrity, transparency, and security. By empowering candidates with full control over their data and protecting it with advanced technologies, it reimagines the hiring process for a modern, digital world.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeUploadSection;