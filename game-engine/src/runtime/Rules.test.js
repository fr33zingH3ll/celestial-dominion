import test from 'node:test';
import assert from 'node:assert/strict';
import { Rule } from './Rule.js';
import { Rules } from './Rules.js';
import { Target } from './Target.js';

function movePiece(name, priority = 0) {
    return new Rule({
        name,
        priority,
        legal: (state, move) => {
            const piece = state.pieces[move.pieceId];
            return Boolean(piece)
                && move.to.x >= 0 && move.to.y >= 0
                && move.to.x < 8 && move.to.y < 8;
        },
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
    });
}

test('un coup illégal laisse l’état intact', () => {
    const rules = new Rules();
    rules.add(movePiece('déplacement'));
    const state = { pieces: { pion: { x: 0, y: 0 } } };
    assert.throws(
        () => rules.apply(state, { pieceId: 'pion', to: { x: -1, y: 0 } }),
        /coup illégal/,
    );
    assert.deepEqual(state.pieces.pion, { x: 0, y: 0 });
});

test('apply puis undo ramène la pièce', () => {
    const rules = new Rules();
    rules.add(movePiece('déplacement'));
    const state = { pieces: { pion: { x: 0, y: 0 } } };
    const effects = rules.apply(state, { pieceId: 'pion', to: { x: 1, y: 0 } });
    assert.deepEqual(state.pieces.pion, { x: 1, y: 0 });
    rules.undo(state, effects);
    assert.deepEqual(state.pieces.pion, { x: 0, y: 0 });
});

test('un échec pendant l’application annule les effets déjà posés', () => {
    const rules = new Rules();
    rules.add(movePiece('déplacement', 1));
    rules.add(new Rule({
        name: 'casse',
        priority: 0,
        legal: () => true,
        apply: () => {
            throw new Error('échec');
        },
        undo: () => {},
    }));
    const state = { pieces: { pion: { x: 0, y: 0 } } };
    assert.throws(
        () => rules.apply(state, { pieceId: 'pion', to: { x: 1, y: 0 } }),
        /échec/,
    );
    assert.deepEqual(state.pieces.pion, { x: 0, y: 0 });
});

test('une règle désactivée ou hors cible ne bloque pas', () => {
    const rules = new Rules();
    rules.add(new Rule({
        name: 'hors cible',
        target: Target.OPPONENT,
        legal: () => false,
        apply: () => {
            throw new Error('ne doit pas s’appliquer');
        },
        undo: () => {},
    }));
    rules.add(new Rule({
        name: 'éteinte',
        enabled: false,
        legal: () => false,
        apply: () => {
            throw new Error('ne doit pas s’appliquer');
        },
        undo: () => {},
    }));
    const state = { mark: 0 };
    const effects = rules.apply(state, {
        actor: { id: 'a', side: 'blanc' },
        subject: { id: 'a', side: 'blanc' },
    });
    assert.deepEqual(effects, []);
    assert.equal(state.mark, 0);
});

test('une règle sans nom ou sans fonctions est refusée', () => {
    assert.throws(() => new Rule({ name: '', legal() {}, apply() {}, undo() {} }), /nom de règle requis/);
    assert.throws(() => new Rule({ name: 'incomplète', legal() {} }), /règle incomplète/);
});

test('remove retire la règle ajoutée', () => {
    const rules = new Rules();
    const rule = new Rule({
        name: 'temporaire',
        legal: () => true,
        apply: () => null,
        undo: () => {},
    });
    rules.add(rule);
    rules.remove(rule);
    assert.deepEqual(rules.list(), []);
    assert.throws(() => rules.remove(rule), /règle absente/);
});
