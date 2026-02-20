import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS } from '../constants';

export class GameScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.GAME);
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#1a1f2b');

    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x2f3d52, 1);

    const gridSize = 32;

    for (let x = 0; x <= GAME_WIDTH; x += gridSize) {
      graphics.lineBetween(x, 0, x, GAME_HEIGHT);
    }

    for (let y = 0; y <= GAME_HEIGHT; y += gridSize) {
      graphics.lineBetween(0, y, GAME_WIDTH, y);
    }

    this.input.keyboard?.on('keydown-ESC', () => {
      this.scene.stop(SCENE_KEYS.HUD);
      this.scene.start(SCENE_KEYS.MENU);
    });
  }
}
