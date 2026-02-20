import { TileMap, TileType } from "./TileMap";

export type SpawnType =
  | "player"
  | "piranha"
  | "eel"
  | "shark"
  | "haarrfish"
  | "bubble-normal"
  | "bubble-blue"
  | "bubble-purple";

export interface LevelData {
  w: number;
  h: number;
  tiles: string[];
  legend: Record<string, TileType>;
  meta?: Record<string, unknown>;
}

export interface SpawnPoint {
  type: SpawnType;
  x: number;
  y: number;
}

export interface LoadedLevel {
  map: TileMap;
  spawns: SpawnPoint[];
  meta: Record<string, unknown>;
}

const SPAWN_LEGEND: Record<string, SpawnType> = {
  P: "player",
  e: "piranha",
  r: "eel",
  s: "shark",
  h: "haarrfish",
  b: "bubble-normal",
  B: "bubble-blue",
  p: "bubble-purple",
};

export class LevelLoader {
  public static load(level: LevelData): LoadedLevel {
    LevelLoader.validateDimensions(level);

    const flattenedTiles: TileType[] = [];
    const spawns: SpawnPoint[] = [];

    for (let y = 0; y < level.h; y += 1) {
      const row = level.tiles[y];

      for (let x = 0; x < level.w; x += 1) {
        const symbol = row[x];

        if (symbol in level.legend) {
          flattenedTiles.push(level.legend[symbol]);
          continue;
        }

        const spawnType = SPAWN_LEGEND[symbol];
        if (spawnType !== undefined) {
          spawns.push({ type: spawnType, x, y });
          flattenedTiles.push("floor");
          continue;
        }

        throw new Error(`Unknown tile symbol '${symbol}' at (${x}, ${y}).`);
      }
    }

    return {
      map: new TileMap(level.w, level.h, flattenedTiles),
      spawns,
      meta: level.meta ?? {},
    };
  }

  private static validateDimensions(level: LevelData): void {
    if (level.tiles.length !== level.h) {
      throw new Error(
        `Level row count mismatch. Expected ${level.h}, got ${level.tiles.length}.`,
      );
    }

    for (let y = 0; y < level.tiles.length; y += 1) {
      const row = level.tiles[y];
      if (row.length !== level.w) {
        throw new Error(
          `Level column count mismatch at row ${y}. Expected ${level.w}, got ${row.length}.`,
        );
      }
    }
  }
}
