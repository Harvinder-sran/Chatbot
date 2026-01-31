# ChatKit Integration - What Went Wrong & How to Fix It Fast

## Summary
**Total Issues:** 3 major problems  
**Time Lost:** 3 days  
**Root Cause:** Missing official documentation + deployment sync issues

---

## Problem #1: Wrong `script.js` Deployed (Syntax Error)

### What Happened
Browser showed: `Uncaught SyntaxError: Unexpected token 'export'`

### Root Cause
GitHub had the **server-side code** (`api/chat.js`) in the `script.js` file instead of browser code. The browser tried to execute `module.exports` which doesn't exist in browsers.

### How We Fixed It
1. Verified local `script.js` was correct
2. Checked GitHub - found it had wrong content
3. Manually edited `script.js` on GitHub to replace with correct browser code
4. Redeployed

### Lesson Learned
**Always verify GitHub content matches local files before debugging deployment issues.**

Quick check:
```bash
# Compare local vs GitHub
git status
git diff HEAD
```

---

## Problem #2: ESM vs CommonJS Compilation Warning

### What Happened
Build logs showed: `Warning: Node.js functions are compiled from ESM to CommonJS`

### Root Cause
Used `export default` in serverless function, but Vercel prefers CommonJS (`module.exports`) for serverless functions.

### How We Fixed It
Changed `api/chat.js` from:
```javascript
export default async function handler(req, res) {
```

To:
```javascript
module.exports = async function handler(req, res) {
```

### Lesson Learned
**For Vercel serverless functions, use CommonJS syntax (`module.exports`) to avoid compilation issues.**

---

## Problem #3: Missing Required API Parameter

### What Happened
Runtime logs showed:
```
OpenAI API failed with status 400
Missing required parameter: 'user'
```

### Root Cause
The API request was missing the `user` parameter that OpenAI's ChatKit API requires.

### Original (Wrong) Request:
```javascript
body: JSON.stringify({
    workflow: { id: workflowId }
})
```

### Fixed Request:
```javascript
body: JSON.stringify({
    workflow: { id: workflowId },
    user: "anonymous-user"  // ← This was missing!
})
```

### Lesson Learned
**Always reference the OFFICIAL documentation for the exact API format.** Don't guess based on SDK examples.

Where to find it: https://platform.openai.com/docs/guides/chatkit

---

## How to Debug This Type of Issue in 30 Minutes (Not 3 Days)

### Step 1: Verify Local vs Deployed Files (5 min)
```bash
# Check what's committed
git log --oneline -5

# Verify GitHub matches local
# Go to GitHub repo, click files, compare line-by-line
```

### Step 2: Check Build Logs (5 min)
- Vercel Dashboard → Deployments → Latest → Build Logs
- Look for: `Detected API Routes`, ESM warnings, error messages

### Step 3: Check Runtime Logs (5 min)
- Vercel Dashboard → Logs (Runtime, not Build)
- Trigger the feature (load page, click button)
- See EXACT error from OpenAI API

### Step 4: Check Browser Console (5 min)
- Open DevTools → Console
- Look for first error (ignore subsequent cascade errors)
- Check Network tab → Failed requests → Response body

### Step 5: Verify API Format Against Official Docs (10 min)
- Go to official documentation
- Compare request body format EXACTLY
- Use `curl` to test API directly if needed:

```bash
curl -X POST https://api.openai.com/v1/chatkit/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: chatkit_beta=v1" \
  -d '{
    "workflow": {"id": "wf_xxx"},
    "user": "test-user"
  }'
```

---

## Prevention Checklist for Next Project

- [ ] **Read official docs FIRST** before writing code
- [ ] **Use starter repo** if available (OpenAI has one: https://github.com/openai/openai-chatkit-starter-app)
- [ ] **Verify deployment**: Check GitHub after every `git push`
- [ ] **Test incrementally**: Deploy after each small change, don't batch changes
- [ ] **Check all 3 logs**: Build logs, Runtime logs, Browser console
- [ ] **Use TypeScript**: Catches type errors before deployment

---

## Key Files Reference

### Working Files (Local)
- `api/chat.js` - Serverless function (CommonJS)
- `script.js` - Browser JavaScript
- `index.html` - Chat widget container
- `package.json` - No dependencies needed (using native fetch)

### Environment Variables (Vercel Dashboard)
- `OPENAI_API_KEY` - Your OpenAI secret key
- `WORKFLOW_ID` - Your ChatKit workflow ID

### Essential Headers for ChatKit API
```javascript
headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
    "OpenAI-Beta": "chatkit_beta=v1"  // ← Critical!
}
```

---

## If It Breaks Again

1. **Check Runtime Logs first** - they tell you the exact error
2. **Compare against official docs** - don't rely on memory
3. **Test API with `curl`** - eliminates frontend as variable
4. **Ask for help with LOGS** - not just "it doesn't work"

**Time saved:** 2 days 23.5 hours ✅
