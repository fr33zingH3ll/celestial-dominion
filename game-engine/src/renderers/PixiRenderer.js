import { Application, Container } from 'pixi.js';

export const CELL_SIZE = 64;

/**
 * Affiche le plateau et joue la file de commandes.
 * Une commande déplace un nœud visuel. Elle ne déplace pas la pièce dans la scène.
 */
export class PixiRenderer {
    constructor({ application, queue } = {}) {
        if (!application?.stage || typeof application.stage.addChild !== 'function') {
            throw new Error('application Pixi requise');
        }
        if (!queue || typeof queue.drain !== 'function') {
            throw new Error('file d\'affichage requise');
        }
        this.application = application;
        this.queue = queue;
        this.nodes = new Map();
    }

    show(scene) {
        this.#drawBoard(scene);
        for (const command of this.queue.drain()) {
            this.#apply(command);
        }
    }

    #drawBoard(scene) {
        for (let y = 0; y < scene.grid.height; y += 1) {
            for (let x = 0; x < scene.grid.width; x += 1) {
                const node = this.#node(`cell:${x},${y}`, 'cell');
                node.x = x * CELL_SIZE;
                node.y = y * CELL_SIZE;
            }
        }
        for (const piece of scene.pieces.values()) {
            const key = `piece:${piece.id}`;
            if (!piece.cell) {
                this.#remove(key);
                continue;
            }
            const node = this.#node(key, 'piece');
            node.x = piece.cell.x * CELL_SIZE;
            node.y = piece.cell.y * CELL_SIZE;
        }
    }

    #apply(command) {
        if (command.type !== 'move') {
            throw new Error('commande inconnue');
        }
        const node = this.nodes.get(`piece:${command.id}`);
        if (!node) {
            throw new Error('pièce absente de l\'affichage');
        }
        node.x = command.to.x * CELL_SIZE;
        node.y = command.to.y * CELL_SIZE;
    }

    #node(key, kind) {
        const existing = this.nodes.get(key);
        if (existing) {
            return existing;
        }
        const node = new Container();
        node.kind = kind;
        this.application.stage.addChild(node);
        this.nodes.set(key, node);
        return node;
    }

    #remove(key) {
        const node = this.nodes.get(key);
        if (!node) {
            return;
        }
        this.application.stage.removeChild(node);
        this.nodes.delete(key);
    }
}

export function createPixiApplication(options = {}) {
    return new Application({
        width: options.width ?? CELL_SIZE * 8,
        height: options.height ?? CELL_SIZE * 8,
        backgroundColor: options.backgroundColor ?? 0x1b1b1b,
    });
}
