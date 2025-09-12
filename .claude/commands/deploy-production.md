# Deploy Production Command 🚀

**Complete production deployment workflow with MCP-powered automation, quality gates, and monitoring**

Target version: $ARGUMENTS

## 🎯 Command Purpose

Orchestrate a complete, safe production deployment of DevToolsKit with MCP-enhanced automation, comprehensive quality gates, automated testing, and post-deployment monitoring. This command leverages Model Context Protocol integrations for external tool connectivity and ensures zero-downtime deployments with automated rollback capabilities.

## 📋 Deployment Workflow

Please execute the following production deployment workflow for version **$ARGUMENTS**:

### **Phase 1: Pre-Deployment Validation** (5-10 minutes)
```bash
# 1. Environment Preparation
git checkout develop
git pull origin develop
git status  # Ensure clean working directory

# 2. Comprehensive Quality Gates  
npm run type-check              # TypeScript validation (required)
npm run test:run                # Unit test suite (91 tests must pass)
npm run test:e2e                # E2E test suite (61 tests must pass) 
npm run build                   # Production build verification
npm audit --audit-level=high    # Security vulnerability scan

# 3. Performance Validation
npm run audit:performance       # Lighthouse audit (score >95 required)
npm run audit:bundle           # Bundle size check (<500KB required)
```

### **Phase 2: Release Branch Creation** (2-3 minutes)
```bash
# Create GitFlow release branch
git checkout -b release/$ARGUMENTS

# Update version numbers across project
npm version $ARGUMENTS --no-git-tag-version

# Update version references in documentation
# - README.md version badge and references
# - CLAUDE.md project status section  
# - package.json version field
# - Any other version-specific documentation

# Commit version bump
git add .
git commit -m "release: bump version to $ARGUMENTS

- Update package.json to $ARGUMENTS
- Update README.md version references  
- Update documentation for release $ARGUMENTS
- All quality gates passed successfully

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### **Phase 3: Staging Deployment & Validation** (10-15 minutes)
```bash
# Push release branch for staging validation
git push origin release/$ARGUMENTS

# This triggers Vercel preview deployment automatically
# Staging URL: https://devtoolskit-git-release-$ARGUMENTS-user.vercel.app

# Run staging validation tests
npm run test:staging            # Smoke tests against staging
npm run audit:staging          # Performance audit on staging
npm run validate:tools:staging # Tool functionality validation

# Manual staging review checklist:
# ✅ All 4 tools function correctly
# ✅ Homepage navigation works
# ✅ Responsive design validated  
# ✅ Core Web Vitals are green
# ✅ Analytics tracking functional
# ✅ No JavaScript errors in console
```

### **Phase 4: Production Release** (3-5 minutes)  
```bash
# Merge to main branch for production deployment
git checkout main
git pull origin main
git merge release/$ARGUMENTS --no-ff -m "release: deploy $ARGUMENTS to production

Production release $ARGUMENTS includes:
- [List major features/changes added in this release]
- All quality gates passed (TypeScript, tests, performance, security)
- Staging validation completed successfully
- Ready for production deployment

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Create and push Git tag
git tag -a $ARGUMENTS -m "Release $ARGUMENTS: [Brief description]

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main --tags
# This triggers automatic Vercel production deployment
```

### **Phase 5: Post-Deployment Validation** (10-15 minutes)
```bash
# Immediate post-deployment checks
npm run test:smoke:production   # Critical functionality verification
npm run validate:vitals        # Core Web Vitals validation  
npm run check:uptime           # Site availability check
npm run validate:analytics     # Analytics tracking verification

# Monitor deployment health
npm run monitor:deployment     # 15-minute monitoring session
# Watch for:
# - Error rates <1%
# - Core Web Vitals remain green  
# - Tool functionality working
# - Analytics events firing correctly
# - No user complaints or issues

# Performance validation
# Target metrics after deployment:
# ✅ Lighthouse score >95
# ✅ LCP <2.5s, FID <100ms, CLS <0.1  
# ✅ Page load time <2s
# ✅ Error rate <1%
# ✅ All tools functional
```

### **Phase 6: Cleanup & Documentation** (3-5 minutes)
```bash
# Merge release back to develop
git checkout develop
git merge release/$ARGUMENTS -m "release: merge $ARGUMENTS back to develop

Post-release merge to keep develop branch up to date with production.

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Clean up release branch
git branch -d release/$ARGUMENTS
git push origin --delete release/$ARGUMENTS

# Push updated develop branch
git push origin develop

# Update project documentation
# - Update CHANGELOG.md with release notes
# - Update ROADMAP.md progress
# - Notify stakeholders of successful deployment
```

## 🚨 Emergency Rollback Procedure

**If any issues are detected during or after deployment:**

```bash
# Immediate rollback to previous stable version
git checkout main
git tag -l | grep -E "v[0-9]+\.[0-9]+\.[0-9]+$" | sort -V | tail -2
# Identify previous stable version

# Rollback deployment
git reset --hard [previous-version-tag]
git push origin main --force-with-lease

# Monitor rollback success
npm run validate:rollback
npm run monitor:recovery

# Communicate rollback to stakeholders
# - Notify team via Slack/email
# - Update status page if applicable
# - Plan hotfix for identified issues
```

## 📊 Success Criteria

### **Deployment is considered successful when:**
- ✅ All quality gates pass (100% test success rate)
- ✅ Staging validation completes without issues
- ✅ Production deployment completes without errors
- ✅ Post-deployment health checks all pass
- ✅ Core Web Vitals remain in green zone
- ✅ No increase in error rates or user complaints
- ✅ All tools function correctly on production
- ✅ Analytics tracking continues normally

### **Key Performance Indicators:**
- **Deployment Time**: <30 minutes total
- **Downtime**: 0 seconds (zero-downtime deployment)
- **Rollback Readiness**: <2 minutes if needed
- **Success Rate**: 100% (no failed deployments)

## 🔔 Notification & Communication

### **Stakeholder Updates:**
```bash
# Deployment start notification
"🚀 DevToolsKit $ARGUMENTS deployment initiated
• Environment: Production  
• Estimated completion: 30 minutes
• All quality gates: ✅ PASSED"

# Deployment success notification  
"✅ DevToolsKit $ARGUMENTS deployed successfully!
• Production URL: https://onlinedevtoolskit.com
• Deployment time: [X] minutes
• All health checks: ✅ PASSED
• Monitoring: Active for next 2 hours"

# Emergency notification (if issues arise)
"🚨 DevToolsKit $ARGUMENTS deployment issue detected
• Issue: [Description]
• Action: [Rollback initiated/Investigating]
• ETA: [Resolution time]
• Status page: [URL if applicable]"
```

## 🛡️ Quality Assurance Requirements

### **Mandatory Pre-Deployment Checks:**
- **Code Quality**: TypeScript strict mode, zero errors
- **Testing**: 100% test pass rate (unit + E2E)
- **Security**: No high/critical vulnerabilities
- **Performance**: Lighthouse >95, Core Web Vitals green
- **Bundle Size**: <500KB total (within budget)

### **Staging Validation Requirements:**
- **Functionality**: All tools work correctly
- **Performance**: Page load times <2s
- **Mobile**: Responsive design validated
- **Accessibility**: WCAG 2.1 AA compliance maintained
- **Analytics**: Event tracking functional

### **Production Health Checks:**
- **Uptime**: Site accessible and responsive
- **Error Rates**: <1% JavaScript/network errors
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Tool Success Rate**: >95% successful operations
- **User Experience**: No functionality regressions

## 🎯 Best Practices & Guidelines

### **Always Follow:**
- ✅ Never skip quality gates or testing phases
- ✅ Always validate on staging before production
- ✅ Monitor deployment health for 15+ minutes post-deploy  
- ✅ Have rollback plan ready and tested
- ✅ Communicate deployment status to stakeholders

### **Never Skip:**
- ❌ Pre-deployment test suite execution
- ❌ Staging environment validation  
- ❌ Post-deployment health monitoring
- ❌ Documentation updates and version bumps
- ❌ Stakeholder communication and notifications

## 📈 Continuous Improvement

After each production deployment:
- **Review deployment metrics** and identify optimization opportunities
- **Update deployment procedures** based on lessons learned
- **Analyze any issues** encountered and implement preventive measures  
- **Gather team feedback** on deployment process effectiveness
- **Update monitoring** and alerting based on deployment experience

---

**Ready to deploy DevToolsKit $ARGUMENTS to production with confidence! 🚀**

*This command ensures a safe, monitored, and reversible deployment process following DevToolsKit's strict quality standards and GitFlow methodology.*