#!/bin/bash
# 1. Ensure clean working tree
git status
echo "Stashing changes..."
git stash

# 2. Run git-filter-repo using the correct flag --path for each file
echo "Running git-filter-repo to remove secrets..."
git filter-repo --invert-paths --path PythonBE/src/src/tts.json --path PythonBE/src/src/qa_config.json

# 3. Force push rewritten history to all branches (e.g. main and backup-main)
echo "Force pushing to remote branches..."
git push origin --force --all

echo "Cleanup completed."