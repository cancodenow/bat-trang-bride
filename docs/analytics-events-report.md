# Analytics Events Report

## Purpose

This report explains how the analytics events in `src/game/analytics.js` are currently used, what each event means, and how different stakeholders can use the data:

- PO: monitor product progression, drop-off, and completion
- BA: understand player journeys and decision branches
- Data: define event semantics, payload rules, and reporting caveats

This report is based on the current implementation in:

- `src/game/analytics.js`
- `src/main.js`

## Executive Summary

The project uses a session-based event model. Analytics starts when the app boots, stores session state in `localStorage`, and forwards a defined set of events to GA4 only in production when `VITE_GA_MEASUREMENT_ID` is configured.

The current event set is:

- `session_start`
- `session_end`
- `scene_enter`
- `checkpoint_reached`
- `level_start`
- `level_complete`
- `bad_ending`
- `game_complete`

The main design choice is that scene lifecycle in `src/main.js` drives most business analytics. When a tracked scene is created, the app can emit one or more of the events above depending on the scene's mapping in `SCENE_ANALYTICS_MAP`.

## How Tracking Works

### 1. Session lifecycle

`initAnalytics({ entryScene: "boot" })` is called during app startup in `src/main.js`.

What happens:

- A session is created or restored from `localStorage`
- `session_start` is emitted immediately
- Active time is tracked using page visibility and page show/hide events
- `session_end` is emitted on `pagehide` when the page is not persisted

Important session rules:

- A previous session is restored only if it was not ended and the last activity was within 30 minutes
- A session is considered a bounce if either:
  - active duration is below 10 seconds, or
  - the player made no meaningful progress beyond the first checkpoint

### 2. Scene-driven analytics

When a Phaser scene emits its `create` lifecycle event, `trackSceneAnalytics(scene.scene.key)` runs.

That function reads `SCENE_ANALYTICS_MAP` in `src/main.js` and may emit:

- `scene_enter`
- `checkpoint_reached`
- `level_start`
- `level_complete`
- `bad_ending`
- `game_complete`

This means analytics coverage depends on whether a scene is explicitly mapped in `SCENE_ANALYTICS_MAP`.

### 3. GA forwarding behavior

Events are forwarded to GA4 only when all of the following are true:

- runtime is production
- event name is in `FORWARDED_EVENTS`
- `window.gtag` is available
- `VITE_GA_MEASUREMENT_ID` is configured

In development, the same events are still generated but only logged locally to the console.

## Event Catalog

### `session_start`

When it fires:

- immediately after analytics initializes

Business meaning:

- a player has opened the game and a new or resumed session is active

Typical use:

- measure traffic volume
- compare starts vs completions
- build session-level funnels

Current payload fields:

- `session_id`
- `scene_key`
- `checkpoint_id`
- `level`
- `status`
- `result`
- `duration_ms`

Current behavior notes:

- `scene_key` starts as `"boot"` from initialization
- `duration_ms` is `0` at start

### `session_end`

When it fires:

- on page hide when the page is not being persisted by the browser

Business meaning:

- the session has ended and final session metrics are available

Typical use:

- bounce rate
- session duration
- last seen scene or checkpoint
- exit reason analysis

Current payload fields:

- `session_id`
- `scene_key`
- `checkpoint_id`
- `level`
- `status`
- `result`
- `duration_ms`
- `wall_clock_duration_ms`
- `bounce`

Field semantics:

- `status` is `"bounce"` or `"completed"` at session-close time
- `result` is currently the exit reason, such as `"pagehide"`
- `duration_ms` is active time only
- `wall_clock_duration_ms` is elapsed real time since session start

### `scene_enter`

When it fires:

- every time a tracked scene is created

Business meaning:

- the player has entered a specific scene in the journey

Typical use:

- scene-by-scene funnel
- identifying where players spend time or drop
- validating navigation order

Current payload fields:

- `session_id`
- `scene_key`
- `checkpoint_id`
- `level`
- `status`
- `result`
- `duration_ms`

Field semantics:

- `scene_key` is the scene being entered
- `checkpoint_id`, `level`, `status`, and `result` are populated from `SCENE_ANALYTICS_MAP` when configured

### `checkpoint_reached`

When it fires:

- when a scene in `SCENE_ANALYTICS_MAP` defines `checkpointId`

Business meaning:

- the player reached a business milestone in the journey

Typical use:

- primary progression funnel
- progression analysis by business milestone rather than technical scene
- measuring where meaningful progress begins and where it stops

Current payload fields:

- `session_id`
- `scene_key`
- `checkpoint_id`
- `level`
- `status`
- `result`
- `duration_ms`

Field semantics:

- `checkpoint_id` is the most business-friendly progress marker in the current design
- first checkpoint becomes the session entry checkpoint
- moving beyond the first checkpoint marks `hasMeaningfulProgress = true`

### `level_start`

When it fires:

- when the current scene mapping sets `markLevelStart: true`

Business meaning:

- the player has entered a new level in a way that counts as level participation

Typical use:

- level-start volume
- level funnel start points
- level abandonment before completion

Current payload fields:

- `session_id`
- `scene_key`
- `checkpoint_id`
- `level`
- `status`
- `result`
- `duration_ms`

Field semantics:

- `status` is fixed to `"started"`
- each level start is emitted once per session because started levels are deduplicated in session state

### `level_complete`

When it fires:

- when the current scene mapping sets `markLevelComplete: true`

Business meaning:

- the player has completed a level

Typical use:

- level completion rate
- average completion progression
- comparison of difficulty across levels

Current payload fields:

- `session_id`
- `scene_key`
- `checkpoint_id`
- `level`
- `status`
- `result`
- `duration_ms`

Field semantics:

- `status` is fixed to `"completed"`
- each level completion is emitted once per session because completed levels are deduplicated in session state

### `bad_ending`

When it fires:

- when the current scene mapping sets `status: "bad_ending"`

Business meaning:

- the player reached a fail or undesirable branch

Typical use:

- detect frustrating decision points
- compare branch failure types
- evaluate whether narrative choices are too punishing or unclear

Current payload fields:

- `session_id`
- `scene_key`
- `checkpoint_id`
- `level`
- `status`
- `result`
- `duration_ms`

Field semantics:

- `status` is `"bad_ending"`
- `result` identifies the failure branch, for example:
  - `intro_tiktok`
  - `bargain_fail`

### `game_complete`

When it fires:

- when the player reaches the finish scene mapped with `markGameComplete: true`

Business meaning:

- the full game journey has been completed

Typical use:

- overall completion rate
- compare starts, level completions, and full finishes
- define the top-level success KPI

Current payload fields:

- `session_id`
- `scene_key`
- `checkpoint_id`
- `level`
- `status`
- `result`
- `duration_ms`

Field semantics:

- `status` is `"completed"`
- emitted only once per session because `gameCompletedAt` is persisted in session state

## Current Business Mapping In `src/main.js`

The following business checkpoints and level markers are currently mapped:

- `opening.start`
- `intro.story`
- `intro.morning.dialogue`
- `intro.bad-ending`
- `intro.market-invite`
- `level1.task-intro`
- `level1.market-selection`
- `level1.buy-ribs-intro`
- `level1.pork-rib-selection`
- `level1.bargain-choice`
- `level1.bad-ending`
- `level1.complete`
- `level2.intro`
- `level2.instruction`
- `level2.complete`
- `level3.intro`
- `level3.arrangement.start`
- `level3.complete`
- `level4.intro`
- `level4.washing.start`
- `level4.complete`
- `game.complete`

Important caveat:

- Level 2 challenge detail is still partially represented through intro, instruction, and completion rather than every gameplay step

## How PO Can Use This

PO should treat `checkpoint_reached`, `level_start`, `level_complete`, and `game_complete` as the primary product metrics.

Recommended PO views:

- Funnel from `session_start` to `game_complete`
- Funnel by checkpoint:
  - `opening.start` -> `intro.story` -> `intro.market-invite` -> `level1.task-intro` -> ... -> `game.complete`
- Level completion view:
  - `level_start` vs `level_complete` by level
- Bad ending incidence:
  - count `bad_ending` by `result`

Key PO questions this instrumentation can answer:

- How many players start but never get into the main game?
- Which level loses the most players?
- Which fail branch is most common?
- What percentage of sessions end as bounce?
- How many sessions reach full completion?

## How BA Can Use This

BA should use `scene_enter` and `checkpoint_reached` together to analyze journey logic and branching behavior.

Recommended BA views:

- Story path analysis by ordered checkpoint sequence
- Drop-off between narrative beats
- Branch analysis for bad endings
- Resume behavior using restored sessions and session duration patterns

Key BA questions this instrumentation can answer:

- Are players following the intended narrative flow?
- At which checkpoint do players most often stop?
- Do bad endings happen too early or too often?
- Does the bargaining branch create excessive abandonment?
- Which parts of the story are reached often but not converted into next-step progress?

BA caveat:

- not every gameplay action is tracked, so this data is better for macro journey analysis than detailed UX diagnosis inside a challenge

## How Data Can Use This

Data should treat the current model as a session-and-checkpoint event schema with some important implementation constraints.

Recommended Data modeling:

- Grain 1: event-level table keyed by `session_id`, `event_name`, event timestamp from GA/log sink
- Grain 2: session summary table keyed by `session_id`
- Grain 3: checkpoint funnel table using `checkpoint_id`

Recommended derived metrics:

- sessions
- bounced sessions
- meaningful sessions
- checkpoint conversion rate
- level start to completion rate
- bad ending rate by `result`
- game completion rate
- active duration vs wall-clock duration

Implementation caveats for Data:

- there is no explicit event timestamp in the custom payload because GA or the receiver timestamp is expected to provide it
- `duration_ms` is active foreground time, not wall-clock elapsed time
- `level` is nullable and backfilled from the last known session level in `trackEvent`
- `status` and `result` change meaning by event type
- session restoration can make one logical playthrough continue under one `session_id` if resumed within 30 minutes
- deduplication for `level_start`, `level_complete`, and `game_complete` happens inside local session state

## Recommended Interpretation Rules

To keep reporting consistent, use these business rules:

- Treat `checkpoint_reached` as the canonical progression event
- Treat `scene_enter` as a supporting technical navigation event
- Treat `level_start` and `level_complete` as milestone rollups, not replacements for checkpoint funnel analysis
- Treat `bad_ending` as a branch outcome event
- Treat `game_complete` as the top-level success event
- Treat `session_end.bounce = true` as the canonical bounce flag

## Gaps And Risks In The Current Design

### 1. Event meaning is overloaded into shared fields

`status` and `result` mean different things depending on event type.

Impact:

- downstream reporting needs event-specific logic

### 2. No low-level gameplay telemetry

There are no events yet for:

- challenge attempts
- retries
- success/fail per task step
- interaction counts
- time spent per individual mechanic

Impact:

- root-cause analysis inside a level is limited

### 3. Session end depends on browser lifecycle

`session_end` is emitted on `pagehide` when the page is not persisted.

Impact:

- some abrupt exits may be undercounted depending on browser behavior

## Recommendations

### Short-term

- Define a stakeholder-owned checkpoint dictionary so product naming is stable
- Document event-specific semantics for `status` and `result` in the analytics spec

### Medium-term

- Add gameplay events inside critical challenge scenes:
  - challenge_start
  - challenge_step_complete
  - challenge_fail
  - challenge_retry
  - challenge_success
- Add branch-choice events before bad endings occur so analysis can separate choice from consequence

### Reporting-first

- Build a standard funnel using `checkpoint_reached`
- Build a level dashboard using `level_start`, `level_complete`, and `bad_ending`
- Build a session quality dashboard using `session_start`, `session_end`, `bounce`, and duration fields

## Suggested KPI Set

For PO, BA, and Data alignment, the most useful KPI starter set is:

- Sessions started
- Bounce rate
- Meaningful progress rate
- Checkpoint-to-checkpoint conversion rate
- Level completion rate by level
- Bad ending rate by branch result
- Full game completion rate
- Median active duration per completed level
