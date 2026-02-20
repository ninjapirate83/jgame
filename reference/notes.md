MAXIMUM FIDELITY MODE (Bubble Trouble 1996 feel)

Global timing model
- Run the simulation on an integer-frame clock at 30fps.
- Use a fixed timestep: 1 tick = 1 frame (33.333ms).
- ALL gameplay timing MUST be expressed in whole frames (no floating ms).
- All movement is tile-locked and advances only on tile boundaries. No physics engine.
- Visual movement between tiles is linear with NO easing (no acceleration/deceleration). Pixel art scaling uses nearest-neighbor.

Measured player cadence (from provided video)
- Player moves 1 tile per step in 8 frames (≈267ms).
- Acceptable variance: 7–9 frames due to animation/recording, but implement as a strict constant:
  - PLAYER_STEP_FRAMES = 8

Movement system rules
- Entities have logical tile coords (tx, ty) and render position (x, y).
- A “step” is:
  1) Commit next tile at step-start (reserve occupancy)
  2) Render interpolates linearly over STEP_FRAMES
  3) At step-end (frame boundary), finalize tile and trigger AI decision hooks
- Collisions are resolved ONLY at tile boundaries (step start/end), never mid-tween.

Enemy speeds (frame-accurate style; preserve original hierarchy)
Implement these as fixed step durations in frames:
- CHOMBERT (piranha): 12 frames/tile (slowest)
- REMINGTON (eel): 10 frames/tile
- NORMAL (shark): 8 frames/tile
- HAARRFISH: 6 frames/tile (fastest)

AI decision intervals (crucial)
- Enemies ONLY decide direction on tile-arrival (step-end).
- Do not replan every frame.
- Add “junction persistence” to avoid jitter:

Chombert (wander, cannot push)
- On arrival, if continuing forward is possible: continue forward with 80% probability.
- Otherwise choose a random valid direction excluding immediate reverse unless forced.
- Add a junction cooldown: once a new direction is chosen, do not choose again for 2 arrivals unless forced.

Remington (push-capable chase-lite)
- On arrival, choose a direction that reduces Manhattan distance to player (greedy).
- If chosen direction is blocked by a NORMAL bubble and the tile beyond is empty, push bubble and proceed.
- If stuck (distance not reduced) for 3 arrivals, wander for 30 frames (1 second), then resume chase.

Normal (shark attacker)
- On arrival: greedy chase with lane bias (try to align row/col with player).
- Projectile fire:
  - Only check fire conditions on arrival (step-end).
  - FIRE_COOLDOWN_FRAMES = 81 (2.7s) with jitter ±9 frames.
  - FIRE_WINDUP_FRAMES = 9 (0.3s tell animation) before projectile spawns.
  - Fire if: player within 8 tiles Manhattan AND (clear LOS in same row/col OR within 4 tiles regardless of LOS).

Shark projectile behavior
- PROJECTILE_STEP_FRAMES = 3 (fast), tile-locked.
- Projectile does NOT bounce; if next tile is wall, it disappears.
- Projectile kills player on contact at tile boundary.

Bubble rules (fidelity)
- Bubbles are both tools and hazards: moving bubbles kill enemies AND the player.
- Bubble types:
  - NORMAL: moves exactly 1 tile when pushed, using BUBBLE_NORMAL_STEP_FRAMES = 8.
  - BLUE: after being pushed, enters AUTO_MOVE. AUTO_STEP_FRAMES = 8. bounceCount = 1.
  - PURPLE: after being pushed, enters AUTO_MOVE. AUTO_STEP_FRAMES = 6. bounceCount = 2.
- Bounce behavior:
  - NO “impact pause” frames.
  - On attempted move into a wall tile: reverse direction immediately and decrement bounceCount; continue on next scheduled auto-step.
  - When bounceCount reaches 0, bubble stops (IDLE).
- Bubble-to-bubble collision: if next tile occupied by another bubble, bubble stops (no overlap).
- Bubble-to-enemy: enemy dies, bubble stops.
- Bubble-to-player: player dies (apply death state), bubble stops.

Bomb fidelity
- Player-placed bomb:
  - FUSE_FRAMES = 60 (2.0s)
  - Radius uses Manhattan distance (diamond shape):
    - RED_RADIUS = 2 tiles
    - PURPLE_RADIUS = 3 tiles (when from item bubble)
- Explosion resolution happens on a single frame:
  - Kills player/enemies in radius
  - Pops bubbles in radius
  - Allows chain reactions (optional but preferred)

Power-ups (frame-based)
- Invisibility duration: 180 frames (6s). Enemies ignore player; bubbles still kill.
- Capture duration: 120 frames (4s). Freeze all enemies in place (no movement, no attacks).

Animation timing (keep it snappy)
- Death freeze / hit-stun: 15 frames
- Respawn invulnerability: 36 frames (1.2s) with flicker
- Pop animation: 6 frames
- Explosion flash: 6 frames
- Level-clear delay: 30 frames

Visual upgrade requirement (enemies must not look lame)
- Replace placeholder blob enemies with distinct retro pixel sprites (16x16 or 20x20) with strong silhouettes:
  - Chombert: piranha (teeth silhouette)
  - Remington: eel (long curved body)
  - Normal: shark (dorsal fin; attack tell frame)
  - Haarrfish: spiky/frilly “hair” outline + glowing eyes (scariest)
- Each enemy: 2-frame swim loop + 2-frame idle bob + 1-frame attack tell for shark + 2-frame death pop.
- Nearest-neighbor scaling only. No smoothing.

Acceptance tests
- Player tile step occurs exactly every 8 frames while holding a direction.
- Enemy movement decisions occur only on tile arrival (no per-frame jitter turns).
- Blue bubble stops after exactly 1 wall bounce; Purple after exactly 2.
- Bomb detonation occurs exactly 60 frames after placement.
