/**
 * Le pointer vise une case. Une pièce sur cette case est choisie avant la case.
 * Les coordonnées sont des indices de case.
 */
export function pick(pointer, { pieces = [], cells = [] } = {}) {
    if (!pointer || !Number.isInteger(pointer.x) || !Number.isInteger(pointer.y)) {
        throw new Error('pointer invalide');
    }
    for (let index = pieces.length - 1; index >= 0; index -= 1) {
        const piece = pieces[index];
        if (piece.x === pointer.x && piece.y === pointer.y) {
            return { kind: 'piece', id: piece.id, x: piece.x, y: piece.y };
        }
    }
    const cell = cells.find((candidate) => candidate.x === pointer.x && candidate.y === pointer.y);
    if (cell) {
        return { kind: 'cell', x: cell.x, y: cell.y };
    }
    return null;
}
