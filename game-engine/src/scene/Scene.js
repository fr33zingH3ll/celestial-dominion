import { Grid } from '../core/maths/Grid.js';
import { Piece } from './Piece.js';
import { Zone, ZoneName } from './Zone.js';

/**
 * État du plateau. Elle dit ce qui est où et exécute pose, déplacement et retrait.
 * La légalité d'un coup reste dans runtime/Rules.
 * Une pièce n'est qu'à un endroit. Une case déjà prise est refusée, sauf si l'appelant autorise la pile.
 */
export class Scene {
    constructor(width, height) {
        this.grid = new Grid(width, height);
        this.pieces = new Map();
        this.cells = new Map();
        this.zones = new Map();
        for (const name of Object.values(ZoneName)) {
            this.zones.set(name, new Zone(name));
        }
    }

    addZone(name) {
        if (this.zones.has(name)) {
            return this.zones.get(name);
        }
        const zone = new Zone(name);
        this.zones.set(name, zone);
        return zone;
    }

    at(cell) {
        this.#assertCell(cell);
        const list = this.cells.get(this.grid.key(cell));
        if (!list || list.length === 0) {
            return null;
        }
        return list[list.length - 1];
    }

    piecesAt(cell) {
        this.#assertCell(cell);
        const list = this.cells.get(this.grid.key(cell)) ?? [];
        return list.slice();
    }

    place(piece, cell, options = {}) {
        this.#assertFree(piece);
        this.#assertCell(cell);
        this.#assertRoom(cell, options.stack === true);
        this.#own(piece);
        this.#attachCell(piece, cell);
    }

    putInZone(piece, name) {
        this.#assertFree(piece);
        const zone = this.#requireZone(name);
        this.#own(piece);
        this.#attachZone(piece, zone);
    }

    move(piece, cell, options = {}) {
        this.#assertPresent(piece);
        this.#assertCell(cell);
        if (piece.cell && piece.cell.x === cell.x && piece.cell.y === cell.y) {
            return;
        }
        this.#assertRoom(cell, options.stack === true);
        this.#detach(piece);
        this.#attachCell(piece, cell);
    }

    moveToZone(piece, name) {
        this.#assertPresent(piece);
        const zone = this.#requireZone(name);
        if (piece.zone === zone) {
            return;
        }
        this.#detach(piece);
        this.#attachZone(piece, zone);
    }

    take(piece) {
        this.#assertPresent(piece);
        this.#detach(piece);
        this.pieces.delete(piece.id);
        return piece;
    }

    draw(name) {
        const zone = this.#requireZone(name);
        const piece = zone.pieces[zone.pieces.length - 1];
        if (!piece) {
            throw new Error('zone vide');
        }
        return this.take(piece);
    }

    destroy() {
        for (const piece of [...this.pieces.values()]) {
            this.take(piece);
            piece.destroy();
        }
    }

    #assertCell(cell) {
        if (!this.grid.contains(cell)) {
            throw new Error('case hors grille');
        }
    }

    #assertFree(piece) {
        if (!(piece instanceof Piece) || this.pieces.has(piece.id) || piece.cell || piece.zone) {
            throw new Error('pièce déjà posée');
        }
    }

    #assertPresent(piece) {
        if (!(piece instanceof Piece) || !this.pieces.has(piece.id)) {
            throw new Error('pièce absente');
        }
    }

    #assertRoom(cell, stack) {
        const list = this.cells.get(this.grid.key(cell));
        if (!stack && list && list.length > 0) {
            throw new Error('case occupée');
        }
    }

    #requireZone(name) {
        const zone = this.zones.get(name);
        if (!zone) {
            throw new Error('zone inconnue');
        }
        return zone;
    }

    #own(piece) {
        this.pieces.set(piece.id, piece);
    }

    #attachCell(piece, cell) {
        const key = this.grid.key(cell);
        const list = this.cells.get(key) ?? [];
        list.push(piece);
        this.cells.set(key, list);
        piece.cell = { x: cell.x, y: cell.y };
        piece.zone = null;
    }

    #attachZone(piece, zone) {
        zone.pieces.push(piece);
        piece.zone = zone;
        piece.cell = null;
    }

    #detach(piece) {
        if (piece.cell) {
            const key = this.grid.key(piece.cell);
            const list = (this.cells.get(key) ?? []).filter((item) => item !== piece);
            if (list.length === 0) {
                this.cells.delete(key);
            } else {
                this.cells.set(key, list);
            }
            piece.cell = null;
        }
        if (piece.zone) {
            piece.zone.pieces = piece.zone.pieces.filter((item) => item !== piece);
            piece.zone = null;
        }
    }
}
