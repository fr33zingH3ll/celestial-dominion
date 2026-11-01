/**
 * Coordonnées de case, entières, origine en haut à gauche.
 * Les distances sont discrètes : Manhattan pour un pas orthogonal, Tchebychev pour un pas en diagonale.
 */
export function manhattan(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function chebyshev(a, b) {
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

export class Grid {
    constructor(width, height) {
        if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
            throw new Error('dimensions de grille invalides');
        }
        this.width = width;
        this.height = height;
    }

    contains(cell) {
        return Number.isInteger(cell.x)
            && Number.isInteger(cell.y)
            && cell.x >= 0
            && cell.y >= 0
            && cell.x < this.width
            && cell.y < this.height;
    }

    key(cell) {
        return `${cell.x},${cell.y}`;
    }
}
