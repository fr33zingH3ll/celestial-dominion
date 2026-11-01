import test from 'node:test';
import assert from 'node:assert/strict';
import { AssetCache } from './AssetCache.js';

test('get rend la même référence', () => {
    const cache = new AssetCache();
    const texture = { name: 'pion' };
    cache.set('pion', texture);
    assert.equal(cache.get('pion'), texture);
    assert.equal(cache.has('pion'), true);
});

test('une clé inconnue est une erreur', () => {
    assert.throws(() => new AssetCache().get('manquant'), /asset absent: manquant/);
});

test('delete retire la référence', () => {
    const cache = new AssetCache();
    cache.set('pion', { name: 'pion' });
    assert.equal(cache.delete('pion'), true);
    assert.equal(cache.has('pion'), false);
});

test('une clé vide est refusée', () => {
    assert.throws(() => new AssetCache().set('', {}), /clé requise/);
});
