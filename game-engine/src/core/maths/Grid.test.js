import test from 'node:test';
import assert from 'node:assert/strict';
import { Grid, chebyshev, manhattan } from './Grid.js';

test('la grille reconnaît ses cases', () => {
    const board = new Grid(8, 8);
    assert.equal(board.contains({ x: 0, y: 0 }), true);
    assert.equal(board.contains({ x: 7, y: 7 }), true);
    assert.equal(board.contains({ x: 8, y: 0 }), false);
    assert.equal(board.contains({ x: -1, y: 0 }), false);
    assert.equal(board.contains({ x: 1.5, y: 1 }), false);
});

test('les distances de plateau sont discrètes', () => {
    const from = { x: 0, y: 0 };
    const to = { x: 2, y: 3 };
    assert.equal(manhattan(from, to), 5);
    assert.equal(chebyshev(from, to), 3);
});

test('la clé de case est stable', () => {
    assert.equal(new Grid(4, 4).key({ x: 2, y: 3 }), '2,3');
});

test('une grille vide est refusée', () => {
    assert.throws(() => new Grid(0, 4), /dimensions de grille invalides/);
});
