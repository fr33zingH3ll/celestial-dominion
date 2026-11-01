import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceGame } from './guard.js';

test('un pas qui jette laisse advanceGame revenir', () => {
    const calls = [];
    const game = {
        update(delta) {
            calls.push(delta);
            throw new Error('pas cassé');
        },
    };
    const original = console.error;
    console.error = () => {};

    let left;
    try {
        left = advanceGame(game, 0, 120, 50, 5);
    } finally {
        console.error = original;
    }

    assert.deepEqual(calls, [50, 50]);
    assert.equal(left, 20);
});

test('le retard au-delà du plafond est abandonné', () => {
    let calls = 0;
    const left = advanceGame({
        update() { calls += 1; },
    }, 0, 1000, 100, 5);

    assert.equal(calls, 5);
    assert.equal(left, 0);
});
