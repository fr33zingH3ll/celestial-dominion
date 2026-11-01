import { createRng } from '../core/maths/Rng.js';
import { shuffle } from '../modules/Cards.js';
import { roll as rollDie } from '../modules/Dice.js';
import { Prefab } from '../scene/Prefab.js';
import { Scene } from '../scene/Scene.js';
import { ZoneName } from '../scene/Zone.js';

export const Kind = {
    PAWN: 'pion',
    CARD: 'carte',
    DIE: 'dé',
};

const BASE_ZONES = new Set(Object.values(ZoneName));

/**
 * Copie le plateau sans partager les pièces.
 */
export function capture(scene) {
    const pieces = [];
    for (const list of scene.cells.values()) {
        for (const piece of list) {
            pieces.push(serialize(piece));
        }
    }
    for (const zone of scene.zones.values()) {
        for (const piece of zone.pieces) {
            pieces.push(serialize(piece));
        }
    }
    return {
        width: scene.grid.width,
        height: scene.grid.height,
        zones: [...scene.zones.keys()],
        pieces,
    };
}

/**
 * Reconstruit un plateau depuis `capture`.
 */
export function restore(data) {
    const scene = new Scene(data.width, data.height);
    for (const name of data.zones) {
        scene.addZone(name);
    }
    for (const item of data.pieces) {
        const piece = new Prefab(item.name, { ...item.spec }).createPiece(item.id);
        if (item.cell) {
            scene.place(piece, item.cell);
        } else {
            scene.putInZone(piece, item.zone);
        }
    }
    return scene;
}

function serialize(piece) {
    return {
        id: piece.id,
        name: piece.prefab?.name ?? Kind.PAWN,
        spec: {
            kind: piece.prefab?.spec?.kind ?? Kind.PAWN,
            face: piece.prefab?.spec?.face ?? null,
            faces: piece.prefab?.spec?.faces ?? null,
        },
        cell: piece.cell ? { x: piece.cell.x, y: piece.cell.y } : null,
        zone: piece.zone?.name ?? null,
    };
}

/**
 * Document d'édition d'un plateau, de ses cartes, de ses dés et de ses zones.
 * La lecture mémorise l'état et le rend à l'arrêt.
 */
export class BoardDocument {
    constructor({ width = 8, height = 8, seed = 1 } = {}) {
        this.scene = new Scene(width, height);
        this.selection = { type: 'plateau' };
        this.prefabs = [];
        this.history = [];
        this.running = false;
        this.lastRoll = null;
        this.rng = createRng(seed);
        this.#snapshot = null;
    }

    #snapshot;

    tree() {
        const onBoard = [...this.scene.pieces.values()]
            .filter((piece) => piece.cell)
            .sort((a, b) => a.cell.y - b.cell.y || a.cell.x - b.cell.x || String(a.id).localeCompare(String(b.id)));
        return {
            type: 'plateau',
            width: this.scene.grid.width,
            height: this.scene.grid.height,
            children: [
                {
                    type: 'groupe',
                    name: 'Plateau',
                    children: onBoard.map((piece) => this.#node(piece)),
                },
                {
                    type: 'groupe',
                    name: 'Zones',
                    children: [...this.scene.zones.values()].map((zone) => ({
                        type: 'zone',
                        name: zone.name,
                        count: zone.pieces.length,
                        children: zone.pieces.map((piece) => this.#node(piece)),
                    })),
                },
            ],
        };
    }

    inspect() {
        if (this.selection.type === 'zone') {
            const zone = this.scene.zones.get(this.selection.name);
            const top = zone.pieces[zone.pieces.length - 1] ?? null;
            return {
                type: 'zone',
                name: zone.name,
                count: zone.pieces.length,
                top: top ? top.id : null,
                base: BASE_ZONES.has(zone.name),
            };
        }
        if (this.selection.type === 'case') {
            const piece = this.scene.at(this.selection);
            return {
                type: 'case',
                x: this.selection.x,
                y: this.selection.y,
                occupant: piece ? piece.id : null,
            };
        }
        if (this.selection.type === 'piece') {
            const piece = this.#piece(this.selection.id);
            return {
                type: 'piece',
                id: piece.id,
                kind: piece.prefab.spec.kind,
                face: piece.prefab.spec.face,
                faces: piece.prefab.spec.faces,
                cell: piece.cell ? { x: piece.cell.x, y: piece.cell.y } : null,
                zone: piece.zone ? piece.zone.name : null,
            };
        }
        return {
            type: 'plateau',
            width: this.scene.grid.width,
            height: this.scene.grid.height,
            count: this.scene.pieces.size,
        };
    }

    select(target) {
        if (target.type === 'plateau') {
            this.selection = { type: 'plateau' };
            return;
        }
        if (target.type === 'zone') {
            if (!this.scene.zones.has(target.name)) {
                throw new Error('zone inconnue');
            }
            this.selection = { type: 'zone', name: target.name };
            return;
        }
        if (target.type === 'case') {
            if (!this.scene.grid.contains(target)) {
                throw new Error('case hors grille');
            }
            this.selection = { type: 'case', x: target.x, y: target.y };
            return;
        }
        if (target.type === 'piece') {
            this.#piece(target.id);
            this.selection = { type: 'piece', id: target.id };
            return;
        }
        throw new Error('sélection inconnue');
    }

    resize(width, height) {
        this.#change(() => {
            const data = capture(this.scene);
            for (const piece of data.pieces) {
                if (piece.cell && (piece.cell.x >= width || piece.cell.y >= height)) {
                    throw new Error('pièce hors nouvelle grille');
                }
            }
            data.width = width;
            data.height = height;
            this.scene = restore(data);
        });
    }

    addZone(name) {
        this.#change(() => {
            const label = String(name ?? '').trim();
            if (label.length === 0) {
                throw new Error('nom de zone requis');
            }
            if (this.scene.zones.has(label)) {
                throw new Error('zone déjà présente');
            }
            this.scene.addZone(label);
            this.selection = { type: 'zone', name: label };
        });
    }

    removeZone(name) {
        this.#change(() => {
            if (BASE_ZONES.has(name)) {
                throw new Error('zone de base');
            }
            const zone = this.scene.zones.get(name);
            if (!zone) {
                throw new Error('zone inconnue');
            }
            if (zone.pieces.length > 0) {
                throw new Error('zone occupée');
            }
            this.scene.zones.delete(name);
            this.selection = { type: 'plateau' };
        });
    }

    addPawn() {
        this.#change(() => {
            const piece = this.#create(Kind.PAWN, {});
            this.scene.place(piece, this.#targetCell());
            this.selection = { type: 'piece', id: piece.id };
        });
    }

    addCard(face = 'As', zone = null) {
        this.#change(() => {
            const label = String(face ?? '').trim();
            if (label.length === 0) {
                throw new Error('face requise');
            }
            const piece = this.#create(Kind.CARD, { face: label });
            this.scene.putInZone(piece, zone ?? this.#targetZone());
            this.selection = { type: 'piece', id: piece.id };
        });
    }

    addDie(faces = 6) {
        this.#change(() => {
            const count = Number(faces);
            if (!Number.isInteger(count) || count < 2) {
                throw new Error('dé invalide');
            }
            const piece = this.#create(Kind.DIE, { faces: count });
            if (this.selection.type === 'zone') {
                this.scene.putInZone(piece, this.selection.name);
            } else {
                this.scene.place(piece, this.#targetCell());
            }
            this.selection = { type: 'piece', id: piece.id };
        });
    }

    duplicate() {
        this.#change(() => {
            const source = this.#piece(this.selection.id);
            const piece = new Prefab(source.prefab.name, { ...source.prefab.spec }).createPiece(this.#nextId());
            if (source.zone) {
                this.scene.putInZone(piece, source.zone.name);
            } else {
                this.scene.place(piece, this.#nearestFree(source.cell));
            }
            this.selection = { type: 'piece', id: piece.id };
        });
    }

    remove() {
        this.#change(() => {
            const piece = this.#piece(this.selection.id);
            this.scene.take(piece);
            piece.destroy();
            this.selection = { type: 'plateau' };
        });
    }

    moveTo(x, y) {
        this.#change(() => {
            const piece = this.#piece(this.selection.id);
            this.scene.move(piece, { x: Number(x), y: Number(y) });
        });
    }

    moveToZone(name) {
        this.#change(() => {
            const piece = this.#piece(this.selection.id);
            this.scene.moveToZone(piece, name);
        });
    }

    setFace(face) {
        this.#change(() => {
            const piece = this.#piece(this.selection.id);
            if (piece.prefab.spec.kind !== Kind.CARD) {
                throw new Error('carte requise');
            }
            const label = String(face ?? '').trim();
            if (label.length === 0) {
                throw new Error('face requise');
            }
            piece.prefab = new Prefab(piece.prefab.name, { ...piece.prefab.spec, face: label });
        });
    }

    setFaces(faces) {
        this.#change(() => {
            const piece = this.#piece(this.selection.id);
            if (piece.prefab.spec.kind !== Kind.DIE) {
                throw new Error('dé requis');
            }
            const count = Number(faces);
            if (!Number.isInteger(count) || count < 2) {
                throw new Error('dé invalide');
            }
            piece.prefab = new Prefab(piece.prefab.name, { ...piece.prefab.spec, faces: count });
        });
    }

    savePrefab(name) {
        this.#assertEditing();
        const label = String(name ?? '').trim();
        if (label.length === 0) {
            throw new Error('nom de prefab requis');
        }
        if (this.prefabs.some((prefab) => prefab.name === label)) {
            throw new Error('prefab déjà présent');
        }
        const piece = this.#piece(this.selection.id);
        this.prefabs.push(new Prefab(label, { ...piece.prefab.spec }));
    }

    stamp(name) {
        const prefab = this.prefabs.find((item) => item.name === name);
        if (!prefab) {
            throw new Error('prefab absent');
        }
        this.#change(() => {
            const piece = prefab.createPiece(this.#nextId());
            if (prefab.spec.kind === Kind.CARD || this.selection.type === 'zone') {
                const zone = prefab.spec.kind === Kind.CARD ? this.#targetZone() : this.selection.name;
                this.scene.putInZone(piece, zone);
            } else {
                this.scene.place(piece, this.#targetCell());
            }
            this.selection = { type: 'piece', id: piece.id };
        });
    }

    undo() {
        this.#assertEditing();
        const step = this.history.pop();
        if (!step) {
            throw new Error('rien à annuler');
        }
        step();
    }

    play() {
        if (this.running) {
            throw new Error('boucle déjà lancée');
        }
        this.#snapshot = capture(this.scene);
        this.running = true;
        this.lastRoll = null;
    }

    stop() {
        if (!this.running) {
            return;
        }
        this.scene = restore(this.#snapshot);
        this.#snapshot = null;
        this.running = false;
        this.lastRoll = null;
        this.#keepSelection();
    }

    shuffleZone(name = ZoneName.DECK) {
        this.#assertPlaying();
        const zone = this.scene.zones.get(name);
        if (!zone) {
            throw new Error('zone inconnue');
        }
        zone.pieces = shuffle(zone.pieces, this.rng);
    }

    drawTo(from = ZoneName.DECK, to = ZoneName.HAND) {
        this.#assertPlaying();
        const piece = this.scene.draw(from);
        this.scene.putInZone(piece, to);
        this.selection = { type: 'piece', id: piece.id };
    }

    rollSelected() {
        this.#assertPlaying();
        const piece = this.#piece(this.selection.id);
        if (piece.prefab?.spec?.kind !== Kind.DIE) {
            throw new Error('dé requis');
        }
        this.lastRoll = rollDie(piece.prefab.spec.faces, this.rng);
        return this.lastRoll;
    }

    #node(piece) {
        const spec = piece.prefab.spec;
        const where = piece.cell ? `${piece.cell.x},${piece.cell.y}` : piece.zone.name;
        const detail = spec.kind === Kind.CARD ? spec.face : spec.kind === Kind.DIE ? `${spec.faces} faces` : where;
        return {
            type: 'piece',
            id: piece.id,
            kind: spec.kind,
            label: spec.kind === Kind.PAWN ? `${spec.kind} ${piece.id} · ${where}` : `${spec.kind} ${piece.id} · ${detail}`,
        };
    }

    #create(kind, spec) {
        return new Prefab(kind, { kind, face: null, faces: null, ...spec }).createPiece(this.#nextId());
    }

    #nextId() {
        let max = 0;
        for (const id of this.scene.pieces.keys()) {
            const match = /^pièce-(\d+)$/.exec(String(id));
            if (match) {
                max = Math.max(max, Number(match[1]));
            }
        }
        return `pièce-${max + 1}`;
    }

    #piece(id) {
        const piece = this.scene.pieces.get(id);
        if (!piece) {
            throw new Error('pièce absente');
        }
        return piece;
    }

    #targetCell() {
        if (this.selection.type === 'case' && !this.scene.at(this.selection)) {
            return { x: this.selection.x, y: this.selection.y };
        }
        if (this.selection.type === 'piece') {
            const piece = this.#piece(this.selection.id);
            if (piece.cell) {
                const near = this.#nearestFree(piece.cell);
                return near;
            }
        }
        return this.#firstFree();
    }

    #targetZone() {
        if (this.selection.type === 'zone') {
            return this.selection.name;
        }
        if (this.selection.type === 'piece') {
            const piece = this.#piece(this.selection.id);
            if (piece.zone) {
                return piece.zone.name;
            }
        }
        return ZoneName.DECK;
    }

    #firstFree() {
        const { width, height } = this.scene.grid;
        for (let y = 0; y < height; y += 1) {
            for (let x = 0; x < width; x += 1) {
                if (!this.scene.at({ x, y })) {
                    return { x, y };
                }
            }
        }
        throw new Error('grille pleine');
    }

    #nearestFree(origin) {
        const { width, height } = this.scene.grid;
        const reach = Math.max(width, height);
        for (let radius = 1; radius <= reach; radius += 1) {
            for (let y = origin.y - radius; y <= origin.y + radius; y += 1) {
                for (let x = origin.x - radius; x <= origin.x + radius; x += 1) {
                    if (Math.max(Math.abs(x - origin.x), Math.abs(y - origin.y)) !== radius) {
                        continue;
                    }
                    if (this.scene.grid.contains({ x, y }) && !this.scene.at({ x, y })) {
                        return { x, y };
                    }
                }
            }
        }
        throw new Error('grille pleine');
    }

    #change(mutate) {
        this.#assertEditing();
        const before = capture(this.scene);
        const selection = { ...this.selection };
        const previous = this.scene;
        this.scene = restore(before);
        try {
            mutate();
        } catch (error) {
            this.scene = previous;
            this.selection = selection;
            throw error;
        }
        this.history.push(() => {
            this.scene = restore(before);
            this.selection = selection;
        });
    }

    #assertEditing() {
        if (this.running) {
            throw new Error('lecture en cours');
        }
    }

    #assertPlaying() {
        if (!this.running) {
            throw new Error('lecture arrêtée');
        }
    }

    #keepSelection() {
        if (this.selection.type === 'piece' && !this.scene.pieces.has(this.selection.id)) {
            this.selection = { type: 'plateau' };
        }
        if (this.selection.type === 'zone' && !this.scene.zones.has(this.selection.name)) {
            this.selection = { type: 'plateau' };
        }
        if (this.selection.type === 'case' && !this.scene.grid.contains(this.selection)) {
            this.selection = { type: 'plateau' };
        }
    }
}
