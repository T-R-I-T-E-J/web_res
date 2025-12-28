#!/bin/sh
# Pre-push hook to prevent accidental destructive pushes
# 
# Installation:
#   Copy this file to .git/hooks/pre-push
#   Make it executable: chmod +x .git/hooks/pre-push

# Get the current branch being pushed
current_branch=$(git rev-parse --abbrev-ref HEAD)

# Count files in the repository
file_count=$(git ls-files | wc -l)

# If pushing a branch with very few files, warn the user
if [ "$file_count" -lt 20 ]; then
    echo "⚠️  WARNING: This branch only contains $file_count files"
    echo "⚠️  This seems unusually low for this repository"
    echo ""
    echo "Expected: 100+ files (apps/, docs/, infrastructure/, etc.)"
    echo "Current:  $file_count files"
    echo ""
    echo "Are you in the correct directory?"
    echo "Did you clone the repository properly?"
    echo ""
    read -p "Do you really want to push? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        echo "❌ Push cancelled"
        exit 1
    fi
fi

# Check for temporary files that shouldn't be committed
if git diff --cached --name-only | grep -E '~\$|\.tmp$|\.temp$'; then
    echo "❌ ERROR: Temporary files detected in commit"
    echo "Please remove temporary files before pushing:"
    git diff --cached --name-only | grep -E '~\$|\.tmp$|\.temp$'
    exit 1
fi

echo "✅ Pre-push checks passed"
exit 0
