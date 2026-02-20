import Phaser from 'phaser';
import { SCENE_KEYS } from '../constants';

export class HudScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.HUD);
  }

  create(): void {
    this.add
      .text(16, 12, 'HUD: GAME RUNNING (ESC to Menu)', {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#ffffff',
        backgroundColor: '#00000088',
        padding: { x: 8, y: 4 }
      })
      .setScrollFactor(0)
      .setDepth(1000);
  }
}
