import test from 'node:test';
import assert from 'node:assert/strict';
import { Target, matchesTarget } from './Target.js';

const blanc = { id: 'a', side: 'blanc' };
const allie = { id: 'b', side: 'blanc' };
const noir = { id: 'c', side: 'noir' };
const neutre = { id: 'd', side: 'neutral' };

test('les cibles distinguent soi, allié, opposant et neutre', () => {
    assert.equal(matchesTarget(Target.ALL, blanc, noir), true);
    assert.equal(matchesTarget(Target.SELF, blanc, blanc), true);
    assert.equal(matchesTarget(Target.SELF, blanc, allie), false);
    assert.equal(matchesTarget(Target.ALLY, blanc, allie), true);
    assert.equal(matchesTarget(Target.ALLY, blanc, blanc), false);
    assert.equal(matchesTarget(Target.OPPONENT, blanc, noir), true);
    assert.equal(matchesTarget(Target.OPPONENT, blanc, allie), false);
    assert.equal(matchesTarget(Target.NEUTRAL, blanc, neutre), true);
});

test('une cible inconnue est refusée', () => {
    assert.throws(() => matchesTarget('mur', blanc, noir), /cible inconnue/);
});
