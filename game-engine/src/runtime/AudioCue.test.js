import test from 'node:test';
import assert from 'node:assert/strict';
import { AudioCue } from './AudioCue.js';

test('play et stop s’empilent puis se vident', () => {
    const audio = new AudioCue();
    audio.play('pose');
    audio.stop('pose');
    assert.deepEqual(audio.drain(), [
        { id: 'pose', action: 'play' },
        { id: 'pose', action: 'stop' },
    ]);
    assert.deepEqual(audio.drain(), []);
});

test('un son vide est refusé', () => {
    assert.throws(() => new AudioCue().play(''), /son requis/);
});
