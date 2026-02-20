import { TILE_SIZE_PX } from '../constants';
import { Direction, MoveCommand, StepperEntity } from '../types';

const DIRECTION_TO_DELTA: Record<Direction, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

export class FrameClock {
  private frame = 0;

  public tick(): number {
    this.frame += 1;
    return this.frame;
  }

  public getFrame(): number {
    return this.frame;
  }
}

export class Stepper {
  public updateEntity(entity: StepperEntity): void {
    if (entity.framesIntoStep === 0) {
      entity.activeDirection = entity.moveCommand;

      if (!entity.activeDirection) {
        entity.x = entity.tx * TILE_SIZE_PX;
        entity.y = entity.ty * TILE_SIZE_PX;
        return;
      }
    }

    if (!entity.activeDirection) {
      return;
    }

    entity.framesIntoStep += 1;

    const delta = DIRECTION_TO_DELTA[entity.activeDirection];
    const startX = entity.tx * TILE_SIZE_PX;
    const startY = entity.ty * TILE_SIZE_PX;
    const targetX = (entity.tx + delta.dx) * TILE_SIZE_PX;
    const targetY = (entity.ty + delta.dy) * TILE_SIZE_PX;
    const progress = entity.framesIntoStep / entity.stepFrames;

    entity.x = startX + (targetX - startX) * progress;
    entity.y = startY + (targetY - startY) * progress;

    if (entity.framesIntoStep >= entity.stepFrames) {
      entity.tx += delta.dx;
      entity.ty += delta.dy;
      entity.x = entity.tx * TILE_SIZE_PX;
      entity.y = entity.ty * TILE_SIZE_PX;
      entity.framesIntoStep = 0;
    }
  }

  public update(entities: StepperEntity[]): void {
    for (const entity of entities) {
      this.updateEntity(entity);
    }
  }
}

export class GameScene {
  private readonly clock = new FrameClock();
  private readonly stepper = new Stepper();
  private readonly entities: StepperEntity[] = [];

  public frameLabel = 'Frame: 0';

  public addEntity(entity: StepperEntity): void {
    this.entities.push(entity);
  }

  public tick(): void {
    const frame = this.clock.tick();
    this.stepper.update(this.entities);
    this.frameLabel = `Frame: ${frame}`;
  }

  public getFrame(): number {
    return this.clock.getFrame();
  }
}

export function createTestEntity(stepFrames: number, moveCommand: MoveCommand): StepperEntity {
  return {
    id: 'test-entity',
    tx: 0,
    ty: 0,
    x: 0,
    y: 0,
    stepFrames,
    moveCommand,
    activeDirection: null,
    framesIntoStep: 0,
  };
}
