# Claude Code Power User Guide 🚀

**DevToolsKit Project Edition**

> Transform your Claude Code workflow from basic usage to expert-level productivity with specialized agents, custom commands, plan mode, and external integrations.

---

## 📚 Table of Contents

1. [What Makes a Claude Code Power User?](#what-makes-a-claude-code-power-user)
2. [🤖 Subagents - Specialized AI Assistants](#-subagents---specialized-ai-assistants)
3. [📝 Custom Commands - Project Shortcuts](#-custom-commands---project-shortcuts)
4. [📋 Plan Mode - Safe Code Analysis](#-plan-mode---safe-code-analysis)
5. [🔌 MCP - External Tool Integration](#-mcp---external-tool-integration)
6. [🗺️ Implementation Roadmap](#️-implementation-roadmap)
7. [⚡ Quick Reference Cheat Sheet](#-quick-reference-cheat-sheet)

---

## What Makes a Claude Code Power User?

A Claude Code power user leverages advanced features to create **specialized, efficient, and reusable workflows** that go far beyond simple chat interactions. They use:

- **🤖 Specialized Subagents** for focused expertise
- **📝 Custom Commands** for instant workflow access  
- **📋 Plan Mode** for safe code exploration
- **🔌 MCP Integrations** for external tool connectivity
- **🔄 Workflow Automation** for repetitive tasks

**Power users don't just code with Claude - they architect their development experience.**

---

## 🤖 Subagents - Specialized AI Assistants

### What Are Subagents?

Subagents are **specialized AI assistants** that operate in separate context windows, each with focused expertise, custom system prompts, and specific tool access. Think of them as having a team of specialists rather than one generalist.

### Key Benefits

- **🎯 Focused Expertise**: Each agent specializes in specific domains
- **💾 Context Preservation**: Main conversation stays clean and focused
- **♻️ Reusable Across Projects**: User-level agents work everywhere
- **🛡️ Controlled Tool Access**: Agents only get tools they need

### Configuration

**Project-Level Agents**: `.claude/agents/` (shared with team)
**User-Level Agents**: `~/.claude/agents/` (personal use)

### DevToolsKit-Specific Subagents

#### 1. 🛠️ Tool-Builder Agent

**Purpose**: Specialized in creating new developer tools following DevToolsKit patterns

**Configuration File**: `.claude/agents/tool-builder.md`

```markdown
# Tool Builder Agent

You are an expert tool builder specializing in the DevToolsKit project. Your expertise includes:

## Stack Knowledge
- Parcel + TypeScript + Tailwind CSS build system
- Client-side tool architecture patterns
- DevToolsKit component structure and conventions

## Responsibilities  
- Create complete tool implementations following project patterns
- Set up proper TypeScript types and interfaces
- Implement responsive Tailwind UI matching existing tools
- Add comprehensive E2E tests using Playwright
- Update analytics tracking and SEO metadata
- Follow GitFlow methodology for all changes

## Tools Available
- Read, Write, Edit, MultiEdit (file operations)
- Bash (for testing and git operations)
- Glob, Grep (for code exploration)

When creating a new tool:
1. Analyze existing tools for patterns
2. Create complete folder structure in `src/tools/[tool-name]/`
3. Implement TypeScript classes following existing patterns
4. Add E2E tests in `tests/e2e/[tool-name].spec.ts`
5. Update analytics configuration
6. Update main routing and tool constants

Always follow the established patterns and maintain code consistency.
```

**Usage Example**:
```
/agents tool-builder
> "Create a new URL Shortener tool following our project patterns"
```

#### 2. 🎭 E2E-Tester Agent

**Purpose**: Testing specialist for comprehensive E2E test coverage

**Configuration File**: `.claude/agents/e2e-tester.md`

```markdown
# E2E Testing Specialist Agent

You are an expert E2E testing specialist for the DevToolsKit project using Playwright.

## Expertise
- Playwright test framework and best practices  
- Cross-browser testing (Chrome, Firefox, Safari)
- Responsive design testing (320px - 1920px)
- DevToolsKit tool interaction patterns
- CI/CD testing integration

## Responsibilities
- Create comprehensive E2E tests for all tools
- Test copy-to-clipboard functionality
- Verify responsive behavior across breakpoints
- Test error handling and edge cases
- Maintain test performance (target: <3min total suite)

## Testing Patterns for DevToolsKit Tools
- Homepage navigation and tool cards
- Input/output validation
- Copy functionality verification
- Error state handling
- Responsive layout verification
- SEO meta tag validation

## Tools Available
- Read (for analyzing existing tests)
- Write, Edit (for creating test files)
- Bash (for running test suites)
- Grep, Glob (for finding test patterns)

Always ensure tests are reliable, fast, and cover real user workflows.
```

**Usage Example**:
```
/agents e2e-tester
> "Create comprehensive E2E tests for the new Color Palette Generator tool"
```

#### 3. 📊 SEO-Optimizer Agent

**Purpose**: Expert in web performance, SEO, and analytics

**Configuration File**: `.claude/agents/seo-optimizer.md`

```markdown
# SEO & Performance Optimizer Agent

You are an SEO and performance optimization expert for the DevToolsKit project.

## Expertise
- Google Analytics 4 implementation and tracking
- Schema.org structured data markup
- Core Web Vitals optimization
- Meta tags and OpenGraph optimization
- Performance monitoring and improvements

## Responsibilities
- Update analytics tracking for new tools
- Optimize structured data markup
- Monitor and improve Core Web Vitals
- Update meta tags for new pages
- Performance audit and optimization recommendations

## DevToolsKit Context
- GA4 ID: G-G8CSCGH4HS
- Current performance targets: 95+ Lighthouse score
- SEO infrastructure in `src/utils/` directory
- Tool-specific tracking patterns established

## Tools Available
- Read, Edit (for updating SEO files)
- Grep, Glob (for finding optimization opportunities)
- WebFetch (for checking current performance)

Focus on maintaining high performance while adding new features.
```

#### 4. 📚 Documentation-Writer Agent  

**Purpose**: Technical documentation specialist

**Configuration File**: `.claude/agents/docs-writer.md`

```markdown
# Documentation Writer Agent

You are a technical documentation specialist for the DevToolsKit project.

## Expertise
- Technical documentation best practices
- DevToolsKit project structure and conventions
- Markdown formatting and organization
- Version management and changelog maintenance

## Responsibilities
- Update README.md with new features
- Maintain CONTEXT.md project documentation
- Create tool-specific documentation
- Update version information across project
- Maintain consistent documentation style

## Documentation Structure
- README.md: Main project documentation
- CONTEXT.md: Complete project context
- docs/: Technical guides and references
- Tool-specific: Individual tool documentation

## Tools Available
- Read, Write, Edit, MultiEdit (documentation files)
- Grep, Glob (for finding documentation patterns)
- Bash (for version checking)

Always maintain consistency with existing documentation style and structure.
```

### How to Create and Use Subagents

#### Step 1: Create Agent Configuration
```bash
# Create project-specific agent
mkdir -p .claude/agents
```

#### Step 2: Use the Agent
```bash
# Invoke specific agent
/agents tool-builder

# Then interact with the specialized agent
> "Create a new Password Generator tool with strength indicators"
```

#### Step 3: Agent Benefits in Action
- **Focused Context**: Agent knows only tool-building patterns
- **Consistent Results**: Follows established project conventions  
- **Efficient Workflow**: No need to explain project structure each time

---

## 📝 Custom Commands - Project Shortcuts

### What Are Custom Commands?

Custom slash commands that provide **instant access to predefined workflows**. They're stored as Markdown files and can accept dynamic arguments.

### Configuration Locations

- **Project Commands**: `.claude/commands/` (shared with team)
- **Personal Commands**: `~/.claude/commands/` (individual use)

### DevToolsKit Custom Commands

#### 1. `/new-tool [tool-name]`

**File**: `.claude/commands/new-tool.md`

```markdown
Create a complete new developer tool following DevToolsKit patterns.

Tool name: $ARGUMENTS

Please:
1. Analyze existing tool patterns in src/tools/
2. Create complete folder structure for the new tool
3. Implement TypeScript classes following project conventions
4. Add responsive Tailwind UI matching existing design
5. Create comprehensive E2E tests
6. Update analytics tracking configuration
7. Add tool to main routing and constants
8. Update README.md with new tool information

Follow GitFlow: create feature branch, implement, test, then merge to develop.
```

**Usage**:
```
/new-tool Color Palette Generator
```

#### 2. `/test-complete`

**File**: `.claude/commands/test-complete.md`

```markdown
Run the complete test suite for DevToolsKit including:
1. TypeScript type checking
2. Unit tests with Vitest
3. E2E tests with Playwright
4. Build verification
5. Performance check

Report any failures with specific details and suggested fixes.
```

#### 3. `/release-prep [version]`

**File**: `.claude/commands/release-prep.md`

```markdown
Prepare a new release following GitFlow methodology.

Target version: $ARGUMENTS

Steps to complete:
1. Verify we're on develop branch with clean working directory
2. Run complete test suite and ensure all tests pass
3. Create release branch: release/v$ARGUMENTS
4. Update version in package.json and any documentation
5. Create release commit with changelog
6. Provide instructions for final release merge to main

Follow GitFlow strictly - no direct commits to main.
```

#### 4. `/update-analytics [tool-name]`

**File**: `.claude/commands/update-analytics.md`

```markdown
Update Google Analytics 4 tracking for a new tool.

Tool name: $ARGUMENTS

Please update:
1. Add tool name to ToolNames enum in src/utils/analytics.ts
2. Add specific tracking events if needed
3. Create tool-specific tracking function
4. Update meta tags in src/utils/metaTags.ts
5. Add structured data if appropriate
6. Verify GA4 integration works correctly

Test the implementation with the new tool.
```

#### 5. `/deploy-staging`

**File**: `.claude/commands/deploy-staging.md`

```markdown
Deploy current develop branch to Vercel staging environment.

Steps:
1. Verify develop branch is clean and up-to-date
2. Run production build locally to verify
3. Push develop to origin if needed
4. Check Vercel deployment status
5. Verify staging environment is working
6. Report staging URL and any issues found

This is safe for testing before production release.
```

### How to Create Custom Commands

#### Step 1: Create Command File
```bash
# Create project command directory
mkdir -p .claude/commands

# Create command file
touch .claude/commands/my-command.md
```

#### Step 2: Define Command Logic
```markdown
# Command description
Brief description of what this command does.

## Parameters
- $ARGUMENTS: Dynamic input from user

## Command logic here...
```

#### Step 3: Use the Command
```bash
/my-command some arguments here
```

---

## 📋 Plan Mode - Safe Code Analysis

### What Is Plan Mode?

Plan Mode is a **read-only exploration mode** that allows comprehensive codebase analysis and change planning without making any modifications. Perfect for complex implementations and architectural decisions.

### Key Features

- **🔒 Read-Only**: No file modifications or system changes
- **🔍 Deep Analysis**: Thorough codebase exploration
- **📊 Planning**: Multi-step implementation strategies  
- **🛡️ Safety**: Risk-free code exploration

### When to Use Plan Mode

#### ✅ Perfect For:
- **New Tool Architecture**: Plan implementation before coding
- **Performance Optimization**: Identify bottlenecks safely
- **Refactoring Planning**: Understand impact before changes
- **Code Reviews**: Analyze changes without modifications
- **Learning**: Explore unfamiliar codebases safely

#### ❌ Not Ideal For:
- **Simple Edits**: Single file changes
- **Quick Fixes**: Minor bug fixes
- **Documentation Updates**: Straightforward content changes

### DevToolsKit Plan Mode Applications

#### 1. 🏗️ New Tool Architecture Planning

**Scenario**: Planning a complex tool like "API Testing Suite"

**Plan Mode Workflow**:
```
1. Analyze existing tool patterns
2. Research API testing requirements  
3. Plan component architecture
4. Identify required dependencies
5. Design testing strategy
6. Plan SEO and analytics integration
7. Create implementation roadmap
```

**Benefits**: 
- Complete understanding before implementation
- Identify potential issues early
- Plan testing strategy upfront

#### 2. 📈 Performance Optimization

**Scenario**: Improving Core Web Vitals scores

**Plan Mode Workflow**:
```
1. Analyze current performance bottlenecks
2. Review bundle size and dependencies
3. Identify optimization opportunities
4. Plan implementation strategy
5. Research impact on existing functionality
6. Create performance improvement roadmap
```

#### 3. 🔄 Framework Migration Planning

**Scenario**: Considering migration from Parcel to Vite

**Plan Mode Workflow**:
```
1. Analyze current Parcel configuration
2. Research Vite migration requirements
3. Identify breaking changes
4. Plan migration strategy
5. Assess testing impact
6. Create step-by-step migration plan
```

### Activating Plan Mode

#### Method 1: Command Line Flag
```bash
claude --permission-mode plan
```

#### Method 2: Configuration File
Create `.claude/settings.json`:
```json
{
  "permission-mode": "plan"
}
```

#### Method 3: On-Demand
Plan mode can be triggered automatically for complex requests.

---

## 🔌 MCP - External Tool Integration

### What Is MCP?

**Model Context Protocol** is an open-source standard that connects Claude Code to hundreds of external tools, databases, and APIs. Think of it as giving Claude superpowers to interact with your entire development ecosystem.

### Connection Types

#### 1. 🖥️ Local Stdio Servers
- Run as local processes
- Direct system access
- Custom scripts and tools

#### 2. 🌐 Remote SSE Servers  
- Real-time streaming connections
- Live updates and monitoring
- Cloud service integrations

#### 3. 🔗 Remote HTTP Servers
- Standard REST API patterns
- Most web services
- OAuth 2.0 authentication support

### DevToolsKit MCP Applications

#### 1. 🚀 Vercel Integration

**Use Case**: Deploy and manage hosting directly from Claude Code

**Setup**:
```bash
claude mcp add vercel -- npx -y vercel-mcp-server
```

**Applications**:
- Deploy staging environments
- Monitor deployment status
- Manage environment variables
- Check performance metrics

**Example Queries**:
```
> "Deploy current develop branch to staging"
> "What's the status of our latest deployment?"
> "Show me the Core Web Vitals for our production site"
```

#### 2. 🐙 GitHub Integration

**Use Case**: Manage repositories, issues, and pull requests

**Setup**:
```bash
claude mcp add github -- npx -y github-mcp-server
```

**Applications**:
- Create and manage issues
- Review and merge pull requests
- Manage releases and tags
- Monitor repository activity

**Example Queries**:
```
> "Create an issue for implementing Password Generator tool"
> "Show me open PRs that need review"
> "Create a release for version 0.7.0"
```

#### 3. 📊 Google Analytics Integration

**Use Case**: Query performance data and user behavior

**Setup** (hypothetical):
```bash
claude mcp add analytics -- npx -y ga4-mcp-server
```

**Applications**:
- Query user behavior data
- Monitor tool usage statistics
- Track performance metrics
- Generate usage reports

**Example Queries**:
```
> "Which tools are most popular this month?"
> "Show me Core Web Vitals trends for the last 30 days"
> "How many users tried the Base64 tool this week?"
```

#### 4. 🗄️ Database Integration

**Use Case**: If DevToolsKit adds user data storage

**Setup**:
```bash
claude mcp add postgres -- npx -y postgres-mcp-server
```

**Applications**:
- Query user data
- Analyze usage patterns  
- Generate reports
- Manage database schema

#### 5. 📱 Monitoring Integration  

**Use Case**: Track errors and performance

**Potential Integrations**:
- **Sentry**: Error monitoring
- **DataDog**: Performance monitoring
- **Lighthouse CI**: Automated performance testing

### MCP Security Best Practices

#### ✅ Safe Practices:
- **Verify Sources**: Only install trusted MCP servers
- **Review Permissions**: Understand what access you're granting
- **Use Authentication**: Implement proper OAuth 2.0 flows
- **Monitor Usage**: Track MCP server activity

#### ⚠️ Cautions:
- **Untrusted Content**: Be careful with servers that fetch external data
- **Sensitive Data**: Don't expose secrets or credentials
- **Token Limits**: Large outputs may hit usage limits

### Getting Started with MCP

#### Step 1: Explore Available Servers
```bash
# List available MCP servers
claude mcp list
```

#### Step 2: Install Your First Server
```bash
# Example: Install a safe, useful server
claude mcp add json-server -- npx -y json-server-mcp
```

#### Step 3: Test Integration
```
> "Help me query some JSON data"
```

#### Step 4: Gradually Expand
Add more servers as you identify specific use cases.

---

## 🗺️ Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
**Goal**: Establish basic power user capabilities

#### ✅ Core Setup:
1. **Create Essential Subagents**:
   - Tool-Builder Agent
   - E2E-Tester Agent

2. **Implement Key Commands**:
   - `/new-tool [name]`  
   - `/test-complete`

3. **Configure Plan Mode**:
   - Set as default for complex requests
   - Practice with existing codebase exploration

#### 🎯 Success Metrics:
- Create one new tool using subagent
- Successfully run complete test suite via command
- Complete one plan mode architectural review

### Phase 2: Specialization (Week 3-4)
**Goal**: Add specialized workflows and documentation

#### ✅ Enhanced Capabilities:
1. **Add Specialist Agents**:
   - SEO-Optimizer Agent
   - Documentation-Writer Agent

2. **Expand Command Library**:
   - `/release-prep [version]`
   - `/update-analytics [tool]`
   - `/deploy-staging`

3. **Workflow Integration**:
   - Integrate agents into daily development
   - Refine command parameters based on usage

#### 🎯 Success Metrics:
- Complete release preparation using commands
- Update analytics for new tool using agent
- Generate comprehensive documentation automatically

### Phase 3: External Integration (Week 5-6)
**Goal**: Connect external tools and services

#### ✅ MCP Integration:
1. **Essential Integrations**:
   - Vercel MCP (deployment management)
   - GitHub MCP (repository management)

2. **Advanced Integrations**:
   - Monitoring MCP (error tracking)
   - Analytics MCP (data querying)

3. **Workflow Automation**:
   - End-to-end deployment pipelines
   - Automated monitoring and alerting

#### 🎯 Success Metrics:
- Deploy directly through Claude Code
- Query production metrics via MCP
- Manage GitHub issues and PRs seamlessly

### Phase 4: Optimization (Week 7-8)
**Goal**: Fine-tune and optimize workflows

#### ✅ Refinement:
1. **Agent Optimization**:
   - Refine system prompts based on performance
   - Add specialized knowledge from experience
   - Optimize tool access and permissions

2. **Command Enhancement**:
   - Add advanced command features
   - Create command chains for complex workflows
   - Implement argument validation and help text

3. **MCP Expansion**:
   - Add project-specific integrations
   - Create custom MCP servers if needed
   - Optimize authentication and security

#### 🎯 Success Metrics:
- 90% of development tasks use power user features
- Zero manual deployment or testing processes
- Complete development workflow automation

---

## ⚡ Quick Reference Cheat Sheet

### 🤖 Subagents

```bash
# Create new agent
/agents

# Use specific agent (after creation)
/agents tool-builder
/agents e2e-tester
/agents seo-optimizer
/agents docs-writer
```

**Agent Locations**:
- Project: `.claude/agents/`
- Personal: `~/.claude/agents/`

### 📝 Custom Commands

```bash
# DevToolsKit Commands
/new-tool [tool-name]           # Create new tool
/test-complete                  # Run full test suite
/release-prep [version]         # Prepare release
/update-analytics [tool-name]   # Add tracking
/deploy-staging                 # Deploy to staging
```

**Command Locations**:
- Project: `.claude/commands/`
- Personal: `~/.claude/commands/`

### 📋 Plan Mode

```bash
# Activate plan mode
claude --permission-mode plan

# Or set as default in .claude/settings.json:
{
  "permission-mode": "plan"
}
```

**Best For**: Architecture planning, complex refactoring, performance optimization

### 🔌 MCP Commands

```bash
# List available servers
claude mcp list

# Add server
claude mcp add [name] -- [command]

# Remove server  
claude mcp remove [name]

# Example integrations
claude mcp add vercel -- npx -y vercel-mcp-server
claude mcp add github -- npx -y github-mcp-server
```

### 🚀 Power User Workflow

```bash
# 1. Plan new feature
claude --permission-mode plan
> "Analyze requirements for Password Generator tool"

# 2. Create tool using agent
/agents tool-builder
> "Create Password Generator following DevToolsKit patterns"

# 3. Run comprehensive tests
/test-complete

# 4. Prepare release
/release-prep 0.7.0

# 5. Deploy via MCP
> "Deploy to staging environment"
```

---

## 🎓 Becoming a Power User

### 🔄 Daily Practice

1. **Start Small**: Use one new feature per day
2. **Build Habits**: Integrate power features into routine workflows
3. **Document Learning**: Keep notes on what works best
4. **Iterate**: Continuously refine configurations

### 📈 Progress Tracking

**Week 1**: Basic subagents and commands
**Week 2**: Plan mode for complex tasks  
**Week 3**: MCP integrations
**Week 4**: Fully automated development workflow

### 🏆 Power User Mastery

You'll know you're a Claude Code power user when:

- ✅ 80% of development tasks use specialized agents
- ✅ All repetitive workflows are automated with commands
- ✅ Complex planning always starts with plan mode
- ✅ External tools are seamlessly integrated via MCP
- ✅ You think in workflows, not individual tasks

---

## 📞 Getting Help

### 📚 Official Documentation
- [Claude Code Docs](https://docs.anthropic.com/en/docs/claude-code/)
- [Subagents Guide](https://docs.anthropic.com/en/docs/claude-code/sub-agents.md)
- [MCP Documentation](https://docs.anthropic.com/en/docs/claude-code/mcp.md)

### 🆘 DevToolsKit Support
- Check `CLAUDE.md` for project-specific configurations
- Reference `CONTEXT.md` for complete project understanding
- Use `/help` command for Claude Code assistance

---

**Ready to transform your development workflow? Start with Phase 1 and begin your journey to Claude Code mastery! 🚀**