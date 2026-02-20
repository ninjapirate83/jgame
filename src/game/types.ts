export type Direction = 'up' | 'down' | 'left' | 'right';

export type MoveCommand = Direction | null;

export interface TilePosition {
  tx: number;
  ty: number;
}

export interface RenderPosition {
  x: number;
  y: number;
}

export interface StepperEntity extends TilePosition, RenderPosition {
  id: string;
  stepFrames: number;
  moveCommand: MoveCommand;
  activeDirection: MoveCommand;
  framesIntoStep: number;
}
