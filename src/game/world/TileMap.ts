export type TileType = "wall" | "floor";

export interface GridPosition {
  x: number;
  y: number;
}

export class TileMap {
  public readonly width: number;
  public readonly height: number;
  private readonly tiles: TileType[];

  public constructor(width: number, height: number, tiles: TileType[]) {
    if (width <= 0 || height <= 0) {
      throw new Error(`TileMap dimensions must be positive. Got ${width}x${height}.`);
    }

    if (tiles.length !== width * height) {
      throw new Error(
        `TileMap tile count mismatch. Expected ${width * height}, got ${tiles.length}.`,
      );
    }

    this.width = width;
    this.height = height;
    this.tiles = tiles;
  }

  public inBounds(position: GridPosition): boolean {
    return (
      position.x >= 0 &&
      position.x < this.width &&
      position.y >= 0 &&
      position.y < this.height
    );
  }

  public getTile(position: GridPosition): TileType {
    if (!this.inBounds(position)) {
      throw new Error(`Position out of bounds: (${position.x}, ${position.y}).`);
    }

    return this.tiles[this.toIndex(position)];
  }

  public isWall(position: GridPosition): boolean {
    return this.getTile(position) === "wall";
  }

  public isWalkable(position: GridPosition): boolean {
    return this.getTile(position) === "floor";
  }

  private toIndex(position: GridPosition): number {
    return position.y * this.width + position.x;
  }
}
