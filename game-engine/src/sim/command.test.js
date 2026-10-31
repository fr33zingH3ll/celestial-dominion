import test from 'node:test';
import assert from 'node:assert/strict';
import { applyPlayerCommand } from './command.js';

test('une intention nulle arrête le vaisseau', () => {
    const calls = [];
    const entity = {
        body: { id: 'body' },
        move(vector) { calls.push(['move', vector]); },
        dirty: false,
    };
    const bodyApi = {
        setVelocity(body, velocity) { calls.push(['velocity', body.id, velocity]); },
        setAngle(body, angle) { calls.push(['angle', body.id, angle]); },
    };

    applyPlayerCommand(bodyApi, entity, { move: { x: 0, y: 0 }, rotation: 1.25 });

    assert.deepEqual(calls[0], ['velocity', 'body', { x: 0, y: 0 }]);
    assert.deepEqual(calls[1], ['angle', 'body', 1.25]);
    assert.equal(entity.dirty, true);
    assert.equal(calls.some((call) => call[0] === 'move'), false);
});

test('une intention non nulle pousse sans remettre la vitesse à zéro', () => {
    const calls = [];
    const move = { x: 1, y: 0 };
    const entity = {
        body: { id: 'body' },
        move(vector) { calls.push(vector); },
        dirty: false,
    };

    applyPlayerCommand({
        setVelocity() { calls.push('velocity'); },
        setAngle() {},
    }, entity, { move, rotation: Number.NaN });

    assert.deepEqual(calls, [move]);
});
