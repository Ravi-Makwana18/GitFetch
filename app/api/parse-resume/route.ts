import { NextRequest, NextResponse } from 'next/server';

// Helper function to filter out common GitHub paths that aren't usernames
function isCommonPath(username: string): boolean {
  const commonPaths = [
    'github', 'about', 'settings', 'explore', 'marketplace', 
    'pricing', 'login', 'signup', 'features', 'enterprise',
    'team', 'collections', 'topics', 'trending', 'events',
    'sponsors', 'readme', 'issues', 'pulls', 'security',
    'notifications', 'organizations', 'orgs'
  ];
  return commonPaths.includes(username.toLowerCase());
}

// Helper function to filter out common words that might be mistaken for usernames
function isCommonWord(word: string): boolean {
  const commonWords = [
    'email', 'phone', 'the', 'and', 'for', 'with', 'from',
    'this', 'that', 'have', 'your', 'com', 'www', 'http',
    'https', 'gmail', 'yahoo', 'hotmail', 'outlook'
  ];
  return commonWords.includes(word.toLowerCase()) || word.includes('.');
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    // Extract GitHub username patterns - improved version
    const foundUsernames = new Set<string>();
    
    // Pattern 1: Full GitHub URLs (with or without https://)
    const urlPattern = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]){0,38}[a-zA-Z0-9])(?:\/|\s|$|\?|#)/gi;
    let matches = text.matchAll(urlPattern);
    for (const match of matches) {
      const username = match[1];
      if (username && !isCommonPath(username)) {
        foundUsernames.add(username.toLowerCase());
      }
    }

    // Pattern 2: github.com/username without protocol
    const githubPattern = /github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]){0,38}[a-zA-Z0-9])(?:\/|\s|$|\?|#)/gi;
    matches = text.matchAll(githubPattern);
    for (const match of matches) {
      const username = match[1];
      if (username && !isCommonPath(username)) {
        foundUsernames.add(username.toLowerCase());
      }
    }

    // Pattern 3: GitHub: username or github: username (label format)
    const labelPattern = /github\s*:\s*([a-zA-Z0-9](?:[a-zA-Z0-9-]){0,38}[a-zA-Z0-9])(?:\s|$|,|;)/gi;
    matches = text.matchAll(labelPattern);
    for (const match of matches) {
      const username = match[1];
      if (username && !isCommonPath(username)) {
        foundUsernames.add(username.toLowerCase());
      }
    }

    // Pattern 4: @username (but filter out common false positives)
    const atPattern = /@([a-zA-Z0-9](?:[a-zA-Z0-9-]){0,38}[a-zA-Z0-9])(?:\s|$|,|;)/gi;
    matches = text.matchAll(atPattern);
    for (const match of matches) {
      const username = match[1];
      // Only add @ mentions if they look like GitHub usernames (no dots, reasonable length)
      if (username && username.length >= 3 && username.length <= 39 && !isCommonWord(username)) {
        foundUsernames.add(username.toLowerCase());
      }
    }

    // Pattern 5: github.com in URL-like contexts
    const githubInTextPattern = /\b([a-zA-Z0-9](?:[a-zA-Z0-9-]){0,38}[a-zA-Z0-9])\.github\.(?:com|io)/gi;
    matches = text.matchAll(githubInTextPattern);
    for (const match of matches) {
      const username = match[1];
      if (username && !isCommonWord(username)) {
        foundUsernames.add(username.toLowerCase());
      }
    }

    if (foundUsernames.size === 0) {
      return NextResponse.json(
        { error: 'No GitHub profile found in the resume. Please include your GitHub profile URL or username.' },
        { status: 404 }
      );
    }

    // Validate usernames against GitHub API (check if they exist)
    const usernamesArray = Array.from(foundUsernames);
    
    for (const username of usernamesArray) {
      try {
        const response = await fetch(`https://api.github.com/users/${username}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GitFetch-App',
          },
        });
        
        if (response.ok) {
          // Found a valid GitHub username
          return NextResponse.json({ username });
        }
      } catch (err) {
        // Continue to next username if this one fails
        continue;
      }
    }

    // If no valid usernames found, return error with what we found
    return NextResponse.json(
      { 
        error: `Found potential GitHub usernames (${usernamesArray.join(', ')}) but couldn't verify them. Please check your GitHub profile link.`,
        suggestions: usernamesArray 
      },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error parsing resume:', error);
    return NextResponse.json(
      { error: 'Failed to parse resume' },
      { status: 500 }
    );
  }
}
