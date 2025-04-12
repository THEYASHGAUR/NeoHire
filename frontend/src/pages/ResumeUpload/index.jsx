import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/resumeupload/BackButton';
import HeroSection from '../../components/resumeupload/HeroSection';
import SuccessMessage from '../../components/resumeupload/SuccessMessage';
import Tabs from '../../components/resumeupload/Tabs';
import {Upload, FileText, Eye, Download, Trash2, Check,  Brain,   } from "lucide-react";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setExtractedResumes} from '../../store/FeaturedResume/resume';


const ResumeUpload = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [resumeFiles, setResumeFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [analysisStatus, setAnalysisStatus] = useState({});
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [jdFile, setJdFile] = useState([]);
  const [jdAnalysis, setJdAnalysis] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
 const dispatch = useDispatch()
  

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleResumeDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = [...e.dataTransfer.files];
    handleResumeFiles(droppedFiles);
  }, []);

  const handleJDDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = [...e.dataTransfer.files] ;
    handleJDFile(droppedFiles);
  }, []);



  const handleResumeFileInput = (e) => {
    const selectedFiles = [...e.target.files];
    handleResumeFiles(selectedFiles);
  };

  const handleJDFileInput = (e) => {
      const selectedFiles = [...e.target.files];
      handleJDFile(selectedFiles);
    };
    const handleJDFile =  (newFile) => {
      const validFiles = newFile.filter(file => 
        ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
        .includes(file.type)
      );
  
      if (validFiles.length !== newFile.length) {
        alert(' file was skipped. Only PDF/ DOCX/ TXT file is supported.');
      }
  
      setJdFile(prev => [...prev, ...validFiles]);
  
       validFiles.forEach(file => {
        simulateFileUpload(file);
         simulateAIAnalysis(file);
       });
       console.log("jdFile",jdFile)
    };
  const handleResumeFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => 
      ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
      .includes(file.type)
    );

    if (validFiles.length !== newFiles.length) {
      alert('Some files were skipped. Only PDF, DOCX, and TXT files are supported.');
    }

    setResumeFiles(prev => [...prev, ...validFiles]);

    validFiles.forEach(file => {
      simulateFileUpload(file);
      simulateAIAnalysis(file);
    });
    console.log("resumeFiles",resumeFiles)
  };


  const simulateFileUpload = (file) => {
    setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = (prev[file.name] || 0) + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
        }
        return { ...prev, [file.name]: Math.min(newProgress, 100) };
      });
    }, 500);
  };

  const simulateAIAnalysis = (file) => {
    setAnalysisStatus(prev => ({ ...prev, [file.name]: 'Scanning' }));
    
    setTimeout(() => {
      setAnalysisStatus(prev => ({ ...prev, [file.name]: 'Analyzing' }));
      
      setTimeout(() => {
        setAnalysisStatus(prev => ({ ...prev, [file.name]: 'Complete' }));
      }, 3000);
    }, 2000);
  };

  const removeFile = (fileName) => {
    setResumeFiles(prev => prev.filter(file => file.name !== fileName));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
    setAnalysisStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[fileName];
      return newStatus;
    });
  };

  const handleJDSubmit = () => {
    if (!jdContent.trim()) {
      alert('Please enter a job description');
      return;
    }

    setJdAnalysis({
      readabilityScore: 85,
      suggestedSkills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      salaryRange: '$100,000 - $150,000',
      experienceLevel: 'Senior',
      improvements: [
        'Consider adding more specific technical requirements',
        'Include information about team size and structure',
        'Specify preferred certifications'
      ]
    });

    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
      navigate('/job-matching');
    }, 3000);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      resumeFiles.forEach(file => {
        formData.append('files', file);
      });

      formData.append("jd", jdFile);
     
      
      const response =await axios.post("/api/extract-text",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      console.log("response",response.data.extracted_resumes)
      dispatch(setExtractedResumes(response.data.extracted_resumes))
      // console.log("response",response.data.ai_parsed_resumes)
      // dispatch(setAiParsedResumes(response.data.ai_parsed_resumes))
    
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigate('/job-matching');
      }, 3000);
    } catch (error) {
      console.error('Error uploading files:', error);
      
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8 transition-all duration-500 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="max-w-7xl mx-auto">
        <BackButton />
        <HeroSection />
        {showSuccessMessage && <SuccessMessage />}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <Tabs />
          <div className="flex justify-between items-baseline p-4 sm:p-6 md:p-8 bg-gray-100 dark:bg-gray-700">
              {/* Resume Upload Section */}
            <div>

            
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
                  onDrop={handleResumeDrop}
                >
                  <div className="text-center transform transition-all duration-300">
                    <Upload className={`w-16 h-16 mx-auto mb-4 text-blue-500 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`} />
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                      Drag & Drop Resumes Here
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Supports PDF, DOCX, and TXT formats
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
                          onChange={handleResumeFileInput}
                        />
                      </label>
                      {/* <button
                        onClick={handleSubmit}
                        disabled={files.length === 0}
                        className={`inline-flex items-center px-6 py-3 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 ${
                          files.length === 0
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        <Check className="w-5 h-5 mr-2" />
                        Submit Resumes
                      </button> */}
                    </div>
                  </div>
                </div>
                {/* Uploaded Files List */}
                {resumeFiles.length > 0 && (
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-xl p-4 sm:p-6 transform transition-all duration-500 animate-fade-in-up backdrop-blur-lg backdrop-filter">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Uploaded Files ({resumeFiles.length})
                    </h3>
                    <div className="space-y-4">
                      {resumeFiles.map((file, index) => (
                        <div 
                          key={file.name}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
                          style={{
                            animationDelay: `${index * 100}ms`
                          }}
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
                                onClick={() => {/* View file */}}
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button 
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => {/* Download file */}}
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
            </div>
             

            {/* Job Description Section */}
              <div className="space-y-6">
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
                  onDrop={handleJDDrop}
                >
                  <div className="text-center transform transition-all duration-300">
                    <Upload className={`w-16 h-16 mx-auto mb-4 text-purple-600 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`} />
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                      Drag & Drop Job Description Here
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Supports PDF, DOCX, and TXT formats
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <label className="inline-flex items-center px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0">
                        <Upload className="w-5 h-5 mr-2" />
                        Upload JD
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={handleJDFileInput}
                        />
                      </label>
                    
                    </div>
                  </div>
                </div>
              {/* Uploaded Files List */}
              {jdFile.length>0 && (
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-xl p-4 sm:p-6 transform transition-all duration-500 animate-fade-in-up backdrop-blur-lg backdrop-filter">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Job Description File
                    </h3>
                    <div className="space-y-4">
                      {jdFile.map((file, index) => (
                        <div 
                          key={file.name}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
                          style={{
                            animationDelay: `${index * 100}ms`
                          }}
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
                                onClick={() => {/* View file */}}
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button 
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => {/* Download file */}}
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
                                  width: `${uploadProgress[jdFile.name]}%`,
                                  transition: 'width 0.5s ease-out'
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))} ; 
                    </div>
                  </div>
                )}
                

                {/* AI Analysis */}
                {/* {jdAnalysis && (
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 backdrop-blur-lg backdrop-filter animate-fade-in-up">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Brain className="w-6 h-6 mr-2 text-purple-500" />
                      AI Analysis Results
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            Readability Score
                          </h4>
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${jdAnalysis.readabilityScore}%` }}
                              />
                            </div>
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                              {jdAnalysis.readabilityScore}%
                            </span>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            Suggested Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {jdAnalysis.suggestedSkills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            Job Details
                          </h4>
                          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <p>Salary Range: {jdAnalysis.salaryRange}</p>
                            <p>Experience Level: {jdAnalysis.experienceLevel}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                          <MessageSquare className="w-5 h-5 mr-2 text-yellow-500" />
                          Suggested Improvements
                        </h4>
                        <ul className="space-y-3">
                          {jdAnalysis.improvements.map((improvement, index) => (
                            <li
                              key={index}
                              className="flex items-start text-sm text-gray-600 dark:text-gray-400"
                            >
                              <Sparkles className="w-4 h-4 mr-2 mt-0.5 text-yellow-500 flex-shrink-0" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )} */}
              </div>

         
          </div>
          <button 
          onClick={handleSubmit}
          disabled={resumeFiles.length === 0 && jdFile.length === 0}
          className={`
            mt-6 mb-4 px-6 py-3 w-full rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-white font-semibold
            ${resumeFiles.length === 0 && jdFile.length === 0 ? ' bg-gradient-to-r from-blue-600 to-purple-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}
          `} 
          >Submit </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;