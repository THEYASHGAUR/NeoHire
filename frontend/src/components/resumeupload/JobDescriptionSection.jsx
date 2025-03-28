import React, { useState, useEffect } from 'react';
import { Check, X, Upload } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;



const JobDescriptionSection = ({
  jdTemplates,
  jdContent,
  setJdContent,
  handleJDSubmit,
  resumesUploaded
}) => {
  const [jdFile, setJdFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      readFileContent(file);
      setJdFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      readFileContent(file);
      setJdFile(file);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const formatJobDescription = (text) => {
    // Remove extra whitespace and normalize line breaks
    let formatted = text.replace(/\s+/g, ' ').trim();
    
    // Add line breaks before common section headers
    const sections = [
      'Requirements:', 
      'Responsibilities:', 
      'Qualifications:',
      'Skills Required:',
      'Experience:',
      'Education:',
      'Benefits:',
      'About Us:',
      'Job Description:',
      'What We Offer:',
      'Nice to have:'
    ];
  
    sections.forEach(section => {
      formatted = formatted.replace(
        new RegExp(`(${section})`, 'gi'),
        '\n\n$1\n'
      );
    });
  
    // Format bullet points
    formatted = formatted.replace(/[•●∙⋅⚬⦁◦-]\s*/g, '\n• ');
    
    // Add proper spacing between sentences
    formatted = formatted.replace(/\./g, '.\n');
    
    // Remove multiple consecutive line breaks
    formatted = formatted.replace(/\n\s*\n/g, '\n\n');
    
    // Ensure proper spacing after commas
    formatted = formatted.replace(/,([^\s])/g, ', $1');
  
    return formatted;
  };
  
  const readFileContent = async (file) => {
    setIsLoading(true);
    const reader = new FileReader();
  
    try {
      if (file.type === 'application/pdf') {
        reader.onload = async (event) => {
          try {
            const typedArray = new Uint8Array(event.target.result);
            const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
            let text = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              text += content.items.map(item => item.str).join(' ') + '\n';
            }
            
            // Format the extracted text before setting it
            const formattedText = formatJobDescription(text);
            setJdContent(formattedText);
          } catch (error) {
            console.error('Error reading PDF:', error);
            alert('Error reading PDF file. Please try again.');
          } finally {
            setIsLoading(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (
        file.type === 'text/plain' ||
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        reader.onload = (event) => {
          try {
            // Format the text content before setting it
            const formattedText = formatJobDescription(event.target.result);
            setJdContent(formattedText);
          } catch (error) {
            console.error('Error reading file:', error);
            alert('Error reading file. Please try again.');
          } finally {
            setIsLoading(false);
          }
        };
        reader.readAsText(file);
      } else {
        alert('Unsupported file type. Please upload a PDF, DOC, DOCX, or TXT file.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
      setIsLoading(false);
    }
  };

  const handleJDSubmitWithCheck = () => {
    if (!resumesUploaded) {
      alert('Please upload resumes before submitting the job description.');
      return;
    }
    handleJDSubmit();
  };

  const resetJDContent = () => {
    setJdContent('');
    setJdFile(null);
  };

  return (
    <div className="space-y-6">
      {/* JD Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {jdTemplates.map((template, index) => (
          <button
            key={index}
            onClick={() => setJdContent(template.content)}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 text-left"
          >
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              {template.title} Template
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {template.content}
            </p>
          </button>
        ))}
      </div>

      {/* JD Input */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 backdrop-blur-lg backdrop-filter">
        <div className="mb-4 flex">
          <div
            className={`w-1/3 p-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center transform ${
              isDragging ? 'scale-110' : ''
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
          >
            <Upload className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Drag & Drop JD Here
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
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
              </label>
            </div>
          </div>
          <div className="w-2/3 ml-4 relative">
          <textarea
              value={jdContent}
              onChange={(e) => setJdContent(e.target.value)}
              placeholder="Enter job description or paste from clipboard..."
              className="w-full h-64 p-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none font-mono whitespace-pre-wrap"
              disabled={isLoading}
              style={{ lineHeight: '1.5' }}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-700/50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
            {jdContent && !isLoading && (
              <button
                onClick={resetJDContent}
                className="absolute top-3 right-5 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleJDSubmitWithCheck}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            disabled={isLoading || !jdContent.trim()}
          >
            <Check className="w-5 h-5 mr-2" />
            Submit Job Description
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionSection;