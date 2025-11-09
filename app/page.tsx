'use client';

import { useState } from 'react';
import ResumeUpload from '@/components/ResumeUpload';
import GitHubProfile from '@/components/GitHubProfile';

export default function Home() {
  const [githubUsername, setGithubUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            GitFetch
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Upload your resume and instantly discover GitHub profiles. 
            Explore repositories, contributions, and coding journey.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {!githubUsername ? (
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
              <ResumeUpload 
                onGithubFound={setGithubUsername}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center">
                <button
                  onClick={() => setGithubUsername(null)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  ← Upload Another Resume
                </button>
              </div>
              <GitHubProfile username={githubUsername} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400">
          <p className="text-sm">
            Built with ❤️ using Next.js, TypeScript, and GitHub API
          </p>
        </div>
      </div>
    </main>
  );
}
