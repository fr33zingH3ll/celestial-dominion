import test from 'node:test';
import assert from 'node:assert/strict';
import { pick } from './Input.js';

const cells = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
const pieces = [
    { id: 'dessous', x: 0, y: 0 },
    { id: 'dessus', x: 0, y: 0 },
];

test('une pièce est choisie avant la case', () => {
    assert.deepEqual(pick({ x: 0, y: 0 }, { pieces, cells }), {
        kind: 'piece',
        id: 'dessus',
        x: 0,
        y: 0,
    });
});

test('une case vide reste une case', () => {
    assert.deepEqual(pick({ x: 1, y: 0 }, { pieces, cells }), { kind: 'cell', x: 1, y: 0 });
});

test('hors plateau, rien n’est choisi', () => {
    assert.equal(pick({ x: 3, y: 3 }, { pieces, cells }), null);
});

test('un pointer non entier est refusé', () => {
    assert.throws(() => pick({ x: 0.5, y: 0 }, { cells }), /pointer invalide/);
});
