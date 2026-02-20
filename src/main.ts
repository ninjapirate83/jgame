import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS } from './game/constants';
import { BootScene } from './game/scenes/BootScene';
import { MenuScene } from './game/scenes/MenuScene';
import { GameScene } from './game/scenes/GameScene';
import { HudScene } from './game/scenes/HudScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  pixelArt: true,
  backgroundColor: '#0f0f19',
  scene: [BootScene, MenuScene, GameScene, HudScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    zoom: 1
  },
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true
  },
  input: {
    gamepad: false,
    keyboard: true,
    touch: false,
    mouse: true
  },
  disableContextMenu: true,
  fps: {
    target: 60,
    forceSetTimeOut: true
  }
};

new Phaser.Game(config);
