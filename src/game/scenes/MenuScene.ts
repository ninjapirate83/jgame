import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS } from '../constants';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.MENU);
  }

  create(): void {
    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT / 2;

    this.cameras.main.setBackgroundColor('#11121c');

    this.add
      .text(centerX, centerY - 80, 'DESKTOP PHASER STARTER', {
        fontFamily: 'monospace',
        fontSize: '36px',
        color: '#f8f8ff'
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, centerY, 'Press Enter to Start', {
        fontFamily: 'monospace',
        fontSize: '30px',
        color: '#ffe082'
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, centerY + 120, 'Keybindings:\nENTER - Start game\nESC - Back to menu', {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: '#9ad4ff',
        align: 'center'
      })
      .setOrigin(0.5);

    this.input.keyboard?.once('keydown-ENTER', () => {
      this.scene.start(SCENE_KEYS.GAME);
      this.scene.launch(SCENE_KEYS.HUD);
    });
  }
}
