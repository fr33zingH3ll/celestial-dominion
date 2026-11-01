import test from 'node:test';
import assert from 'node:assert/strict';
import { AssetCache } from './assets/AssetCache.js';
import { Event } from './events/Event.js';
import { EventDispatcher } from './events/EventDispatcher.js';
import { Grid, manhattan } from './maths/Grid.js';
import { Interpolation } from './maths/Interpolation.js';
import { GameObject } from './objects/GameObject.js';

test('un coup de plateau relie pièce, case, distance et annulation', () => {
    const board = new Grid(8, 8);
    const piece = new GameObject('pion-blanc');
    const cache = new AssetCache();
    cache.set(piece.id, { frame: 'pion-blanc' });
    const from = { x: 0, y: 0 };
    const to = { x: 0, y: 2 };
    assert.equal(board.contains(from) && board.contains(to), true);
    assert.equal(manhattan(from, to), 2);
    assert.equal(cache.get(piece.id).frame, 'pion-blanc');

    const slide = new Interpolation(from.y, to.y, 200);
    assert.equal(slide.at(200), to.y);

    const dispatcher = new EventDispatcher();
    let applied = false;
    dispatcher.addEventListener('coup', (event) => {
        event.setCancelled(true);
    });
    dispatcher.addEventListener('coup', () => {
        applied = true;
    });
    dispatcher.dispatchEvent(new Event('coup', { piece: piece.id, to }));
    assert.equal(applied, false);
    assert.equal(piece.destroyed, false);
});
