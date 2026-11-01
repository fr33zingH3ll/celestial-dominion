import test from 'node:test';
import assert from 'node:assert/strict';
import { Container } from 'pixi.js';
import { Piece } from '../scene/Piece.js';
import { Scene } from '../scene/Scene.js';
import { ZoneName } from '../scene/Zone.js';
import { RenderQueue } from '../runtime/RenderQueue.js';
import { CELL_SIZE, PixiRenderer, createPixiApplication } from './PixiRenderer.js';

function rendererFor(queue = new RenderQueue()) {
    const stage = new Container();
    const view = new PixiRenderer({ application: { stage }, queue });
    return { stage, queue, view };
}

test('le plateau et les pièces posées sont affichés', () => {
    const board = new Scene(2, 2);
    const pawn = new Piece('pion');
    const hidden = new Piece('main');
    board.place(pawn, { x: 1, y: 0 });
    board.putInZone(hidden, ZoneName.HAND);
    const { stage, view } = rendererFor();
    view.show(board);
    assert.equal(stage.children.length, 5);
    const piece = stage.children.find((child) => child.kind === 'piece');
    assert.equal(piece.x, CELL_SIZE);
    assert.equal(piece.y, 0);
    view.show(board);
    assert.equal(stage.children.length, 5);
});

test('une commande déplace l\'affichage et laisse la pièce en place', () => {
    const board = new Scene(4, 4);
    const pawn = new Piece('pion');
    board.place(pawn, { x: 0, y: 0 });
    const queue = new RenderQueue();
    queue.push({ type: 'move', id: 'pion', to: { x: 2, y: 1 } });
    const { view } = rendererFor(queue);
    view.show(board);
    const piece = view.nodes.get('piece:pion');
    assert.equal(piece.x, 2 * CELL_SIZE);
    assert.equal(piece.y, CELL_SIZE);
    assert.deepEqual(pawn.cell, { x: 0, y: 0 });
    assert.equal(queue.drain().length, 0);
    view.show(board);
    assert.equal(piece.x, 0);
    assert.equal(piece.y, 0);
});

test('une commande inconnue ou une pièce hors plateau est refusée', () => {
    const board = new Scene(2, 2);
    const pawn = new Piece('pion');
    board.putInZone(pawn, ZoneName.DECK);
    const queue = new RenderQueue();
    queue.push({ type: 'saut', id: 'pion', to: { x: 1, y: 1 } });
    const { view } = rendererFor(queue);
    assert.throws(() => view.show(board), /commande inconnue/);
    queue.push({ type: 'move', id: 'pion', to: { x: 1, y: 0 } });
    assert.throws(() => view.show(board), /pièce absente de l'affichage/);
    assert.equal(pawn.zone.name, ZoneName.DECK);
});

test('une application ou une file manquante est refusée', () => {
    const queue = new RenderQueue();
    assert.throws(() => new PixiRenderer({ queue }), /application Pixi requise/);
    assert.throws(() => new PixiRenderer({ application: { stage: new Container() } }), /file d'affichage requise/);
});

test('createPixiApplication appelle Pixi', () => {
    assert.throws(() => createPixiApplication({ width: 64, height: 64 }), /suitable renderer/);
});
