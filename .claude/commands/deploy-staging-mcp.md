# Deploy Staging with MCP Integration 🚀

**MCP-powered staging deployment with automated quality assurance**

Target environment: Staging
Branch: $ARGUMENTS (defaults to current branch)

## 🎯 Command Purpose

Deploy the specified branch to Vercel staging environment using MCP integrations for automated deployment, performance monitoring, and quality assurance. This command leverages Vercel MCP server for deployment management and Lighthouse CI MCP server for automated performance validation.

## 🔌 MCP Integrations Used

- **Vercel MCP**: Deployment automation and monitoring
- **GitHub MCP**: Branch validation and status updates  
- **Lighthouse CI MCP**: Automated performance auditing

## 📋 Deployment Workflow

### **Phase 1: Pre-Deployment Validation** (2-3 minutes)

**Using GitHub MCP:**
```bash
# Validate branch status and requirements
> "Check if branch $ARGUMENTS is ready for deployment"
# MCP checks:
# - Branch exists and is up to date
# - No merge conflicts with develop
# - CI/CD tests are passing
# - No blocking issues or PRs
```

**Using Local Commands:**
```bash
# Quick local validation
npm run type-check              # TypeScript validation
npm run build                   # Production build test
```

### **Phase 2: Staging Deployment** (3-5 minutes)

**Using Vercel MCP:**
```bash
# Deploy to staging environment
> "Deploy branch $ARGUMENTS to staging with these configurations:
  - Environment: staging
  - Domain: devtoolskit-git-$ARGUMENTS-user.vercel.app
  - Analytics: enabled
  - Performance monitoring: enabled"

# MCP Vercel Response:
# ✅ Deployment initiated
# ✅ Build process started
# ✅ Assets optimized and deployed
# ✅ Custom domain configured
# ✅ SSL certificate provisioned
# 🔗 Staging URL: https://devtoolskit-git-$ARGUMENTS-user.vercel.app
```

### **Phase 3: Automated Quality Assurance** (2-3 minutes)

**Using Lighthouse CI MCP:**
```bash
# Automated performance audit
> "Run comprehensive Lighthouse audit on staging deployment:
  - URL: https://devtoolskit-git-$ARGUMENTS-user.vercel.app
  - Audit all pages: home, tools, individual tool pages
  - Generate performance report
  - Check Core Web Vitals compliance
  - Compare against baseline metrics"

# Expected Results:
# ✅ Lighthouse Score: >95 (target)
# ✅ LCP: <2.5s
# ✅ FID: <100ms  
# ✅ CLS: <0.1
# ✅ Accessibility: 100%
# ✅ Best Practices: 100%
# ✅ SEO: 100%
```

**Using Vercel MCP Analytics:**
```bash
# Monitor staging deployment health
> "Monitor staging deployment for the next 5 minutes:
  - Track error rates
  - Monitor response times
  - Check Core Web Vitals
  - Validate analytics tracking
  - Report any issues"
```

### **Phase 4: Post-Deployment Validation** (3-5 minutes)

**Functional Testing:**
```bash
# Automated functional validation
> "Test all tools on staging environment:
  - JSON Validator: validate sample JSON
  - JWT Decoder: decode test tokens
  - Base64 Encoder: encode/decode test strings
  - Locator Generator: generate test locators
  - Password Generator: generate test passwords (if available)"
```

**Using GitHub MCP for Status Updates:**
```bash
# Update deployment status
> "Update GitHub with staging deployment status:
  - Add deployment status to PR (if exists)
  - Create deployment event in repository
  - Update branch status with staging URL
  - Add performance metrics as comment"
```

## 🎯 Success Criteria

### **Deployment Success Indicators:**
- ✅ Vercel deployment completes without errors
- ✅ Staging URL is accessible and responsive
- ✅ All tools function correctly on staging
- ✅ Lighthouse score maintains >95
- ✅ Core Web Vitals all in green zone
- ✅ No JavaScript errors in browser console
- ✅ Analytics tracking events firing correctly

### **Performance Targets:**
- **Lighthouse Score**: >95
- **LCP**: <2.5 seconds
- **FID**: <100 milliseconds  
- **CLS**: <0.1
- **Page Load Time**: <2 seconds
- **Build Time**: <60 seconds

## 🚨 Error Handling & Rollback

### **Common Issues & Solutions:**

**Build Failures:**
```bash
# If build fails
> "Analyze build failure and suggest fixes:
  - Check TypeScript compilation errors
  - Verify dependency issues
  - Review Parcel configuration
  - Check environment variables"
```

**Performance Regression:**
```bash
# If Lighthouse score drops below 95
> "Performance regression detected:
  - Compare current vs baseline metrics
  - Identify performance bottlenecks
  - Suggest optimization strategies
  - Consider blocking deployment if critical"
```

**Deployment Rollback:**
```bash
# Emergency rollback if needed
> "Rollback staging deployment:
  - Revert to previous stable deployment
  - Update GitHub status
  - Notify team of rollback
  - Analyze failure for future prevention"
```

## 📊 Deployment Report

**After successful deployment, generate comprehensive report:**

```bash
> "Generate staging deployment report for $ARGUMENTS:
  - Deployment summary and timeline
  - Performance metrics and comparisons
  - Functional test results
  - Known issues or warnings
  - Recommendations for production deployment"
```

**Example Report Output:**
```
🚀 STAGING DEPLOYMENT REPORT

📋 SUMMARY:
- Branch: feature/password-generator
- Deployment: Successful ✅
- Total Time: 8 minutes 32 seconds
- Staging URL: https://devtoolskit-git-feature-password-generator-user.vercel.app

⚡ PERFORMANCE:
- Lighthouse Score: 97/100 (+2 from baseline)
- LCP: 1.6s (excellent)
- FID: 23ms (excellent)
- CLS: 0.03 (excellent)
- Build Time: 42s

🧪 FUNCTIONAL TESTS:
- All existing tools: ✅ Working
- New Password Generator: ✅ Working
- Copy functionality: ✅ Working
- Analytics tracking: ✅ Working
- Responsive design: ✅ Working

⚠️ CONSIDERATIONS:
- Bundle size increased by 15KB (still within budget)
- New tool adds 2 new analytics events
- Mobile performance excellent across all devices

✅ READY FOR PRODUCTION: Yes
```

## 🔔 Integration with Development Workflow

### **Integration with Other Commands:**

```bash
# Use with new tool development
/new-tool Hash Generator && /deploy-staging-mcp feature/hash-generator

# Use with release preparation  
/test-complete && /deploy-staging-mcp develop && /release-prep v0.8.0

# Use with performance optimization
/agents seo-optimizer "optimize performance" && /deploy-staging-mcp feature/performance-improvements
```

### **GitHub PR Integration:**
When run with a feature branch that has an open PR:
- Automatically adds staging URL to PR comments
- Updates PR status with deployment results
- Adds performance metrics comparison
- Enables easy review of changes in staging environment

## 🛡️ Security & Best Practices

### **MCP Security:**
- All MCP servers use authenticated connections
- Rate limiting enforced (100 requests/hour for Vercel)
- Only authorized domains can trigger deployments
- Sensitive environment variables are encrypted

### **Deployment Security:**
- Staging deployments use separate environment variables
- No production data or secrets exposed
- Automated security scanning via Vercel
- SSL/TLS encryption enforced

---

**Ready to deploy with confidence using MCP-powered automation! 🚀**

*This command demonstrates the power of MCP integrations for seamless, automated staging deployments with comprehensive quality assurance.*