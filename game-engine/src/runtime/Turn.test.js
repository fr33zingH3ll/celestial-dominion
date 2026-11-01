import test from 'node:test';
import assert from 'node:assert/strict';
import { Turn } from './Turn.js';

test('les phases avancent puis le tour passe au joueur suivant', () => {
    const turn = new Turn(['blanc', 'noir'], ['pioche', 'pose']);
    assert.equal(turn.player, 'blanc');
    assert.equal(turn.phase, 'pioche');
    turn.nextPhase();
    assert.equal(turn.phase, 'pose');
    turn.nextPhase();
    assert.equal(turn.player, 'noir');
    assert.equal(turn.phase, 'pioche');
    turn.endTurn();
    assert.equal(turn.player, 'blanc');
});

test('une partie finie n’accepte plus de tour', () => {
    const turn = new Turn(['blanc']);
    turn.finish();
    assert.throws(() => turn.nextPhase(), /partie terminée/);
    assert.throws(() => turn.endTurn(), /partie terminée/);
});

test('joueurs ou phases vides sont refusés', () => {
    assert.throws(() => new Turn([]), /joueurs requis/);
    assert.throws(() => new Turn(['blanc'], []), /phases requises/);
});
