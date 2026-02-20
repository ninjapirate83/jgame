import { GridPosition } from "./TileMap";

export interface MoveIntent {
  entityId: string;
  from: GridPosition;
  to: GridPosition;
}

function key(position: GridPosition): string {
  return `${position.x},${position.y}`;
}

function copy(position: GridPosition): GridPosition {
  return { x: position.x, y: position.y };
}

export class Occupancy {
  private committed = new Map<string, string>();
  private positions = new Map<string, GridPosition>();
  private reservations = new Map<string, string>();
  private movingThisStep = new Set<string>();

  public place(entityId: string, position: GridPosition): void {
    const destinationKey = key(position);
    const existingEntity = this.committed.get(destinationKey);

    if (existingEntity !== undefined && existingEntity !== entityId) {
      throw new Error(
        `Cannot place '${entityId}' at occupied tile (${position.x}, ${position.y}).`,
      );
    }

    const previousPosition = this.positions.get(entityId);
    if (previousPosition !== undefined) {
      this.committed.delete(key(previousPosition));
    }

    this.positions.set(entityId, copy(position));
    this.committed.set(destinationKey, entityId);
  }

  public beginStep(movingEntityIds: Iterable<string>): void {
    this.reservations.clear();
    this.movingThisStep = new Set(movingEntityIds);
  }

  public reserveDestination(entityId: string, destination: GridPosition): boolean {
    const destinationKey = key(destination);
    const reservedBy = this.reservations.get(destinationKey);

    if (reservedBy !== undefined && reservedBy !== entityId) {
      return false;
    }

    const committedBy = this.committed.get(destinationKey);
    if (committedBy !== undefined && committedBy !== entityId) {
      if (!this.movingThisStep.has(committedBy)) {
        return false;
      }
    }

    this.reservations.set(destinationKey, entityId);
    return true;
  }

  public finalizeStep(moves: MoveIntent[]): void {
    for (const move of moves) {
      const current = this.positions.get(move.entityId);
      if (current === undefined) {
        throw new Error(`Cannot move unknown entity '${move.entityId}'.`);
      }

      if (current.x !== move.from.x || current.y !== move.from.y) {
        throw new Error(
          `Move source mismatch for '${move.entityId}'. Expected (${current.x}, ${current.y}), got (${move.from.x}, ${move.from.y}).`,
        );
      }

      const destinationKey = key(move.to);
      const reservedBy = this.reservations.get(destinationKey);
      if (reservedBy !== move.entityId) {
        throw new Error(
          `Move destination (${move.to.x}, ${move.to.y}) for '${move.entityId}' was not reserved by that entity.`,
        );
      }

      this.committed.delete(key(current));
      this.positions.set(move.entityId, copy(move.to));
      this.committed.set(destinationKey, move.entityId);
    }

    this.reservations.clear();
    this.movingThisStep.clear();
  }

  public isOccupied(position: GridPosition): boolean {
    return this.committed.has(key(position));
  }

  public getEntityAt(position: GridPosition): string | undefined {
    return this.committed.get(key(position));
  }

  public getPosition(entityId: string): GridPosition | undefined {
    const position = this.positions.get(entityId);
    return position === undefined ? undefined : copy(position);
  }
}
