# GitFetch - Quick Deployment Guide

## 🚀 Deploy to Vercel in 3 Steps

### Step 1: Initialize Git Repository

```bash
cd /Users/ravimakwana/Desktop/Projects_Final/GitFetch
git init
git add .
git commit -m "Initial commit: GitFetch Resume Parser"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named "gitfetch"
3. Keep it public (required for submission)
4. Don't initialize with README (we already have one)

### Step 3: Push to GitHub

```bash
git remote add origin https://github.com/Ravi-Makwana18/gitfetch.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your `gitfetch` repository
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

### Step 3: Done!

Your app will be live at `https://your-project-name.vercel.app`

## 🔧 Optional: Environment Variables

If you want to increase GitHub API rate limits:

1. Create a GitHub Personal Access Token:
   - Go to GitHub Settings → Developer Settings → Personal Access Tokens
   - Generate new token (classic)
   - Select scopes: `public_repo`, `read:user`
   - Copy the token

2. Add to Vercel:
   - Go to Project Settings → Environment Variables
   - Add: `GITHUB_TOKEN` = `your_token_here`
   - Redeploy

## ✅ Verification

Test your deployed app:
1. Visit your Vercel URL
2. Paste a resume with a GitHub profile
3. See the GitHub profile display

## 📝 Update README

Don't forget to update the README with:
- Your deployed Vercel URL
- Your GitHub repository URL
- Screenshots of the application
