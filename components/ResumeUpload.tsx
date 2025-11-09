'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, FileText, Loader2, Search } from 'lucide-react';

interface ResumeUploadProps {
  onGithubFound: (username: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function ResumeUpload({ onGithubFound, isLoading, setIsLoading }: ResumeUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    setIsLoading(true);

    try {
      // Check file type
      const validTypes = ['text/plain', 'application/pdf', 'application/msword', 
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!validTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|doc|docx)$/i)) {
        throw new Error('Please upload a valid resume file (PDF, DOC, DOCX, or TXT)');
      }

      // Read file content
      const text = await readFileContent(file);
      await parseResumeText(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setIsLoading(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text);
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      // For simplicity, we'll read as text. In production, you'd use pdf-parse for PDFs
      reader.readAsText(file);
    });
  };

  const parseResumeText = async (text: string) => {
    try {
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show more helpful error message with suggestions if available
        let errorMessage = data.error || 'Failed to parse resume';
        if (data.suggestions && data.suggestions.length > 0) {
          errorMessage += `\n\nFound: ${data.suggestions.join(', ')}`;
        }
        throw new Error(errorMessage);
      }

      if (data.username) {
        onGithubFound(data.username);
      } else {
        throw new Error('No GitHub username found in the response');
      }
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    setError(null);
    setIsLoading(true);

    try {
      await parseResumeText(manualInput);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find GitHub profile');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* File Upload Area */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Upload className="w-6 h-6" />
          Upload Resume
        </h2>
        
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            dragActive
              ? 'border-blue-400 bg-blue-500/10'
              : 'border-gray-400 hover:border-gray-300 bg-white/5'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleChange}
            disabled={isLoading}
          />

          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />
              <p className="text-gray-300 text-lg">Processing your resume...</p>
            </div>
          ) : (
            <>
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 text-lg mb-2">
                Drag and drop your resume here
              </p>
              <p className="text-gray-500 mb-6">or</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Browse Files
              </button>
              <p className="text-gray-500 text-sm mt-4">
                Supports PDF, DOC, DOCX, and TXT files
              </p>
            </>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-slate-800/50 text-gray-400">OR</span>
        </div>
      </div>

      {/* Manual Text Input */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Search className="w-6 h-6" />
          Paste Resume Text
        </h2>
        
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <textarea
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Paste your resume text here... (including GitHub profile link or username)"
            className="w-full h-48 p-4 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            disabled={isLoading}
          />
          
          <button
            type="submit"
            disabled={isLoading || !manualInput.trim()}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Processing...' : 'Find GitHub Profile'}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-400 text-center whitespace-pre-line">{error}</p>
        </div>
      )}
    </div>
  );
}
