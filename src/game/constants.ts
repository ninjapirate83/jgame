export const SIMULATION_FPS = 30;

// 1 frame = 1000/30ms (33.333...ms) represented as an exact rational.
export const FRAME_DURATION_MS_NUMERATOR = 1000;
export const FRAME_DURATION_MS_DENOMINATOR = SIMULATION_FPS;

export const PLAYER_STEP_FRAMES = 8;

export const ENEMY_STEP_FRAMES = {
  CHOMBERT: 12,
  REMINGTON: 10,
  NORMAL: 8,
  HAARRFISH: 6,
} as const;

export const BUBBLE_STEP_FRAMES = {
  NORMAL: 8,
  BLUE_AUTO: 8,
  PURPLE_AUTO: 6,
} as const;

export const BOMB_FRAMES = {
  FUSE: 60,
  CAPTURE: 120,
  INVISIBILITY: 180,
} as const;

export const TILE_SIZE_PX = 16;
