import test from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../core/maths/Rng.js';
import { Rules } from '../runtime/Rules.js';
import { Card, CardsModule, shuffle } from './Cards.js';
import { DiceModule, roll } from './Dice.js';
import { Module } from './Module.js';
import { Modules } from './Modules.js';

test('le mélange est déterministe et ne modifie pas le paquet', () => {
    const deck = ['as', 'roi', 'dame', 'valet', 'dix'].map((face, index) => new Card(index + 1, face));
    const first = shuffle(deck, createRng(1)).map((card) => card.face);
    const second = shuffle(deck, createRng(1)).map((card) => card.face);
    assert.deepEqual(first, second);
    assert.deepEqual(deck.map((card) => card.face), ['as', 'roi', 'dame', 'valet', 'dix']);
    assert.deepEqual([...first].sort(), ['as', 'dame', 'dix', 'roi', 'valet']);
});

test('un dé reste entre 1 et son nombre de faces', () => {
    const rng = createRng(4);
    const values = Array.from({ length: 30 }, () => roll(6, rng));
    assert.ok(values.every((value) => value >= 1 && value <= 6));
    const again = createRng(4);
    const repeated = Array.from({ length: 30 }, () => roll(6, again));
    assert.deepEqual(repeated, values);
});

test('charger puis décharger retire les règles des cartes et des dés', () => {
    const modules = new Modules();
    const rules = new Rules();
    const context = { rules };
    const cards = new CardsModule();
    const dice = new DiceModule(7);
    modules.load(cards, context);
    modules.load(dice, context);
    assert.equal(modules.has('cartes'), true);
    assert.equal(modules.has('dés'), true);
    assert.equal(rules.list().length, 2);

    const state = {
        hands: { blanc: [new Card('as', 'as'), new Card('roi', 'roi')] },
    };
    const effects = rules.apply(state, { type: 'jouer-carte', playerId: 'blanc', cardId: 'as' });
    assert.deepEqual(state.hands.blanc.map((card) => card.id), ['roi']);
    assert.equal(state.table[0].id, 'as');
    rules.undo(state, effects);
    assert.deepEqual(state.hands.blanc.map((card) => card.id), ['roi', 'as']);
    assert.equal(state.table.length, 0);

    assert.throws(
        () => rules.apply(state, { type: 'jouer-carte', playerId: 'blanc', cardId: 'absente' }),
        /coup illégal/,
    );
    rules.apply(state, { type: 'lancer-dé', faces: 6 });
    const rolled = state.lastRoll;
    assert.equal(rolled >= 1 && rolled <= 6, true);

    modules.unload('cartes', context);
    modules.unload('dés', context);
    assert.equal(rules.list().length, 0);
    assert.equal(context.dice, undefined);
    assert.equal(modules.has('cartes'), false);
});

test('un second chargement et un module inconnu sont refusés', () => {
    const modules = new Modules();
    const context = { rules: new Rules() };
    modules.load(new CardsModule(), context);
    assert.throws(() => modules.load(new CardsModule(), context), /module déjà chargé/);
    assert.throws(() => modules.unload('dés', context), /module absent/);
    assert.throws(() => modules.load(new Module('vide'), context), /chargement non implémenté/);
    assert.equal(modules.has('vide'), false);
});

test('une carte sans face et un dé trop petit sont refusés', () => {
    assert.throws(() => new Card('as', ''), /face requise/);
    assert.throws(() => roll(1, createRng(1)), /dé invalide/);
    assert.throws(() => new DiceModule(1.5), /graine requise/);
});
