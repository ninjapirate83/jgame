import test from 'node:test';
import assert from 'node:assert/strict';

import { PLAYER_STEP_FRAMES, TILE_SIZE_PX } from '../dist/game/constants.js';
import { GameScene, createTestEntity } from '../dist/game/systems/FrameClock.js';

test('GameScene frame label reports current integer frame', () => {
  const scene = new GameScene();
  assert.equal(scene.frameLabel, 'Frame: 0');

  scene.tick();
  scene.tick();

  assert.equal(scene.getFrame(), 2);
  assert.equal(scene.frameLabel, 'Frame: 2');
});

test('test entity moves exactly 1 tile every 8 frames when commanded', () => {
  const scene = new GameScene();
  const entity = createTestEntity(PLAYER_STEP_FRAMES, 'right');
  scene.addEntity(entity);

  for (let i = 0; i < PLAYER_STEP_FRAMES - 1; i += 1) {
    scene.tick();
    assert.equal(entity.tx, 0, `entity should stay on start tile before frame ${PLAYER_STEP_FRAMES}`);
  }

  scene.tick();
  assert.equal(entity.tx, 1);
  assert.equal(entity.x, TILE_SIZE_PX);

  for (let i = 0; i < PLAYER_STEP_FRAMES; i += 1) {
    scene.tick();
  }

  assert.equal(entity.tx, 2);
  assert.equal(entity.x, TILE_SIZE_PX * 2);
});
