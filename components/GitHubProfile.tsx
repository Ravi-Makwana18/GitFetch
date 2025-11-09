'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  User, MapPin, Building2, Link as LinkIcon, Calendar, 
  Users, GitFork, Star, ExternalLink, Loader2, Github 
} from 'lucide-react';

interface GitHubProfileProps {
  username: string;
}

interface Profile {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

export default function GitHubProfile({ username }: GitHubProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGitHubData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const fetchGitHubData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/github/${username}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch GitHub data');
      }

      setProfile(data.profile);
      setRepositories(data.repositories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load GitHub profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20">
        <Loader2 className="w-16 h-16 text-purple-400 animate-spin mb-4" />
        <p className="text-gray-300 text-lg">Loading GitHub profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-8 backdrop-blur-lg bg-red-500/10 rounded-2xl border border-red-500/50">
        <p className="text-red-400 text-center text-lg">{error || 'Profile not found'}</p>
      </div>
    );
  }

  const joinDate = new Date(profile.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto md:mx-0">
              <Image
                src={profile.avatar_url}
                alt={profile.name || profile.login}
                fill
                className="rounded-full border-4 border-purple-500 shadow-lg object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-purple-500 rounded-full p-2">
                <Github className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {profile.name || profile.login}
              </h2>
              <a
                href={profile.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-2"
              >
                @{profile.login}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {profile.bio && (
              <p className="text-gray-300 text-lg">{profile.bio}</p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Users className="w-5 h-5 text-blue-400" />
                <span><strong>{profile.followers}</strong> followers</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <User className="w-5 h-5 text-green-400" />
                <span><strong>{profile.following}</strong> following</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Github className="w-5 h-5 text-purple-400" />
                <span><strong>{profile.public_repos}</strong> repositories</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
              {profile.company && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Building2 className="w-4 h-4 text-orange-400" />
                  <span>{profile.company}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-4 h-4 text-red-400" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.blog && (
                <div className="flex items-center gap-2 text-gray-300">
                  <LinkIcon className="w-4 h-4 text-cyan-400" />
                  <a
                    href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-300 transition-colors truncate"
                  >
                    {profile.blog}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-4 h-4 text-yellow-400" />
                <span>Joined {joinDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Repositories */}
      <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Github className="w-6 h-6" />
          Recent Repositories
        </h3>

        {repositories.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No public repositories found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repositories.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors flex items-center gap-2">
                    {repo.name}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                </div>

                {repo.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {repo.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-4 h-4 text-gray-400" />
                    {repo.forks_count}
                  </span>
                </div>

                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {repo.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </a>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href={`${profile.html_url}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            View All Repositories
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
