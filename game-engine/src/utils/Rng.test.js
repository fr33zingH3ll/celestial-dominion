import test from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from './Rng.js';

test('createRng redonne la même suite pour la même graine', () => {
    const first = createRng(0xC0FFEE);
    const second = createRng(0xC0FFEE);
    const fromFirst = [first(), first(), first()];
    const fromSecond = [second(), second(), second()];
    assert.deepEqual(fromFirst, fromSecond);
    assert.ok(fromFirst.every((value) => value >= 0 && value < 1));
});

test('deux graines différentes divergent', () => {
    const left = createRng(1)();
    const right = createRng(2)();
    assert.notEqual(left, right);
});
