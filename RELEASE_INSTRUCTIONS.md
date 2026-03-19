# How to Release RoboSync

## First Time Setup

1. Create a new repository on GitHub named `robosync`
   - Set visibility to **Public** (required for free GitHub Actions minutes)
   - Do **NOT** initialize with README (we have one already)

2. In your local project directory, run:

   ```bash
   cd d:\COURSES\robocopy\robosync
   git init
   git add .
   git commit -m "feat: initial release of RoboSync v1.0.0"
   git branch -M main
   git remote add origin https://github.com/ddvad/robosync.git
   git push -u origin main
   ```

3. Verify on GitHub that all files are visible and `.gitignore` is correctly excluding `node_modules/`, `out/`, `release/`

## How to Create a Release (triggers .exe build)

Every time you push a version tag, GitHub Actions automatically:
1. Installs dependencies
2. Compiles TypeScript
3. Packages installer + portable .exe using electron-builder
4. Creates a GitHub Release with the .exe files attached

To release a new version:

```bash
# Update version in package.json first, e.g. "version": "1.0.0"
# Then commit and tag:

git add package.json CHANGELOG.md
git commit -m "chore: release v1.0.0"
git tag v1.0.0
git push origin main
git push origin v1.0.0   # ← this triggers the release workflow
```

The build takes approximately 5–8 minutes on GitHub's Windows runner.

After completion, go to:
  https://github.com/ddvad/robosync/releases

You will see the release with two .exe files attached:
- `RoboSync-Setup-1.0.0.exe` — NSIS installer
- `RoboSync-1.0.0-x64.exe` — Portable

## Updating the Download Links in README

After your first release is published, the shield.io badge will automatically
show the latest version number as long as the repository is public.

## Versioning Guide

| Change Type | Example | Tag |
|---|---|---|
| Bug fixes | 1.0.0 → 1.0.1 | `git tag v1.0.1` |
| New features | 1.0.0 → 1.1.0 | `git tag v1.1.0` |
| Breaking changes | 1.0.0 → 2.0.0 | `git tag v2.0.0` |
