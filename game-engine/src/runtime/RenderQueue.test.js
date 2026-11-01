import test from 'node:test';
import assert from 'node:assert/strict';
import { RenderQueue } from './RenderQueue.js';

test('drain vide la file d’affichage', () => {
    const queue = new RenderQueue();
    queue.push({ type: 'move', id: 'pion', to: { x: 1, y: 0 } });
    assert.deepEqual(queue.drain(), [{ type: 'move', id: 'pion', to: { x: 1, y: 0 } }]);
    assert.deepEqual(queue.drain(), []);
});

test('une commande sans type est refusée', () => {
    assert.throws(() => new RenderQueue().push({}), /commande d'affichage requise/);
});
