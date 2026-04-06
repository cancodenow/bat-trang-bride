# AGENTS.md

## Project Summary

- This project is a Vite-powered Phaser game.
- The current game title in the README is "Phaser's Revenge", but the in-game opening scene currently displays "Becoming a Bát Tràng Bride".
- The app boots from `src/main.js` and registers a sequence of Phaser scenes that drive the game flow.

## Stack

- Node.js project using npm
- Vite 5 for local development and production builds
- Phaser 3 for gameplay, scenes, and rendering
- Source files are plain JavaScript ES modules, not TypeScript

## Key Commands

- Install dependencies: `npm install`
- Start the dev server: `npm run dev`
- Build for production: `npm run build`
- Preview the production build: `npm run preview`

## Validation

- There is no configured test suite, linter, or formatter in `package.json`.
- After code changes, run `npm run build` as the main sanity check.
- If gameplay or scene flow changes, also run `npm run dev` and verify the affected path in the browser.

## Repository Shape

- `src/main.js`: Phaser bootstrap and scene registration
- `src/game/UIHelpers.js`: shared UI helper utilities
- `src/game/scenes/`: scene classes, grouped by story stage in filenames
- `public/assets/`: static assets used by scenes
- `dist/`: build output

## Conventions

- Follow the existing ES module style with `import` / `export`.
- Keep scene classes in separate files and export them as the default export.
- Use PascalCase for scene class names and scene file names.
- Preserve the existing quote style in source files: double quotes.
- Keep edits small and consistent with the current project rather than introducing new architecture.

## Notes For Agents

- The workspace is not currently a Git repository, so do not rely on Git commands for status or diffing.
- `.editorconfig` specifies spaces with size `4` and CRLF line endings. Match the existing file style when editing.
- There is a Vim swap file at `src/game/scenes/.[2] CookingChallengeCompleteScene.js.swp`; avoid treating it as source code.
- Scene order matters because `src/main.js` defines the runtime flow explicitly.

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd dolt push
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->
