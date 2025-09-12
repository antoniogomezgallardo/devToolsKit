# 📋 Project Context - DevToolsKit

## 🎯 Project Overview

**DevToolsKit** is a modern web application providing essential developer tools that run entirely in the browser. The project emphasizes performance, privacy, and user experience while maintaining monetization potential through Google AdSense.

### Core Philosophy
- **Client-side only**: All tools run in the browser for privacy and performance
- **No registration**: Zero-friction access to all tools
- **Performance-first**: Lighthouse scores >95, Core Web Vitals optimized
- **Developer-friendly**: Clean code, comprehensive testing, excellent documentation

## 🚀 Current Status

- **Version**: 0.6.0
- **Phase**: Phase 3 Complete - Advanced Automation & Tool Expansion
- **Live URL**: https://onlinedevtoolskit.com
- **Analytics**: Google Analytics 4 (ID: G-G8CSCGH4HS)
- **Testing Coverage**: >80% with 91 unit tests + 61 E2E tests
- **Claude Code**: Phase 3 Power User Complete with MCP integrations

## 📅 Project History

### Phase 1: MVP Foundation (Weeks 1-2) ✅
**Completed**: Initial release with core infrastructure
- Parcel + TypeScript + Tailwind CSS setup
- JSON Validator implementation
- Vercel deployment with custom domain
- GitFlow workflow establishment
- Basic SEO and responsive design

### Phase 2: SEO & Analytics (Weeks 3-4) ✅
**Completed**: Complete SEO foundation
- Google Analytics 4 integration with 15+ custom events
- Schema.org structured data implementation
- Core Web Vitals monitoring
- PWA manifest configuration
- Dynamic meta tags and OpenGraph support
- Sitemap.xml optimization

### Phase 3: Tool Expansion & Automation (Month 2) ✅
**Completed**: Advanced features and automation
- JWT Decoder with expiration validation
- Base64 Encoder/Decoder with file support
- Locator Generator for test automation
- Comprehensive testing framework (Vitest + Playwright)
- Claude Code Power User Phase 3 complete
- MCP integrations (Vercel, GitHub, Lighthouse CI)
- 3-4x development velocity achieved

### Phase 4: Advanced Features (Current)
**In Progress**: Premium tools and enhancements
- Password Generator (planned)
- Color Palette Generator (planned)
- Dark mode implementation
- PWA with offline support
- Advanced user preferences

## 🛠️ Technology Stack

### Frontend
- **Build Tool**: Parcel v2.12.0 (optimized for Vercel)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.x
- **Icons**: Heroicons

### Testing
- **Unit Tests**: Vitest
- **E2E Tests**: Playwright
- **CI/CD**: GitHub Actions
- **Coverage**: >80% requirement

### Infrastructure
- **Hosting**: Vercel (automatic deployments)
- **Domain**: onlinedevtoolskit.com
- **Analytics**: Google Analytics 4
- **Performance**: Core Web Vitals monitoring

### Development
- **Version Control**: Git with GitFlow
- **Branch Protection**: Tests required for main
- **Code Quality**: TypeScript strict, ESLint
- **Documentation**: Comprehensive markdown docs

## 🌊 GitFlow Workflow

```
main ────────●────────●  (Production releases only)
            /        /
develop ────●────●────●  (Integration branch)
           /    /
feature/  ●────●        (New features/tools)
```

### Branch Rules
- **main**: Protected, production releases only
- **develop**: Integration branch for features
- **feature/***: All new development
- **release/***: Version preparation
- **hotfix/***: Emergency production fixes

## 🎯 Project Goals

### Short-term (Phase 4)
- Complete 10+ developer tools
- Achieve 100% Lighthouse scores
- Implement dark mode
- Add PWA offline support

### Medium-term
- 15-20 tools total
- Google AdSense monetization
- Multi-language support (Spanish priority)
- Community contributions

### Long-term
- Industry-leading tool collection
- Premium features/API
- Mobile applications
- Enterprise solutions

## 🤖 Claude Code Power User Features

### Implemented (Phase 3)
- **8 Specialized Agents**: tool-builder, e2e-tester, seo-optimizer, docs-writer, etc.
- **10 Custom Commands**: /new-tool, /test-complete, /deploy-staging-mcp, etc.
- **Plan Mode**: Default safe exploration
- **MCP Integrations**: Vercel, GitHub, Lighthouse CI

### Benefits Achieved
- **3-4x Development Velocity**: Tool creation in 2-3 hours vs 6-8 hours
- **100% Test Coverage Capability**: Automated testing workflows
- **Zero-Touch Deployments**: Complete CI/CD automation
- **Predictive Quality Gates**: Automated performance monitoring

## 📊 Key Metrics

### Performance
- **Lighthouse Score**: >95 (target: 100)
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3.5s
- **Cumulative Layout Shift**: <0.1

### Quality
- **Test Coverage**: >80%
- **TypeScript Strict**: Enabled
- **Accessibility**: WCAG 2.1 AA target
- **Browser Support**: Chrome, Firefox, Safari, Edge

### Business
- **Analytics**: GA4 with custom events
- **SEO**: Complete technical implementation
- **Monetization**: AdSense ready
- **User Experience**: No registration required

## 🔗 Important Links

### Production
- **Live Site**: https://onlinedevtoolskit.com
- **Analytics**: Google Analytics Dashboard
- **Performance**: Vercel Analytics

### Development
- **Repository**: https://github.com/antoniogomezgallardo/devToolsKit
- **CI/CD**: GitHub Actions
- **Documentation**: /docs folder

### Resources
- **Claude Code Guide**: docs/CLAUDE_CODE_POWER_USER_GUIDE.md
- **Architecture**: docs/ARCHITECTURE.md
- **Contributing**: CONTRIBUTING.md
- **Roadmap**: ROADMAP.md

## 🚨 Critical Information

### Always Remember
1. **GitFlow is mandatory**: Never commit to main directly
2. **Tests are required**: CI/CD blocks merges without passing tests
3. **Current version**: 0.6.0 (update package.json + README.md)
4. **Phase status**: Phase 3 Complete
5. **Language**: Spanish interface, English documentation

### Common Tasks
```bash
# Start development
npm run dev

# Run tests
npm run test:run
npm run test:e2e

# Build for production
npm run build

# Type checking
npm run type-check
```

### Quick Fixes
- **Build errors**: Check Parcel cache, run `npm run clean`
- **Test failures**: Update snapshots with `npm run test:update`
- **Type errors**: Run `npm run type-check` before committing
- **Deploy issues**: Verify Vercel configuration

---

**Last Updated**: 2025-09-12
**Current Phase**: Phase 3 Complete - Phase 4 In Progress
**Next Milestone**: Password Generator Tool Implementation