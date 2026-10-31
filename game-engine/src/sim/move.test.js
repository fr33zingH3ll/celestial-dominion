import test from 'node:test';
import assert from 'node:assert/strict';
import { clampMove } from './move.js';

test('clampMove refuse les valeurs non finies', () => {
    assert.deepEqual(clampMove({ x: Number.NaN, y: 1 }), { x: 0, y: 0 });
    assert.deepEqual(clampMove(undefined), { x: 0, y: 0 });
});

test('clampMove laisse un vecteur déjà court', () => {
    assert.deepEqual(clampMove({ x: 0.2, y: -0.4 }), { x: 0.2, y: -0.4 });
});

test('clampMove ramène la longueur à 1', () => {
    const move = clampMove({ x: 30, y: 40 });
    assert.ok(Math.abs(Math.hypot(move.x, move.y) - 1) < 1e-10);
    assert.ok(Math.abs(move.x - 0.6) < 1e-10);
    assert.ok(Math.abs(move.y - 0.8) < 1e-10);
});
