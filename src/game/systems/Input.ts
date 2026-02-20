import { Direction, InputBuffer } from './InputBuffer';

type ActionKey = 'action' | 'bomb' | 'restart' | 'pause';

export class Input {
  private readonly buffer = new InputBuffer();
  private readonly heldActions: Record<ActionKey, boolean> = {
    action: false,
    bomb: false,
    restart: false,
    pause: false,
  };
  private readonly pressedThisFrame: Record<ActionKey, boolean> = {
    action: false,
    bomb: false,
    restart: false,
    pause: false,
  };

  constructor(target: Window | Document = window) {
    target.addEventListener('keydown', this.onKeyDown);
    target.addEventListener('keyup', this.onKeyUp);
  }

  dispose(target: Window | Document = window): void {
    target.removeEventListener('keydown', this.onKeyDown);
    target.removeEventListener('keyup', this.onKeyUp);
  }

  get currentDirection(): Direction | null {
    return this.buffer.currentDirection;
  }

  get queuedDirection(): Direction | null {
    return this.buffer.queuedDirection;
  }

  /**
   * Call this exactly on tile arrival to ensure buffered turns happen with no input lag.
   */
  resolveMovementDirection(canMove: (direction: Direction) => boolean): Direction | null {
    return this.buffer.resolveDirectionAtTileArrival(canMove);
  }

  isActionHeld(): boolean {
    return this.heldActions.action;
  }

  isBombHeld(): boolean {
    return this.heldActions.bomb;
  }

  consumeRestartPressed(): boolean {
    return this.consumePressed('restart');
  }

  consumePausePressed(): boolean {
    return this.consumePressed('pause');
  }

  consumeActionPressed(): boolean {
    return this.consumePressed('action');
  }

  consumeBombPressed(): boolean {
    return this.consumePressed('bomb');
  }

  private consumePressed(key: ActionKey): boolean {
    const pressed = this.pressedThisFrame[key];
    this.pressedThisFrame[key] = false;
    return pressed;
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();

    const direction = this.toDirection(key);
    if (direction) {
      this.buffer.pressDirection(direction);
      event.preventDefault();
      return;
    }

    if (key === ' ') {
      this.markActionPressed('action');
      event.preventDefault();
      return;
    }

    if (key === 'shift' || key === 'control' || key === 'ctrl') {
      this.markActionPressed('bomb');
      event.preventDefault();
      return;
    }

    if (key === 'r') {
      this.markActionPressed('restart');
      event.preventDefault();
      return;
    }

    if (key === 'escape') {
      this.markActionPressed('pause');
      event.preventDefault();
    }
  };

  private onKeyUp = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();

    const direction = this.toDirection(key);
    if (direction) {
      this.buffer.releaseDirection(direction);
      event.preventDefault();
      return;
    }

    if (key === ' ') {
      this.heldActions.action = false;
      event.preventDefault();
      return;
    }

    if (key === 'shift' || key === 'control' || key === 'ctrl') {
      this.heldActions.bomb = false;
      event.preventDefault();
    }
  };

  private markActionPressed(action: ActionKey): void {
    if (!this.heldActions[action]) {
      this.pressedThisFrame[action] = true;
    }
    this.heldActions[action] = true;
  }

  private toDirection(key: string): Direction | null {
    switch (key) {
      case 'arrowup':
      case 'w':
        return 'up';
      case 'arrowdown':
      case 's':
        return 'down';
      case 'arrowleft':
      case 'a':
        return 'left';
      case 'arrowright':
      case 'd':
        return 'right';
      default:
        return null;
    }
  }
}
