# Git Best Practices - Preventing Destructive Pushes

## 🎯 Purpose

This document outlines best practices to prevent accidental destructive commits and pushes.

---

## ✅ Pre-Commit Checklist

Before every `git push`, verify:

### 1. **You're in the Correct Directory**

```bash
# Always check your current location
pwd

# Verify you're in the project root
ls -la
# Should see: apps/, docs/, infrastructure/, package.json, etc.

# Check Git remote
git remote -v
# Should show: https://github.com/Rengoku30/demowebsite.git
```

### 2. **You Have the Latest Code**

```bash
# Fetch latest changes
git fetch --all

# Check if your branch is behind
git status
# Should say: "Your branch is up to date" or "ahead by X commits"
```

### 3. **Your Branch Has Expected Files**

```bash
# Count files in your branch
git ls-files | wc -l
# Should be: 100+ files

# If less than 20 files: ⚠️ STOP! Something is wrong
```

### 4. **No Temporary Files**

```bash
# Check for temp files
git status | grep -E '~\$|\.tmp|\.temp|\.swp'

# If found: Remove them before committing
git reset HEAD <temp-file>
```

---

## 🚫 Common Mistakes to Avoid

### ❌ **Mistake 1: Working in Wrong Directory**

**Wrong:**

```bash
cd ~/old-backup-folder/
git init  # ❌ Creates new repo!
git push origin my-branch  # ❌ Overwrites remote!
```

**Correct:**

```bash
cd ~/projects/
git clone https://github.com/Rengoku30/demowebsite.git
cd demowebsite
git checkout -b my-branch
```

---

### ❌ **Mistake 2: Force Pushing Without Understanding**

**Wrong:**

```bash
git push --force origin main  # ❌ DANGEROUS!
```

**Correct:**

```bash
# Only force-push to YOUR feature branch, never to main
git push --force-with-lease origin my-feature-branch
```

---

### ❌ **Mistake 3: Committing Everything Blindly**

**Wrong:**

```bash
git add .  # ❌ Adds everything, including temp files
git commit -m "updates"  # ❌ Vague message
```

**Correct:**

```bash
# Review what you're adding
git status
git diff

# Add specific files
git add apps/api/src/users/users.service.ts
git commit -m "feat(users): Add email verification logic"
```

---

## 🛡️ Safety Commands

### Before Pushing:

```bash
# 1. Check what you're about to push
git log origin/main..HEAD --oneline

# 2. See file changes
git diff origin/main..HEAD --stat

# 3. Verify file count
git ls-files | wc -l

# 4. Check for large files
git ls-files | xargs ls -lh | sort -k5 -hr | head -20
```

### After Mistakes:

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes) - USE CAREFULLY
git reset --hard HEAD~1

# Undo a push (if caught immediately)
git push --force-with-lease origin HEAD~1:branch-name
```

---

## 📋 Daily Workflow Template

```bash
# Morning: Start work
git checkout main
git pull origin main
git checkout -b feature/my-new-feature

# During work: Regular commits
git status  # Check what changed
git diff    # Review changes
git add <specific-files>
git commit -m "feat: Descriptive message"

# Before pushing: Final checks
git log origin/main..HEAD --oneline  # Review commits
git diff origin/main..HEAD --stat    # Review file changes
git ls-files | wc -l                 # Verify file count (should be 100+)

# Push
git push origin feature/my-new-feature

# Evening: Create PR on GitHub
# Get code review before merging to main
```

---

## 🚨 Emergency Contacts

If you accidentally push something destructive:

1. **DO NOT PANIC**
2. **DO NOT try to fix it yourself** if unsure
3. **Immediately notify:**
   - Team Lead: [contact]
   - DevOps: [contact]
4. **Do not push again** until the issue is resolved

---

## 📚 Additional Resources

- [Git Best Practices](https://git-scm.com/book/en/v2)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
- [Oh Shit, Git!?!](https://ohshitgit.com/) - Fixing common mistakes

---

**Last Updated:** 2025-12-28  
**Maintained By:** Development Team
