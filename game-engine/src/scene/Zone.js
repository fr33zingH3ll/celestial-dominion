export const ZoneName = {
    HAND: 'main',
    DECK: 'pioche',
    DISCARD: 'défausse',
    MARKET: 'marché',
};

/**
 * Liste ordonnée hors de la grille. L'index 0 est le dessous, le dernier est le dessus.
 */
export class Zone {
    constructor(name) {
        if (typeof name !== 'string' || name.length === 0) {
            throw new Error('nom de zone requis');
        }
        this.name = name;
        this.pieces = [];
    }
}
