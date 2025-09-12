# 🚀 Getting Started with DevToolsKit

**Quick setup guide to get DevToolsKit running locally in under 5 minutes.**

---

## 📋 Prerequisites

### **Required Software**
- **Node.js** >= 20.19.0 ([Download](https://nodejs.org/))
- **npm** >= 10.x (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Modern Browser** (Chrome, Firefox, Safari, Edge)

### **Optional but Recommended**
- **VS Code** with Claude Code extension
- **GitHub CLI** for repository management
- **Vercel CLI** for deployment

---

## ⚡ Quick Setup (5 Minutes)

### **Step 1: Clone Repository**
```bash
git clone https://github.com/antoniogomezgallardo/devToolsKit.git
cd devToolsKit
```

### **Step 2: Install Dependencies**
```bash
npm install
```
*This installs all required packages including TypeScript, Parcel, testing frameworks, etc.*

### **Step 3: Start Development Server**
```bash
npm run dev
```
*Development server starts at http://localhost:1234*

### **Step 4: Open in Browser**
Navigate to **http://localhost:1234** and you should see:
- ✅ DevToolsKit homepage
- ✅ 4 working tools (JSON Validator, JWT Decoder, Base64, Locator Generator)
- ✅ Responsive design on all screen sizes

### **Step 5: Verify Setup**
```bash
# Run tests to ensure everything works
npm run test:run

# Check TypeScript compilation
npm run type-check

# Test production build
npm run build
```

**🎉 Success!** You now have DevToolsKit running locally.

---

## 🔧 Development Environment Setup

### **VS Code Configuration**

Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "claude.code.autoSuggestAgents": true,
  "claude.code.defaultMode": "plan",
  "claude.code.quickCommands": [
    "/test-complete",
    "/new-tool",
    "/agents tool-builder"
  ]
}
```

### **Recommended VS Code Extensions**
```bash
# Essential extensions
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss

# Claude Code integration (if available)
code --install-extension anthropic.claude-code
```

### **Git Configuration**
```bash
# Set up Git for DevToolsKit workflow
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Set up GitFlow if not already configured
git flow init
```

---

## 📁 Project Structure Overview

```
devToolsKit/
├── src/                     # Source code
│   ├── tools/              # Individual tools (JSON, JWT, etc.)
│   ├── components/         # Reusable UI components
│   ├── utils/              # Utilities (analytics, SEO, etc.)
│   └── types/              # TypeScript type definitions
├── tests/                   # Testing framework
│   ├── unit/               # Unit tests (Vitest)
│   └── e2e/                # End-to-end tests (Playwright)
├── docs/                    # Documentation (you are here!)
├── .claude/                 # Claude Code configuration
│   ├── agents/             # Specialized AI agents
│   └── commands/           # Custom slash commands
├── public/                  # Static assets
└── dist/                    # Production build output
```

---

## 🎯 Your First Tool

Let's create your first tool to understand the development workflow:

### **Option 1: Using Claude Code Power User (Recommended)**
```bash
# Create a simple URL Encoder tool
/new-tool URL Encoder
```
*This uses the tool-builder agent to create a complete tool with testing and documentation.*

### **Option 2: Manual Creation**
```bash
# Create tool directory
mkdir src/tools/url-encoder
cd src/tools/url-encoder

# Create basic files
touch index.ts URLEncoder.ts utils.ts types.ts
```

**See [Creating New Tools Guide](guides/CREATING_NEW_TOOLS.md) for complete instructions.**

---

## 🧪 Testing Your Setup

### **Run All Tests**
```bash
# Complete test suite
npm run test:run          # Unit tests
npm run test:e2e          # E2E tests  
npm run type-check        # TypeScript validation
npm run build             # Production build test
```

### **Individual Test Commands**  
```bash
# Unit tests with watch mode
npm run test

# E2E tests with UI
npm run test:e2e:ui

# Test coverage report
npm run test:coverage
```

### **Performance Validation**
```bash
# Build and analyze bundle
npm run build
ls -la dist/

# Check lighthouse score (manual)
# Open http://localhost:1234 in Chrome DevTools
```

---

## 🤖 Claude Code Power User Setup

DevToolsKit includes advanced Claude Code integration for supercharged development:

### **Verify Claude Code Configuration**
```bash
# Check if .claude/ directory exists
ls -la .claude/

# Should show:
# agents/     - Specialized AI agents
# commands/   - Custom slash commands  
# settings.json - Project configuration
```

### **Test Power User Features**
```bash
# Test custom commands
/test-complete           # Run complete test suite
/new-tool Test Tool      # Create new tool

# Test specialized agents
/agents tool-builder     # Tool creation specialist
/agents seo-optimizer    # SEO and performance expert
```

**See [Power User Guide](CLAUDE_CODE_POWER_USER_GUIDE.md) for complete features.**

---

## 🚦 Development Workflow

### **Daily Development**
```bash
# Start development session
git checkout develop
git pull origin develop
npm run dev

# Create new feature
git checkout -b feature/my-new-feature

# Develop → Test → Commit
npm run test
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/my-new-feature
```

### **Quality Assurance**
```bash
# Before committing any code
npm run type-check       # TypeScript validation
npm run test:run         # Unit tests
npm run test:e2e         # E2E tests
npm run build            # Production build
```

### **GitFlow Workflow**
- **develop**: Main development branch
- **feature/**: New features and improvements  
- **release/**: Release preparation
- **main**: Production releases only

**See [GitFlow Reference](workflows/GITFLOW_REFERENCE.md) for complete workflow.**

---

## 🔧 Common Issues & Solutions

### **Port 1234 Already in Use**
```bash
# Kill process using port 1234
lsof -ti:1234 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### **Node Version Issues**
```bash
# Check Node version
node --version  # Should be >= 20.19.0

# Use nvm if you have multiple Node versions
nvm use 20.19.0
```

### **Install Issues**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **Test Failures**
```bash
# Update Playwright browsers
npm run playwright:install

# Check TypeScript first
npm run type-check

# Run tests individually to isolate issues
npm run test -- json-validator.test.ts
```

---

## 📞 Getting Help

### **Documentation**
- **[Development Guide](DEVELOPMENT.md)** - Detailed development workflows
- **[Architecture](ARCHITECTURE.md)** - Technical architecture
- **[Troubleshooting](workflows/TROUBLESHOOTING.md)** - Common problems and solutions

### **Community**
- **GitHub Issues** - Bug reports and feature requests
- **Discussions** - General questions and ideas
- **Claude Code Support** - Power user feature help

---

## 🎯 Next Steps

Now that you have DevToolsKit running:

1. **[Explore the Architecture](ARCHITECTURE.md)** - Understand how everything works
2. **[Learn the Development Workflow](DEVELOPMENT.md)** - Master the development process
3. **[Create Your First Tool](guides/CREATING_NEW_TOOLS.md)** - Build something awesome
4. **[Become a Power User](CLAUDE_CODE_POWER_USER_GUIDE.md)** - Unlock advanced automation

**Ready to build amazing developer tools? Let's go! 🚀**

---

*Last updated: Version 0.6.0*