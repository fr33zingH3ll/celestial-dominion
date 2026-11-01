import test from 'node:test';
import assert from 'node:assert/strict';
import { AudioCue } from './AudioCue.js';
import { pick } from './Input.js';
import { RenderQueue } from './RenderQueue.js';
import { Rule } from './Rule.js';
import { Rules } from './Rules.js';
import { Turn } from './Turn.js';

test('seul le joueur du tour déplace une pièce, puis l’affichage est demandé à part', () => {
    const turn = new Turn(['blanc', 'noir']);
    const rules = new Rules();
    rules.add(new Rule({
        name: 'tour du joueur',
        priority: 1,
        legal: (state, move) => move.actor.id === turn.player && state.pieces[move.pieceId].owner === move.actor.id,
        apply: () => null,
        undo: () => {},
    }));
    rules.add(new Rule({
        name: 'poser',
        priority: 0,
        legal: (state, move) => move.to.x >= 0 && move.to.x < 8 && move.to.y >= 0 && move.to.y < 8,
        apply: (state, move) => {
            const piece = state.pieces[move.pieceId];
            const from = { x: piece.x, y: piece.y };
            piece.x = move.to.x;
            piece.y = move.to.y;
            return { pieceId: move.pieceId, from };
        },
        undo: (state, effect) => {
            const piece = state.pieces[effect.pieceId];
            piece.x = effect.from.x;
            piece.y = effect.from.y;
        },
    }));

    const state = { pieces: { pion: { id: 'pion', owner: 'blanc', x: 0, y: 0 } } };
    const display = new RenderQueue();
    const audio = new AudioCue();
    const chosen = pick({ x: 0, y: 0 }, {
        pieces: [state.pieces.pion],
        cells: [{ x: 0, y: 0 }, { x: 1, y: 0 }],
    });
    assert.equal(chosen.kind, 'piece');

    assert.throws(
        () => rules.apply(state, {
            actor: { id: 'noir' },
            pieceId: 'pion',
            to: { x: 1, y: 0 },
        }),
        /coup illégal/,
    );
    assert.equal(state.pieces.pion.x, 0);

    rules.apply(state, {
        actor: { id: 'blanc' },
        pieceId: 'pion',
        to: { x: 1, y: 0 },
    });
    display.push({ type: 'move', id: 'pion', to: { x: 1, y: 0 } });
    audio.play('pose');
    turn.endTurn();

    assert.equal(state.pieces.pion.x, 1);
    assert.equal(turn.player, 'noir');
    assert.equal(display.drain()[0].type, 'move');
    assert.equal(audio.drain()[0].id, 'pose');
});
