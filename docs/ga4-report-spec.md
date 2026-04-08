# GA4 Report Spec

## Purpose

This document defines a practical Google Analytics 4 reporting setup for the current game analytics implementation.

It is designed for three audiences:

- PO: product funnel, completion, and bad-ending monitoring
- BA: journey analysis, branch analysis, and drop-off review
- Data: event semantics, custom definition setup, and reporting consistency

This spec is based on the current event model in:

- `src/game/analytics.js`
- `src/main.js`
- `docs/analytics-events-report.md`

## Current Event Inventory

The current code forwards these custom events to GA4 in production:

- `session_start`
- `session_end`
- `scene_enter`
- `checkpoint_reached`
- `level_start`
- `level_complete`
- `bad_ending`
- `game_complete`

Current custom event parameters used by the game:

- `session_id`
- `scene_key`
- `checkpoint_id`
- `level`
- `status`
- `result`
- `duration_ms`
- `wall_clock_duration_ms`
- `bounce`

## What Should Be Registered In GA4

To make the custom parameters usable in standard reports and explorations, register them as event-scoped custom definitions in GA4.

### Custom dimensions

Create these event-scoped custom dimensions:

- `scene_key`
  Suggested display name: `Scene Key`
- `checkpoint_id`
  Suggested display name: `Checkpoint ID`
- `level`
  Suggested display name: `Level`
- `status`
  Suggested display name: `Status`
- `result`
  Suggested display name: `Result`
- `session_id`
  Suggested display name: `Session ID`
- `bounce`
  Suggested display name: `Bounce`

### Custom metrics

Create these event-scoped custom metrics:

- `duration_ms`
  Suggested display name: `Active Duration (ms)`
- `wall_clock_duration_ms`
  Suggested display name: `Wall Clock Duration (ms)`

## Minimum Reporting Model

Use `checkpoint_reached` as the main progression event.

Use supporting events as follows:

- `scene_enter`: technical navigation visibility
- `level_start`: level participation
- `level_complete`: level completion
- `bad_ending`: branch failure tracking
- `game_complete`: final success event
- `session_start` and `session_end`: session quality and bounce analysis

## Recommended GA4 Reports

### 1. Executive Funnel

Audience:

- PO
- BA

Purpose:

- show end-to-end conversion from game open to game completion

Recommended funnel steps:

1. `session_start`
2. `checkpoint_reached` where `checkpoint_id = opening.start`
3. `checkpoint_reached` where `checkpoint_id = intro.story`
4. `checkpoint_reached` where `checkpoint_id = intro.market-invite`
5. `checkpoint_reached` where `checkpoint_id = level1.task-intro`
6. `checkpoint_reached` where `checkpoint_id = level1.complete`
7. `checkpoint_reached` where `checkpoint_id = level2.complete`
8. `checkpoint_reached` where `checkpoint_id = level3.arrangement.start`
9. `checkpoint_reached` where `checkpoint_id = level3.complete`
10. `checkpoint_reached` where `checkpoint_id = level4.washing.start`
11. `checkpoint_reached` where `checkpoint_id = level4.complete`
12. `game_complete`

Primary readout:

- users or sessions reaching each step
- step-to-step conversion rate
- abandonment between major milestones

### 2. Checkpoint Drop-off Report

Audience:

- PO
- BA
- Data

Purpose:

- show where players stop progressing in the story

Recommended table:

- Rows: `Checkpoint ID`
- Metrics:
  - Event count
  - Total users
  - Active users

Recommended filter:

- Event name exactly matches `checkpoint_reached`

Primary readout:

- most reached checkpoints
- weakest checkpoint transitions
- candidate scenes for design review

### 3. Level Performance Report

Audience:

- PO
- BA

Purpose:

- compare participation and completion across levels

Recommended table:

- Rows: `Level`
- Breakdown: `Event name`
- Filter:
  - event name in `level_start`, `level_complete`, `bad_ending`

Primary readout:

- starts by level
- completions by level
- bad endings by level
- completion rate by level

Recommended calculated interpretation:

- `level_complete / level_start` by level

### 4. Bad Ending Analysis

Audience:

- PO
- BA

Purpose:

- identify which failure branches hurt conversion most

Recommended table:

- Rows: `Result`
- Secondary dimension: `Checkpoint ID`
- Metrics:
  - Event count
  - Total users

Recommended filter:

- Event name exactly matches `bad_ending`

Expected current values:

- `intro_tiktok`
- `bargain_fail`

Primary readout:

- which failure branch is most common
- whether failure is concentrated in intro or level 1

### 5. Session Quality Report

Audience:

- PO
- Data

Purpose:

- understand bounce and engagement quality

Recommended table:

- Rows: `Bounce`
- Metrics:
  - Event count
  - Total users
  - Average `Wall Clock Duration (ms)`
  - Average `Active Duration (ms)`

Recommended filter:

- Event name exactly matches `session_end`

Primary readout:

- bounce rate
- average session duration
- difference between active time and elapsed time

### 6. Scene Coverage Report

Audience:

- BA
- Data

Purpose:

- validate whether scenes are entered as expected and whether mapping is complete

Recommended table:

- Rows: `Scene Key`
- Metrics:
  - Event count
  - Total users

Recommended filter:

- Event name exactly matches `scene_enter`

Primary readout:

- scene visitation order and frequency
- scenes with low reach
- scenes missing matching checkpoints

## GA4 Setup Steps

### A. Register custom definitions

Create event-scoped custom dimensions for:

- `scene_key`
- `checkpoint_id`
- `level`
- `status`
- `result`
- `session_id`
- `bounce`

Create event-scoped custom metrics for:

- `duration_ms`
- `wall_clock_duration_ms`

Suggested naming convention:

- use clear business names in the GA4 UI
- keep event parameter names exactly aligned with the code

### B. Build the funnel exploration

Create an exploration for the executive funnel with these conditions:

1. Step 1:
   event name equals `session_start`
2. Step 2:
   event name equals `checkpoint_reached`
   and `checkpoint_id` equals `opening.start`
3. Step 3:
   event name equals `checkpoint_reached`
   and `checkpoint_id` equals `intro.story`
4. Continue with the remaining progression checkpoints
5. Final step:
   event name equals `game_complete`

Recommended settings:

- use open funnel for first pass
- use session-level exploration if the property and reporting model are session-oriented
- compare by device category or country later only if needed

### C. Build reusable detail reports

Create detail reports or explorations for:

- checkpoint drop-off
- level performance
- bad ending analysis
- session quality

If the team needs easier access in the left nav, promote the final reports into a report collection after validation.

## Suggested Dashboard Layout

If you want a compact GA4 stakeholder dashboard, use these blocks:

- Card 1: Sessions started
- Card 2: Bounce rate
- Card 3: Game completion count
- Card 4: Game completion rate
- Card 5: Most common bad ending
- Card 6: Level 1 completion rate
- Card 7: Level 2 completion rate
- Card 8: Level 3 completion rate
- Card 9: Level 4 completion rate
- Card 10: Top drop-off checkpoint

## Interpretation Rules

Use these rules consistently in reviews:

- `checkpoint_reached` is the canonical progression signal
- `scene_enter` is a supporting navigation signal
- `level_start` and `level_complete` are level milestone events
- `bad_ending` is an outcome event, not just a navigation event
- `game_complete` is the final success KPI
- `session_end` with `bounce = true` is the canonical bounce classification

## Known Gaps

These limitations exist in the current code and affect GA4 reporting:

- low-level gameplay actions inside challenges are not tracked
- `status` and `result` are reused across multiple event types, so downstream interpretation must be event-specific

## Recommended Next Tracking Changes

To improve future reporting, add these events:

- `challenge_start`
- `challenge_step_complete`
- `challenge_fail`
- `challenge_retry`
- `challenge_success`
- `choice_selected`

These would let the team answer:

- which step inside a challenge causes failure
- whether retries correlate with churn
- which choices lead to bad endings before failure actually happens

## Implementation Checklist

- Register all custom dimensions
- Register both custom metrics
- Wait for fresh production data to populate
- Validate event parameter values in Realtime or DebugView
- Build the executive funnel exploration
- Build the four supporting reports
- Review the checkpoint naming with PO and BA
