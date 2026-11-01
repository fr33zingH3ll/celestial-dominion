import test from 'node:test';
import assert from 'node:assert/strict';
import { BoardDocument, Kind } from './Board.js';
import { ZoneName } from '../scene/Zone.js';

test('un pion, une carte et un dé se posent puis s’annulent', () => {
    const board = new BoardDocument();
    board.addPawn();
    board.addCard('Roi');
    board.addDie(6);
    assert.equal(board.scene.at({ x: 0, y: 0 }).prefab.spec.kind, Kind.PAWN);
    assert.equal(board.scene.zones.get(ZoneName.DECK).pieces[0].prefab.spec.face, 'Roi');
    assert.equal(board.scene.at({ x: 1, y: 0 }).prefab.spec.faces, 6);
    assert.equal(board.inspect().id, 'pièce-3');
    board.undo();
    assert.equal(board.scene.at({ x: 1, y: 0 }), null);
    board.undo();
    board.undo();
    assert.equal(board.scene.pieces.size, 0);
    assert.throws(() => board.undo(), /rien à annuler/);
});

test('une pièce se déplace vers une zone puis revient avec l’annulation', () => {
    const board = new BoardDocument();
    board.addPawn();
    board.moveToZone(ZoneName.HAND);
    assert.equal(board.scene.at({ x: 0, y: 0 }), null);
    assert.equal(board.scene.zones.get(ZoneName.HAND).pieces[0].id, 'pièce-1');
    board.undo();
    assert.equal(board.scene.at({ x: 0, y: 0 }).id, 'pièce-1');
});

test('rétrécir la grille refuse une pièce qui en sortirait', () => {
    const board = new BoardDocument({ width: 4, height: 4 });
    board.addPawn();
    board.moveTo(3, 0);
    assert.throws(() => board.resize(3, 3), /pièce hors nouvelle grille/);
    assert.equal(board.scene.grid.width, 4);
    assert.equal(board.scene.at({ x: 3, y: 0 }).id, 'pièce-1');
    board.resize(4, 2);
    assert.equal(board.scene.grid.height, 2);
});

test('un prefab repose la même face', () => {
    const board = new BoardDocument();
    board.addCard('As');
    board.savePrefab('as');
    board.stamp('as');
    const deck = board.scene.zones.get(ZoneName.DECK).pieces;
    assert.deepEqual(deck.map((piece) => piece.prefab.spec.face), ['As', 'As']);
    assert.throws(() => board.savePrefab('as'), /prefab déjà présent/);
    assert.throws(() => board.stamp('absent'), /prefab absent/);
});

test('une zone ajoutée reçoit une carte et une zone de base reste', () => {
    const board = new BoardDocument();
    board.addZone('joueur 2');
    board.addCard('Dame');
    assert.equal(board.scene.zones.get('joueur 2').pieces[0].prefab.spec.face, 'Dame');
    assert.throws(() => board.removeZone('joueur 2'), /zone occupée/);
    board.remove();
    board.removeZone('joueur 2');
    assert.equal(board.scene.zones.has('joueur 2'), false);
    assert.throws(() => board.removeZone(ZoneName.DECK), /zone de base/);
});

test('la lecture mélange, pioche et lance, puis rend le plateau', () => {
    const first = new BoardDocument({ seed: 3 });
    first.addCard('As');
    first.addCard('Roi');
    first.select({ type: 'plateau' });
    first.addDie(6);
    first.play();
    assert.throws(() => first.addPawn(), /lecture en cours/);
    first.shuffleZone(ZoneName.DECK);
    first.drawTo(ZoneName.DECK, ZoneName.HAND);
    const drawn = first.scene.zones.get(ZoneName.HAND).pieces[0].prefab.spec.face;
    first.select({ type: 'piece', id: 'pièce-3' });
    const value = first.rollSelected();
    assert.equal(value >= 1 && value <= 6, true);

    const second = new BoardDocument({ seed: 3 });
    second.addCard('As');
    second.addCard('Roi');
    second.select({ type: 'plateau' });
    second.addDie(6);
    second.play();
    second.shuffleZone(ZoneName.DECK);
    second.drawTo(ZoneName.DECK, ZoneName.HAND);
    assert.equal(second.scene.zones.get(ZoneName.HAND).pieces[0].prefab.spec.face, drawn);
    second.select({ type: 'piece', id: 'pièce-3' });
    assert.equal(second.rollSelected(), value);

    first.stop();
    assert.equal(first.running, false);
    assert.equal(first.lastRoll, null);
    assert.equal(first.scene.zones.get(ZoneName.HAND).pieces.length, 0);
    assert.equal(first.scene.zones.get(ZoneName.DECK).pieces.length, 2);
    assert.equal(first.scene.at({ x: 0, y: 0 }).prefab.spec.kind, Kind.DIE);
    assert.throws(() => first.rollSelected(), /lecture arrêtée/);
});

test('l’arbre et l’inspecteur décrivent la sélection', () => {
    const board = new BoardDocument({ width: 3, height: 2 });
    board.addPawn();
    board.select({ type: 'case', x: 2, y: 1 });
    assert.equal(board.inspect().occupant, null);
    const tree = board.tree();
    assert.equal(tree.width, 3);
    assert.equal(tree.children[0].children[0].id, 'pièce-1');
    assert.equal(tree.children[1].children.length, 4);
    assert.throws(() => board.select({ type: 'case', x: 9, y: 0 }), /case hors grille/);
    assert.throws(() => board.select({ type: 'piece', id: 'absent' }), /pièce absente/);
});
