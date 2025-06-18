# Apollo Research Chrome Extension

A powerful Chrome extension that seamlessly integrates with the Apollo Research platform to extract, parse, and organize ArXiv research papers directly from your browser.

## ✨ Features

### 🔍 **Smart ArXiv Parser**
- **Auto-detection**: Automatically detects when you're on an ArXiv paper page
- **One-click parsing**: Extract comprehensive paper metadata with a single click
- **Rich data extraction**: Captures title, authors, abstract, subjects, dates, DOI, and more
- **Real-time updates**: Syncs with active browser tabs automatically

### 📚 **Project Integration**
- **Project selection**: Choose from your assigned Apollo Research projects
- **Seamless export**: Save parsed papers directly to project resources
- **Google OAuth**: Secure authentication with your Google account
- **User context**: Always know which project you're working with

### 🎨 **Apollo Design System**
- **Consistent branding**: Matches Apollo Research platform design
- **Responsive UI**: Optimized for Chrome's side panel interface
- **Professional appearance**: Clean, modern interface built with Tailwind CSS
- **Intuitive UX**: Clear visual feedback and status indicators

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Chrome browser (v88 or higher)
- Apollo Research platform account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd apollo-research-chrome-extension
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Update `src/lib/firebase.ts` with your Firebase configuration
   - Ensure proper OAuth2 client ID is set in `manifest.json`

4. **Build the extension**
   ```bash
   npm run build
   ```

5. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

## 📱 How to Use

### 1. **Sign In**
- Open the extension by clicking the Apollo icon in Chrome's toolbar
- Sign in with your Google account to access your Apollo Research projects

### 2. **Select Project**
- Choose from your assigned projects in the dropdown
- The extension will remember your selection across sessions

### 3. **Parse ArXiv Papers**
- Navigate to any ArXiv paper (e.g., `https://arxiv.org/abs/2506.14767`)
- Open the extension side panel
- Click "Parse Current Paper" when the green indicator shows "ArXiv Paper Detected"
- Review the extracted paper data

### 4. **Export to Project**
- With a paper parsed and project selected, click "Export to Project"
- The paper will be saved to your project's resources under the papers section

## 🏗️ Architecture

### **Tech Stack**
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with Apollo Design System
- **Build Tool**: Webpack 5
- **Authentication**: Firebase Auth with Google OAuth
- **Database**: Cloud Firestore
- **Extension API**: Chrome Extensions Manifest V3

### **Project Structure**
```
src/
├── app/                    # Main React application
│   ├── home.tsx           # Main component
│   ├── index.html         # Extension popup HTML
│   ├── index.tsx          # React entry point
│   └── styles.css         # Global styles
├── background/            # Background service worker
│   └── background.ts      # Extension background script
├── content/               # Content scripts
│   └── content.ts         # Page interaction scripts
├── components/            # React components
│   ├── ProjectSelector.tsx
│   └── ArXivParser.tsx
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Authentication hook
│   └── useProjects.ts     # Project management hook
├── lib/                   # Core libraries
│   └── firebase.ts        # Firebase configuration
├── services/              # Business logic
│   ├── projectService.ts  # Project data fetching
│   └── arxivService.ts    # ArXiv parsing logic
└── types/                 # TypeScript definitions
    └── project.ts         # Project-related types
```

### **Key Components**

#### **ArXiv Parser Service**
- Fetches ArXiv pages via background script to bypass CORS
- Parses HTML using DOM manipulation
- Extracts comprehensive metadata including DOI, subjects, and comments
- Converts to Apollo Research paper format

#### **Authentication System**
- Chrome Identity API integration for seamless OAuth
- Firebase Auth for secure user management
- Automatic token refresh and cleanup
- Extension-specific sign-in/out flow

#### **Project Management**
- Real-time project synchronization with Firestore
- Assignment-based project filtering
- Auto-selection of first available project
- Error handling and retry mechanisms

## 🔧 Development

### **Available Scripts**
```bash
npm run build          # Build production version
npm run dev            # Development build with watch mode
npm run clean          # Clean dist directory
npm run lint           # Run ESLint
npm run type-check     # TypeScript type checking
```

### **Build Configuration**
- **Webpack**: Custom configuration for Chrome extension requirements
- **TypeScript**: Strict type checking enabled
- **Tailwind CSS**: PostCSS processing with Apollo design tokens
- **Code splitting**: Optimized bundles for popup, background, and content scripts

### **Environment Setup**
1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase configuration values
3. Update OAuth2 client ID in `manifest.json`
4. Ensure proper host permissions for your domains

## 🌐 Chrome Extension Permissions

### **Required Permissions**
- `activeTab`: Access current tab information
- `tabs`: Tab management and URL detection  
- `storage`: Local data persistence
- `sidePanel`: Side panel interface
- `identity`: Google OAuth authentication

### **Host Permissions**
- `https://*.googleapis.com/*`: Google API access
- `https://*.firebaseapp.com/*`: Firebase services
- `https://export.arxiv.org/*`: ArXiv export functionality
- `https://arxiv.org/*`: ArXiv paper access

## 🔒 Security

- **Content Security Policy**: Strict CSP for extension pages
- **OAuth2 Flow**: Secure Google authentication
- **Permission Model**: Minimal required permissions
- **Data Encryption**: Firebase Auth handles token security
- **CORS Handling**: Background script proxy for external requests

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] Extension loads without errors
- [ ] Google OAuth sign-in works
- [ ] Project selection and persistence
- [ ] ArXiv page detection accuracy
- [ ] Paper parsing completeness
- [ ] Export functionality
- [ ] Tab switching behavior
- [ ] Sign-out and cleanup

### **Test Data**
Use these ArXiv papers for testing:
- `https://arxiv.org/abs/2506.14767` - Sample AI research paper
- `https://arxiv.org/abs/2301.07041` - Alternative test case

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact the Apollo Research team
- Check the [Apollo Research documentation](https://apollo-research.com/docs)

## 🚀 Roadmap

### **Upcoming Features**
- [ ] Bulk paper import from ArXiv searches
- [ ] PDF annotation and highlighting
- [ ] Citation export (BibTeX, APA, MLA)
- [ ] Research note-taking integration
- [ ] Collaborative paper sharing
- [ ] Advanced search and filtering

---

**Built with ❤️ for the Apollo Research Platform**