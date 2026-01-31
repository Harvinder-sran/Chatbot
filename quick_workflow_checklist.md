# Quick Workflow Checklist - Never Waste 3 Days Again

## Before Starting Any Integration Project

1. **📚 Collect All Documentation First**
   - Find official docs, GitHub repos, example code
   - Ask: "Is this all the documentation you need before proceeding?"
   - Save docs locally for offline reference

2. **🔗 Use Git from Day 1 (Not Manual Upload)**
   ```bash
   # Connect local folder to GitHub
   git init
   git remote add origin <your-github-repo-url>
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```
   - No more copy-pasting code → eliminates sync errors
   - Every change is tracked and reversible

3. **📦 Clone Starter Repos When Available**
   - Don't build from scratch if there's an official template
   - Example: `git clone https://github.com/openai/openai-chatkit-starter-app`
   - Modify the working example instead of guessing

4. **🧪 Test Locally Before Deploying**
   ```bash
   # Run local dev server first
   npm run dev
   # Or for static sites
   python -m http.server 8000
   ```
   - Fix errors locally where debugging is faster
   - Only deploy when it works on your machine

5. **📝 Create `.env.example` File**
   ```
   OPENAI_API_KEY=your_key_here
   WORKFLOW_ID=your_workflow_id
   ```
   - Reference when setting up Vercel environment variables
   - Prevents "missing env var" errors

6. **🔍 Enable Vercel Git Auto-Deploy**
   - Connect Vercel to GitHub repo (not manual upload)
   - Every `git push` triggers automatic deployment
   - See instant feedback on what broke

7. **📊 Set Up 3-Tab DevTools Workflow**
   - **Tab 1:** Vercel Runtime Logs (real API errors)
   - **Tab 2:** Vercel Build Logs (compilation issues)
   - **Tab 3:** Browser Console (frontend errors)
   - Check ALL THREE when debugging

8. **🧩 Deploy in Small Increments**
   - Don't batch 5 changes and deploy once
   - Make 1 change → commit → push → verify → repeat
   - Pinpoint exactly which change broke things

9. **📖 Use `curl` to Test APIs Directly**
   ```bash
   curl -X POST https://api.openai.com/v1/chatkit/sessions \
     -H "Authorization: Bearer $OPENAI_API_KEY" \
     -H "OpenAI-Beta: chatkit_beta=v1" \
     -d '{"workflow": {"id": "wf_xxx"}, "user": "test"}'
   ```
   - Eliminates frontend as a variable
   - Confirms API format before writing code

10. **✅ Create Verification Checklist Before Marking "Done"**
    - [ ] Works locally
    - [ ] Deployed successfully (no build errors)
    - [ ] Runtime logs show no errors
    - [ ] Browser console clean
    - [ ] Tested in incognito mode (no cache issues)

## Git Workflow (Do This Every Time)

```bash
# Make changes to files
git add .
git commit -m "Add ChatKit integration"
git push

# Vercel auto-deploys → check logs → iterate
```

**No more manual file uploads = No more sync errors = Faster debugging**

---

**Time Investment:** 15 minutes setup  
**Time Saved:** 2+ days per project ✅
