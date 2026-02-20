import { Direction } from '../systems/InputBuffer';
import { Input } from '../systems/Input';

export interface TilePosition {
  x: number;
  y: number;
}

/**
 * Minimal player movement integration demonstrating tile-locked movement.
 *
 * update() should be called every frame.
 * - Frames between tile arrivals keep moving in active direction.
 * - On tile arrival, buffered direction is applied immediately if valid.
 */
export class Player {
  readonly input: Input;

  private readonly stepFramesPerTile: number;
  private framesUntilTileArrival = 0;

  private tile: TilePosition;
  private movingDirection: Direction | null = null;

  constructor(input: Input, spawn: TilePosition, stepFramesPerTile = 8) {
    this.input = input;
    this.tile = { ...spawn };
    this.stepFramesPerTile = stepFramesPerTile;
  }

  update(canMoveFromTile: (tile: TilePosition, direction: Direction) => boolean): void {
    if (this.framesUntilTileArrival > 0) {
      this.framesUntilTileArrival -= 1;
      return;
    }

    const direction = this.input.resolveMovementDirection((nextDirection) =>
      canMoveFromTile(this.tile, nextDirection),
    );

    if (!direction) {
      this.movingDirection = null;
      return;
    }

    this.movingDirection = direction;
    this.advanceOneTile(direction);
    this.framesUntilTileArrival = this.stepFramesPerTile - 1;
  }

  getTilePosition(): TilePosition {
    return { ...this.tile };
  }

  getMovingDirection(): Direction | null {
    return this.movingDirection;
  }

  private advanceOneTile(direction: Direction): void {
    switch (direction) {
      case 'up':
        this.tile.y -= 1;
        break;
      case 'down':
        this.tile.y += 1;
        break;
      case 'left':
        this.tile.x -= 1;
        break;
      case 'right':
        this.tile.x += 1;
        break;
    }
  }
}
