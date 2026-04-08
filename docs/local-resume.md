# Local Resume

## Goal
Persist player progress locally so a page reload resumes the player at the latest stable checkpoint.

## Storage Choice
Use `localStorage`, not `sessionStorage`.

Why:
- reload should not reset progress
- mobile browsers may kill tabs unexpectedly
- players should be able to reopen the game and continue later

## Goals
- Resume from the latest stable checkpoint
- Persist bad endings and their retry targets
- Persist level unlock/completion state
- Keep the schema small and stable
- Separate progress persistence from analytics/session tracking

## Non-Goals
- Do not serialize Phaser game objects
- Do not persist drag coordinates, tweens, or hover state
- Do not resume every minigame at exact frame-level state

## Storage Keys
- `bbb.progress.v1`: persistent player progress
- `bbb.session.v1`: current session metadata for analytics
- `bbb.analyticsQueue.v1`: optional queued analytics events

## Progress Schema
```json
{
  "version": 1,
  "updatedAt": "ISO-8601",
  "started": true,
  "finished": false,
  "currentScene": "Level2CookingGuidedScene",
  "resumeCheckpointId": "level2.challenge2.step3",
  "resumeTarget": {
    "sceneKey": "Level2CookingGuidedScene",
    "level": 2,
    "checkpointId": "level2.challenge2.step3"
  },
  "story": {
    "wakeChoice": "get-up",
    "marketInviteSeen": true
  },
  "badEndings": {
    "introTikTok": {
      "seen": true,
      "lastSeenAt": "ISO-8601",
      "retryTarget": {
        "sceneKey": "MorningScene01",
        "checkpointId": "intro.morning.choice"
      }
    },
    "bargainFail": {
      "seen": false,
      "lastSeenAt": null,
      "retryTarget": {
        "sceneKey": "BuyRibsIntroScene",
        "checkpointId": "level1.buy-ribs-intro"
      }
    }
  },
  "levels": {
    "level1": {
      "status": "in_progress",
      "checkpointId": "level1.market-selection",
      "completedAt": null
    },
    "level2": {
      "status": "locked",
      "checkpointId": null,
      "challengeIndex": null,
      "stepIndex": null,
      "completedAt": null
    },
    "level3": {
      "status": "locked",
      "checkpointId": null,
      "completedAt": null
    },
    "level4": {
      "status": "locked",
      "checkpointId": null,
      "ringStage": null,
      "completedAt": null
    }
  }
}
```

## Checkpoint IDs
### Intro
- `opening.start`
- `intro.story`
- `intro.morning.dialogue`
- `intro.morning.choice`
- `intro.bad-ending`
- `intro.market-invite`

### Level 1
- `level1.task-intro`
- `level1.market-selection`
- `level1.buy-ribs-intro`
- `level1.pork-rib-selection`
- `level1.bargain-choice`
- `level1.bad-ending`
- `level1.complete`

### Level 2
- `level2.intro`
- `level2.instruction`
- `level2.challenge1.start`
- `level2.challenge1.step1`
- `level2.challenge1.step2`
- `level2.challenge1.step3`
- `level2.challenge1.step4`
- `level2.challenge1.step5`
- `level2.challenge2.start`
- `level2.challenge2.step1`
- `level2.challenge2.step2`
- `level2.challenge2.step3`
- `level2.challenge2.step4`
- `level2.challenge2.step5`
- `level2.challenge3.start`
- `level2.challenge3.step1`
- `level2.challenge3.step2`
- `level2.challenge3.step3`
- `level2.challenge3.step4`
- `level2.challenge3.step5`
- `level2.complete`

### Level 3
- `level3.intro`
- `level3.arrangement.start`
- `level3.complete`

### Level 4
- `level4.intro`
- `level4.washing.start`
- `level4.washing.outer-ring`
- `level4.complete`

### End
- `game.complete`

## Resume Rules
- On boot, load `bbb.progress.v1`
- If no valid progress exists, start at `OpeningScene`
- If `finished` is true, start at the final completed state or opening scene based on UX choice
- Otherwise start from `resumeTarget.sceneKey`

## Bad Endings
Bad endings must be stored as checkpoints.
Each bad ending stores:
- whether it has been seen
- when it was last seen
- which checkpoint `Try Again` should return to

## Level Resume Granularity
- Level 1: scene-level checkpoints only
- Level 2: per challenge and per step
- Level 3: start-of-challenge only
- Level 4: start plus outer-ring-unlocked checkpoint only

## Session and Analytics
Do not mix session analytics state into `bbb.progress.v1`.

Use `bbb.session.v1` for:
- session id
- startedAt
- lastActiveAt
- entryScene
- lastScene

## Versioning
- Start with `version: 1`
- If schema changes later, migrate or safely reset invalid data

## Implementation Guidance
- Add a small storage service module
- Save before every meaningful forward scene transition
- Save before entering a bad ending scene
- Restore from checkpoint on boot
- Keep scene-specific restore logic simple and explicit

## Test Scenarios
- Fresh load starts at opening
- Reload during intro resumes correctly
- Reload after intro bad ending preserves retry target
- Reload during level 1 resumes at latest level 1 checkpoint
- Reload during level 2 resumes at the correct challenge and step
- Reload during level 3 resumes at challenge start
- Reload during level 4 resumes at start or outer-ring checkpoint
- Corrupt storage falls back safely
