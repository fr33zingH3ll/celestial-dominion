import test from 'node:test';
import assert from 'node:assert/strict';
import { Interpolation } from './Interpolation.js';

test('interpolate reste entre le départ et l’arrivée', () => {
    const move = new Interpolation(0, 10, 100);
    assert.equal(move.interpolate(0), 0);
    assert.equal(move.interpolate(0.5), 5);
    assert.equal(move.interpolate(2), 10);
    assert.equal(move.interpolate(-1), 0);
});

test('at suit la durée', () => {
    const move = new Interpolation(0, 10, 100);
    assert.equal(move.at(0), 0);
    assert.equal(move.at(50), 5);
    assert.equal(move.at(100), 10);
    assert.equal(move.at(250), 10);
});

test('une durée nulle est refusée', () => {
    assert.throws(() => new Interpolation(0, 1, 0), /interpolation invalide/);
});
