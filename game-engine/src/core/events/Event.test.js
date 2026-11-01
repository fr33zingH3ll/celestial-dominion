import test from 'node:test';
import assert from 'node:assert/strict';
import { Event } from './Event.js';
import { EventDispatcher } from './EventDispatcher.js';

test('un événement annulé arrête les écouteurs suivants', () => {
    const dispatcher = new EventDispatcher();
    const seen = [];
    dispatcher.addEventListener('coup', (event) => {
        seen.push('premier');
        event.setCancelled(true);
    });
    dispatcher.addEventListener('coup', () => {
        seen.push('second');
    });
    dispatcher.dispatchEvent(new Event('coup', { from: 'a1', to: 'a2' }));
    assert.deepEqual(seen, ['premier']);
});

test('retirer un écouteur l’empêche d’être appelé', () => {
    const dispatcher = new EventDispatcher();
    let calls = 0;
    const listener = () => {
        calls += 1;
    };
    dispatcher.addEventListener('coup', listener);
    dispatcher.removeEventListener('coup', listener);
    dispatcher.dispatchEvent(new Event('coup', null));
    assert.equal(calls, 0);
});

test('un événement non annulable refuse l’annulation', () => {
    const event = new Event('info', null);
    event.setCancelable(false);
    assert.throws(() => event.setCancelled(true), /not cancelable/);
});
