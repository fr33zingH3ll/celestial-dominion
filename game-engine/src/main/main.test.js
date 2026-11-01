import test from 'node:test';
import assert from 'node:assert/strict';
import { bootstrap } from './Bootstrap.js';
import { Loop } from './Loop.js';

function fakeFrames() {
    let step = null;
    return {
        frames: {
            start(callback) { step = callback; },
            stop() { step = null; },
        },
        tick() { step(); },
    };
}

function harness() {
    const shown = [];
    const sent = [];
    const scene = { name: 'plateau' };
    const state = { played: 0 };
    const rules = {
        isLegal(_state, move) { return move.type === 'poser'; },
        apply(current) { current.played += 1; },
    };
    const { frames, tick } = fakeFrames();
    const game = bootstrap({
        scene,
        rules,
        state,
        renderer: { show(board) { shown.push(board); } },
        frames,
        channel: { send(data) { sent.push(data); } },
    });
    return { game, shown, sent, tick, state };
}

test('un coup illégal n’est ni appliqué ni envoyé', () => {
    const { game, state } = harness();
    assert.throws(() => game.play({ type: 'triche' }), /coup illégal/);
    assert.equal(state.played, 0);
});

test('une image affiche le plateau et envoie le coup', () => {
    const { game, shown, sent, tick, state } = harness();
    game.play({ type: 'poser', piece: 'pion' });
    game.loop.start();
    tick();
    assert.equal(state.played, 1);
    assert.equal(shown[0].name, 'plateau');
    assert.deepEqual(JSON.parse(sent[0]), { type: 'poser', piece: 'pion' });
    assert.throws(() => game.loop.start(), /boucle déjà lancée/);
    game.loop.stop();
});

test('un envoi raté garde le coup pour l’image suivante', () => {
    const scene = { name: 'plateau' };
    const outgoing = [];
    let fail = true;
    const sent = [];
    const { frames, tick } = fakeFrames();
    const loop = new Loop({
        frames,
        renderer: { show() {} },
        scene,
        channel: {
            send(data) {
                if (fail) {
                    throw new Error('socket fermé');
                }
                sent.push(data);
            },
        },
        outgoing,
    });
    outgoing.push({ type: 'poser' });
    loop.start();
    assert.throws(() => tick(), /socket fermé/);
    assert.equal(outgoing.length, 1);
    fail = false;
    tick();
    assert.equal(outgoing.length, 0);
    assert.equal(JSON.parse(sent[0]).type, 'poser');
});

test('un bootstrap incomplet est refusé', () => {
    assert.throws(() => bootstrap({ scene: {} }), /bootstrap incomplet/);
    assert.throws(() => new Loop({}), /boucle incomplète/);
});
