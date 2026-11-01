/**
 * Case du plateau. Coordonnées entières, pas une scène et pas une grille.
 */
export class Cell {
    constructor(x, y) {
        if (!Number.isInteger(x) || !Number.isInteger(y)) {
            throw new Error('case invalide');
        }
        this.x = x;
        this.y = y;
    }
}
