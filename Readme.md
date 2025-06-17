# Chrome Extension React Scaffold

A production-ready scaffold for building Chrome extensions with React, TypeScript, and Tailwind CSS. Supports both **Popup** and **Side Panel** modes with easy configuration switching.

![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3-38bdf8)

![Sidepanel](https://ik.imagekit.io/zhcmdyuhw/sidepanel.png?updatedAt=1750188862629)

![Popup](https://ik.imagekit.io/zhcmdyuhw/popup.png?updatedAt=1750188862413)

## 🚀 Quick Start

```bash
# Clone or download this scaffold
git clone <your-repo> my-chrome-extension
cd my-chrome-extension

# Install dependencies
npm install

# Build for popup mode (default)
npm run build:popup

# Build for side panel mode (Chrome 114+)
npm run build:sidepanel

# Development mode with file watching
npm run dev:popup        # Popup mode
npm run dev:sidepanel    # Side panel mode
```

## 📁 Project Structure

```
chrome-extension-react-scaffold/
├── configs/
│   ├── manifest.popup.json      # Popup mode manifest
│   └── manifest.sidepanel.json  # Side panel mode manifest
├── src/
│   ├── popup/
│   │   ├── index.tsx            # React entry point
│   │   ├── Popup.tsx            # Main popup component (dynamic)
│   │   ├── popup.popup.html     # Popup mode HTML
│   │   ├── popup.sidepanel.html # Side panel mode HTML
│   │   └── styles.css           # Tailwind CSS
│   ├── background/
│   │   ├── background.popup.ts    # Popup mode background script
│   │   └── background.sidepanel.ts # Side panel mode background script
│   ├── content/
│   │   └── content.ts           # Content script (shared)
│   ├── types/
│   │   └── global.d.ts          # Chrome API type definitions
│   └── icons/                   # Extension icons
├── dist/                        # Build output (generated)
├── package.json
├── webpack.config.js            # Dynamic webpack config
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🎯 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build:popup` | Build for popup mode |
| `npm run build:sidepanel` | Build for side panel mode |
| `npm run dev:popup` | Development mode - popup |
| `npm run dev:sidepanel` | Development mode - side panel |
| `npm run build` | Build with default mode (popup) |
| `npm run dev` | Development with default mode (popup) |
| `npm run clean` | Clean dist directory |
| `npm run zip` | Build and create extension.zip |
| `npm run type-check` | Run TypeScript type checking |

## 🔧 Configuration Modes

### Popup Mode (Default)
- Traditional Chrome extension popup
- Compatible with all Chrome versions
- 380x500px popup window
- Activated by clicking extension icon

### Side Panel Mode (Chrome 114+)
- Persistent side panel interface
- Resizable by user
- Full browser height
- Opens via extension icon click
- Stays open across tab navigation

## 🚀 Getting Started with Your Extension

1. **Clone the scaffold:**
   ```bash
   git clone <repo-url> my-extension
   cd my-extension
   ```

2. **Customize your extension:**
   - Update `package.json` name and description
   - Modify manifests in `configs/` directory
   - Replace icons in `src/icons/`
   - Edit `src/popup/Popup.tsx` for your UI

3. **Choose your mode and build:**
   ```bash
   npm run build:popup     # or
   npm run build:sidepanel
   ```

4. **Load in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## 🎨 Customization

### Changing Extension Details
Edit the manifest files in `configs/`:
- `manifest.popup.json` - Popup mode configuration
- `manifest.sidepanel.json` - Side panel mode configuration

### Modifying UI
- **Main component:** `src/popup/Popup.tsx`
- **Styling:** Uses Tailwind CSS classes
- **Colors:** Modify `tailwind.config.js` for custom colors
- **Layout:** Component automatically adapts to popup/sidepanel mode

### Adding Features
- **Background tasks:** Edit `src/background/background.*.ts`
- **Content scripts:** Modify `src/content/content.ts`
- **Storage:** Uses `chrome.storage.sync` API
- **Messaging:** Built-in message passing system

### Chrome APIs Used
- `chrome.tabs` - Tab information and management
- `chrome.storage` - Persistent data storage
- `chrome.runtime` - Message passing and lifecycle
- `chrome.action` - Extension icon and badge
- `chrome.sidePanel` - Side panel API (Chrome 114+)

## 📦 Building for Production

```bash
# Clean and build
npm run clean
npm run build:popup  # or build:sidepanel

# Create distribution zip
npm run zip
```

The `extension.zip` file will be created in the project root, ready for Chrome Web Store submission.

## 🔍 Development Tips

1. **Hot Reloading:** Use `npm run dev:*` commands for file watching
2. **Type Safety:** TypeScript is configured for Chrome extension APIs
3. **Debugging:** Source maps enabled in development mode
4. **Testing:** Load unpacked extension for rapid iteration

## 🌟 Features Included

- ✅ React 18 with TypeScript
- ✅ Tailwind CSS for styling
- ✅ Webpack build system
- ✅ Chrome extension API types
- ✅ Hot reloading in development
- ✅ Popup and Side Panel modes
- ✅ Message passing system
- ✅ Storage management
- ✅ Content script integration
- ✅ Production optimization

## 📋 Browser Compatibility

- **Popup Mode:** Chrome 88+ (Manifest V3)
- **Side Panel Mode:** Chrome 114+ required

## 🤝 Contributing

This scaffold is designed to be forked and customized for your specific needs. Feel free to:
- Add new features
- Improve the build system
- Enhance the UI components
- Add more Chrome API integrations

## 📄 License

This scaffold is provided as-is for educational and commercial use.
