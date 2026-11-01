import test from 'node:test';
import assert from 'node:assert/strict';
import { GameObject } from './GameObject.js';

test('un objet garde son identifiant', () => {
    const piece = new GameObject('pion-1');
    assert.equal(piece.id, 'pion-1');
    assert.equal(piece.destroyed, false);
});

test('destroy est idempotent', () => {
    const piece = new GameObject(4);
    piece.destroy();
    piece.destroy();
    assert.equal(piece.destroyed, true);
    assert.equal(piece.id, 4);
});

test('un identifiant vide est refusé', () => {
    assert.throws(() => new GameObject(''), /identifiant requis/);
});
