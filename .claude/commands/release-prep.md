# Release Preparation Command 🚀

**Complete release preparation workflow for DevToolsKit**

## 🎯 Command Purpose

Automate the complete release preparation process following GitFlow methodology, ensuring all quality checks pass and documentation is updated before creating a new version.

## 📋 Command Syntax

```bash
/release-prep [version]
```

### Parameters:
- **`version`** (required): Semantic version number (e.g., `v1.2.0`, `0.7.0`)

### Examples:
```bash
/release-prep v0.7.0
/release-prep 1.0.0
/release-prep v1.2.3-beta
```

## 🌊 GitFlow Release Workflow

### **1. Pre-Release Validation**
```bash
# Ensure we're on develop branch
git checkout develop
git pull origin develop

# Verify all tests pass
npm run test:run
npm run test:e2e
npm run type-check
npm run build

# Check code quality
npm run lint
npm run test:coverage
```

### **2. Create Release Branch**
```bash
# Create release branch following GitFlow
git checkout -b release/[version]

# Example: git checkout -b release/v0.7.0
```

### **3. Version Bump Process**
```bash
# Update package.json version
npm version [version] --no-git-tag-version

# Update README.md version references
# Update CLAUDE.md version references
# Update any version-specific documentation
```

### **4. Release Documentation**
```bash
# Generate/update CHANGELOG.md
# Update ROADMAP.md with completed features
# Verify all documentation is current
# Update API documentation if applicable
```

### **5. Final Quality Assurance**
```bash
# Run complete test suite
npm run test-complete

# Performance audit
npm run build
# Lighthouse audit (if available)

# Security audit
npm audit
```

### **6. Release Branch Finalization**
```bash
# Commit version bump and documentation
git add .
git commit -m "release: bump version to [version]

- Update package.json to [version]
- Update README.md version references
- Update documentation for release
- Verify all quality checks pass

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Push release branch
git push origin release/[version]
```

### **7. Merge to Main (Production)**
```bash
# Switch to main branch
git checkout main
git pull origin main

# Merge release branch with merge commit
git merge release/[version] --no-ff -m "release: merge release/[version] into main

Release [version] includes:
- [List major features/changes]
- All quality checks passed
- Documentation updated

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Create Git tag
git tag -a [version] -m "Release [version]: [Brief description]

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

### **8. Merge Back to Develop**
```bash
# Switch to develop branch
git checkout develop

# Merge release branch back to develop
git merge release/[version] --no-ff -m "release: merge release/[version] back to develop

Post-release merge to keep develop up to date with main.

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Clean up release branch
git branch -d release/[version]
```

### **9. Push All Changes**
```bash
# Push main with tags
git checkout main
git push origin main --tags

# Push develop
git checkout develop
git push origin develop

# Delete remote release branch
git push origin --delete release/[version]
```

## 📊 Quality Checkpoints

### **Mandatory Checks Before Release**:
- ✅ All unit tests pass (Vitest)
- ✅ All E2E tests pass (Playwright)
- ✅ TypeScript compilation successful
- ✅ Production build successful
- ✅ Test coverage >80%
- ✅ No linting errors
- ✅ Documentation updated
- ✅ Version numbers consistent

### **Optional Quality Enhancements**:
- 🔍 Lighthouse performance audit >95
- 🔍 Security vulnerability scan
- 🔍 Bundle size analysis
- 🔍 Accessibility compliance check
- 🔍 SEO optimization validation

## 📝 Version Update Locations

### **Files to Update with New Version**:
1. **`package.json`** - Main version field
2. **`README.md`** - Version badges and references
3. **`CLAUDE.md`** - Current version in project status
4. **`CONTEXT.md`** - Version history and current state
5. **`docs/`** - Any version-specific documentation

### **Automated Version Updates**:
```bash
# Use npm version to update package.json
npm version [version] --no-git-tag-version

# Use sed/PowerShell to update other files
# README.md version badge
# CLAUDE.md project status
# Documentation references
```

## 🔄 Release Types

### **Major Release (x.0.0)**:
- Breaking changes
- New architecture
- Major feature additions
- Full regression testing required

### **Minor Release (0.x.0)**:
- New features
- Tool additions
- Non-breaking improvements
- Standard testing suite

### **Patch Release (0.0.x)**:
- Bug fixes
- Small improvements
- Documentation updates
- Quick validation sufficient

## 🚨 Error Handling

### **If Tests Fail**:
1. Stop release process immediately
2. Return to develop branch
3. Fix failing tests
4. Restart release process

### **If Version Conflicts**:
1. Check existing tags: `git tag -l`
2. Verify version uniqueness
3. Update version if necessary
4. Restart process with correct version

### **If Merge Conflicts**:
1. Resolve conflicts carefully
2. Ensure no functionality is lost
3. Re-run tests after resolution
4. Continue with merge process

## 📈 Post-Release Actions

### **Immediate Actions**:
- ✅ Verify deployment to production
- ✅ Run smoke tests on live site
- ✅ Monitor error logs and analytics
- ✅ Update project management tools

### **Follow-up Actions**:
- 📊 Review performance metrics
- 🔍 Monitor user feedback
- 📝 Update project roadmap
- 🎯 Plan next release cycle

## 🎯 DevToolsKit-Specific Considerations

### **Production Environment**:
- **Hosting**: Vercel with automatic deployments
- **Domain**: `https://onlinedevtoolskit.com`
- **Analytics**: Google Analytics G-G8CSCGH4HS
- **CDN**: Vercel Edge Network global distribution

### **Release Validation**:
- **All 4 tools functional**: JSON Validator, JWT Decoder, Base64, Locator Generator
- **Mobile responsive**: All breakpoints tested
- **Performance**: Core Web Vitals green
- **SEO**: Structured data and meta tags intact
- **Analytics**: Event tracking functional

### **Documentation Requirements**:
- **CHANGELOG.md**: Detailed change list
- **README.md**: Updated feature list
- **Tool-specific docs**: Usage guides current
- **API documentation**: If applicable

---

## 🎯 Quick Release Commands

### **Complete Release Flow**:
```bash
# Validate current state
git status
npm run test-complete

# Start release process
/release-prep v0.7.0

# Monitor deployment
# Verify production functionality
```

### **Emergency Rollback** (if needed):
```bash
# Revert to previous version
git checkout main
git reset --hard [previous-tag]
git push origin main --force-with-lease

# Redeploy previous version
# Update all stakeholders
```

**Ready to ship DevToolsKit releases with confidence! 🚀**