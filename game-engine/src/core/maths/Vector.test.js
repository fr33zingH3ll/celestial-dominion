import test from 'node:test';
import assert from 'node:assert/strict';
import { Vector } from './Vector.js';

test('Vector.add retourne la somme des deux vecteurs', () => {
    const result = new Vector(1, 2).add(new Vector(3, 4));
    assert.equal(result.x, 4);
    assert.equal(result.y, 6);
});

test('Vector.subtract retourne la différence des deux vecteurs', () => {
    const result = new Vector(1, 2).subtract(new Vector(3, 4));
    assert.equal(result.x, -2);
    assert.equal(result.y, -2);
});

test('Vector.multiply met le vecteur à l’échelle', () => {
    const result = new Vector(1, 2).multiply(2);
    assert.equal(result.x, 2);
    assert.equal(result.y, 4);
});

test('Vector.divide met le vecteur à l’échelle inverse', () => {
    const result = new Vector(1, 2).divide(2);
    assert.equal(result.x, 0.5);
    assert.equal(result.y, 1);
});

test('Vector.divide refuse zéro', () => {
    assert.throws(() => new Vector(1, 2).divide(0), /division par zéro/);
});

test('Vector.length retourne la norme du vecteur', () => {
    assert.equal(new Vector(3, 4).length(), 5);
});
