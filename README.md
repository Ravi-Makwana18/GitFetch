# 🚀 GitFetch - Resume Parser & GitHub Profile Fetcher

A modern, beautifully designed Next.js application that automatically extracts GitHub profile from resumes and displays comprehensive GitHub information including repositories, stats, and user details.

## ✨ Features

-  **Resume Upload**: Drag & drop or browse to upload resume files (PDF, DOC, DOCX, TXT)
-  **Text Input**: Paste resume text directly for instant parsing
-  **Smart Detection**: Automatically extracts GitHub usernames from various formats
-  **Profile Display**: Beautiful UI showing user avatar, bio, stats, and more
-  **Repository Showcase**: Grid view of recent repositories with details
-  **Modern Design**: Gradient backgrounds, smooth animations, and glassmorphism effects
-  **Fast & Responsive**: Built with Next.js 14 App Router for optimal performance
-  **GitHub API Integration**: Real-time data fetching from GitHub

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **API**: GitHub REST API
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or higher
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/Ravi-Makwana18/gitfetch.git
cd gitfetch
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Run Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 4. Build for Production

\`\`\`bash
npm run build
npm start
# or
yarn build
yarn start
\`\`\`

## 🎯 How It Works

1. **Upload Resume**: User uploads a resume file or pastes resume text
2. **Parse Content**: The application extracts GitHub profile URLs or usernames using regex patterns
3. **Fetch Data**: Server-side API calls to GitHub API to retrieve user profile and repositories
4. **Display Results**: Beautiful UI renders the GitHub profile with all relevant information

### Supported GitHub Patterns

The application can detect GitHub profiles in multiple formats:
- Full URLs: `https://github.com/username`
- At mentions: `@username`
- GitHub labels: `GitHub: username`
- Profile URLs in text

## 🔧 Configuration

### GitHub API Rate Limiting

The application uses GitHub's public API which has rate limiting:
- **Unauthenticated**: 60 requests per hour
- **Authenticated**: 5,000 requests per hour

To increase rate limits, you can add a GitHub Personal Access Token:

1. Create a `.env.local` file in the root directory
2. Add your GitHub token:

\`\`\`env
GITHUB_TOKEN=your_personal_access_token
\`\`\`

3. Update the API routes to use the token in headers

### Customization

- **Colors**: Modify `tailwind.config.ts` for color schemes
- **Animations**: Update animation classes in `tailwind.config.ts`
- **Layout**: Edit components in `/components` directory

## 🌐 Deployment on Vercel

### Deploy with One Click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ravi-Makwana18/gitfetch)

### Manual Deployment

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and deploy
4. Your app will be live at `https://your-project.vercel.app`

### Environment Variables (Optional)

If using GitHub token, add it in Vercel:
- Go to Project Settings → Environment Variables
- Add `GITHUB_TOKEN` with your token value

## 📝 API Routes

### POST /api/parse-resume

Parses resume text to extract GitHub username.

**Request Body**:
\`\`\`json
{
  "text": "Resume content with GitHub profile..."
}
\`\`\`

**Response**:
\`\`\`json
{
  "username": "github-username"
}
\`\`\`

### GET /api/github/[username]

Fetches GitHub profile and repositories.

**Response**:
\`\`\`json
{
  "profile": {
    "login": "username",
    "name": "Full Name",
    "avatar_url": "...",
    ...
  },
  "repositories": [...]
}
\`\`\`

## 🎨 Design Features

- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Gradient Backgrounds**: Animated gradient backgrounds
- **Smooth Transitions**: Hover effects and state transitions
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Beautiful dark color scheme
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Author

Your Name
- GitHub: [@Ravi-Makwana18](https://github.com/Ravi-Makwana18)
- LinkedIn: [Ravi Makwana](https://www.linkedin.com/in/ravi-makwana1/)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- GitHub for the comprehensive API
- Vercel for seamless deployment
- Tailwind CSS for utility-first styling
- Lucide for beautiful icons

## 📞 Support

If you have any questions or issues, please open an issue on GitHub or contact me directly.

---
