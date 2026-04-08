# Becoming a Bát Tràng Bride

`Becoming a Bát Tràng Bride` is a narrative Phaser 3 game built with Vite. The player moves through a story-driven sequence of scenes inspired by Bát Tràng village life, with dialogue, choice-driven branches, cooking tasks, household challenges, progress persistence, and analytics checkpoints.

## What Is In The Project

- Intro story scenes with branching outcomes
- Level-based progression across market, cooking, arrangement, and cleanup challenges
- Lazy-loaded Phaser scenes managed through a loading scene
- Local progress persistence so unfinished sessions can resume
- Analytics hooks for scene entry, checkpoints, level start/completion, bad endings, and game completion

## Tech Stack

- Node.js + npm
- Vite 5
- Phaser 3
- Plain JavaScript ES modules

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build the production bundle:
   ```bash
   npm run build
   ```
4. Preview the production build locally:
   ```bash
   npm run preview
   ```

## Environment Notes

- Analytics reads `VITE_GA_MEASUREMENT_ID` from the Vite environment.
- If `VITE_GA_MEASUREMENT_ID` is not set, the game still runs; Google Analytics forwarding is simply not enabled.

## Runtime Flow

The game boots from `src/main.js`, starts `BootScene`, and then routes into the main story flow through `OpeningScene`. Scene modules are registered in `src/game/sceneRegistry.js`, where asset groups and lazy imports are mapped per scene.

Current scene progression includes:

- Intro and story setup
- Level 1: market and bargaining flow
- Level 2: cooking introduction, instructions, guided challenge, and completion
- Level 3: main challenge and pass scene
- Level 4: final challenge, pass scene, and finish scene

## Project Structure

- `src/main.js`: Phaser bootstrap, scaling, lifecycle hooks, and scene analytics wiring
- `src/game/scenes/`: individual Phaser scenes
- `src/game/sceneRegistry.js`: lazy scene import registry and asset group mapping
- `src/game/UIHelpers.js`: shared UI and scene helper utilities
- `src/game/analytics.js`: session and checkpoint analytics handling
- `public/assets/`: fonts, backgrounds, characters, sounds, and level assets

## Development Notes

- Source files use ES modules and double quotes.
- Scene order matters because runtime flow is explicitly controlled.
- The browser game title in `src/main.js` is currently `Bat trang's Bride`, while the in-game narrative title and README use `Becoming a Bát Tràng Bride`.
- There is no configured test suite or linter in `package.json`; `npm run build` is the main sanity check after changes.
