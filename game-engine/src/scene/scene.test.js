import test from 'node:test';
import assert from 'node:assert/strict';
import { Cell } from './Cell.js';
import { Piece } from './Piece.js';
import { Prefab } from './Prefab.js';
import { Scene } from './Scene.js';
import { ZoneName } from './Zone.js';

test('une case hors grille et une case prise sont refusées', () => {
    const board = new Scene(8, 8);
    const pawn = new Piece('pion');
    board.place(pawn, new Cell(0, 0));
    assert.equal(board.at({ x: 0, y: 0 }), pawn);
    assert.throws(() => board.place(new Piece('autre'), { x: 0, y: 0 }), /case occupée/);
    assert.throws(() => board.place(new Piece('loin'), { x: 8, y: 0 }), /case hors grille/);
    assert.throws(() => board.place(pawn, { x: 1, y: 0 }), /pièce déjà posée/);
    assert.deepEqual(board.at({ x: 1, y: 0 }), null);
});

test('un déplacement refusé laisse la pièce sur sa case', () => {
    const board = new Scene(8, 8);
    const pawn = new Piece('pion');
    const blocker = new Piece('bloque');
    board.place(pawn, { x: 0, y: 0 });
    board.place(blocker, { x: 1, y: 0 });
    assert.throws(() => board.move(pawn, { x: 1, y: 0 }), /case occupée/);
    assert.equal(board.at({ x: 0, y: 0 }), pawn);
    assert.equal(pawn.cell.x, 0);
    assert.equal(board.at({ x: 1, y: 0 }), blocker);
});

test('déplacer une pièce vide l’ancienne case', () => {
    const board = new Scene(8, 8);
    const pawn = new Piece('pion');
    board.place(pawn, { x: 0, y: 0 });
    board.move(pawn, { x: 2, y: 3 });
    assert.equal(board.at({ x: 0, y: 0 }), null);
    assert.equal(board.at({ x: 2, y: 3 }), pawn);
    assert.deepEqual(pawn.cell, { x: 2, y: 3 });
    assert.equal(pawn.zone, null);
});

test('une pile n’est posée que si l’appelant l’autorise', () => {
    const board = new Scene(2, 2);
    const below = new Piece('dessous');
    const above = new Piece('dessus');
    board.place(below, { x: 0, y: 0 });
    board.place(above, { x: 0, y: 0 }, { stack: true });
    assert.deepEqual(board.piecesAt({ x: 0, y: 0 }).map((piece) => piece.id), ['dessous', 'dessus']);
    assert.equal(board.at({ x: 0, y: 0 }), above);
});

test('la pioche rend le dessus, la main garde l’ordre', () => {
    const board = new Scene(4, 4);
    const first = new Piece('une');
    const second = new Piece('deux');
    board.putInZone(first, ZoneName.DECK);
    board.putInZone(second, ZoneName.DECK);
    assert.equal(board.draw(ZoneName.DECK), second);
    assert.equal(second.zone, null);
    board.moveToZone(first, ZoneName.HAND);
    assert.equal(first.zone.name, ZoneName.HAND);
    assert.deepEqual(board.zones.get(ZoneName.HAND).pieces, [first]);
    assert.equal(board.zones.get(ZoneName.DECK).pieces.length, 0);
    assert.throws(() => board.draw(ZoneName.DECK), /zone vide/);
});

test('une pièce ne reste pas sur une case et dans une zone', () => {
    const board = new Scene(4, 4);
    const pawn = new Piece('pion');
    board.place(pawn, { x: 1, y: 1 });
    board.moveToZone(pawn, ZoneName.DISCARD);
    assert.equal(pawn.cell, null);
    assert.equal(board.at({ x: 1, y: 1 }), null);
    assert.equal(pawn.zone.name, ZoneName.DISCARD);
});

test('le prefab fabrique une pièce et un plateau', () => {
    const pawnPrefab = new Prefab('pion-blanc');
    const piece = pawnPrefab.createPiece('pion-1');
    assert.equal(piece.id, 'pion-1');
    assert.equal(piece.prefab, pawnPrefab);
    const boardPrefab = new Prefab('échiquier', { width: 8, height: 8 });
    const board = boardPrefab.createScene();
    assert.equal(board.grid.width, 8);
    assert.equal(board.grid.height, 8);
    assert.throws(() => new Prefab(''), /nom de prefab requis/);
});

test('destroy retire les pièces du plateau', () => {
    const board = new Scene(3, 3);
    const pawn = new Piece('pion');
    board.place(pawn, { x: 0, y: 0 });
    board.destroy();
    assert.equal(board.at({ x: 0, y: 0 }), null);
    assert.equal(pawn.destroyed, true);
    assert.equal(pawn.cell, null);
});

test('une zone inconnue et une pièce absente sont des erreurs', () => {
    const board = new Scene(3, 3);
    assert.throws(() => board.putInZone(new Piece('pion'), 'banque'), /zone inconnue/);
    assert.throws(() => board.move(new Piece('pion'), { x: 0, y: 0 }), /pièce absente/);
    assert.throws(() => new Cell(1.5, 0), /case invalide/);
});
