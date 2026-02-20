export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * Stores the player movement intent in a way that supports classic arcade turning:
 * - currentDirection = the direction currently used for movement
 * - queuedDirection = the next desired turn, applied on tile boundary when valid
 */
export class InputBuffer {
  private heldDirections = new Set<Direction>();
  private pressOrder: Direction[] = [];

  public currentDirection: Direction | null = null;
  public queuedDirection: Direction | null = null;

  pressDirection(direction: Direction): void {
    if (!this.heldDirections.has(direction)) {
      this.heldDirections.add(direction);
      this.pressOrder = this.pressOrder.filter((d) => d !== direction);
      this.pressOrder.push(direction);
    }

    this.queuedDirection = direction;
    if (!this.currentDirection) {
      this.currentDirection = direction;
    }
  }

  releaseDirection(direction: Direction): void {
    this.heldDirections.delete(direction);
    this.pressOrder = this.pressOrder.filter((d) => d !== direction);

    if (this.currentDirection === direction) {
      const fallback = this.getMostRecentHeldDirection();
      this.currentDirection = fallback;
      if (fallback) {
        this.queuedDirection = fallback;
      }
    }
  }

  /**
   * Call this on tile boundaries.
   * If queuedDirection is valid, it becomes currentDirection immediately.
   */
  resolveDirectionAtTileArrival(canMove: (direction: Direction) => boolean): Direction | null {
    if (this.queuedDirection && canMove(this.queuedDirection)) {
      this.currentDirection = this.queuedDirection;
      this.queuedDirection = null;
      return this.currentDirection;
    }

    if (this.currentDirection && canMove(this.currentDirection)) {
      return this.currentDirection;
    }

    const fallback = this.getMostRecentHeldDirection();
    if (fallback && canMove(fallback)) {
      this.currentDirection = fallback;
      return fallback;
    }

    this.currentDirection = null;
    return null;
  }

  getHeldDirections(): Direction[] {
    return [...this.pressOrder];
  }

  private getMostRecentHeldDirection(): Direction | null {
    for (let i = this.pressOrder.length - 1; i >= 0; i -= 1) {
      const direction = this.pressOrder[i];
      if (this.heldDirections.has(direction)) {
        return direction;
      }
    }

    return null;
  }
}
