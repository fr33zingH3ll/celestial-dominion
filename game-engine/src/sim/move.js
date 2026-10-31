/**
 * Ramène une intention de déplacement à une longueur d'au plus 1.
 * Les valeurs non finies deviennent un vecteur nul.
 * @param {{ x?: number, y?: number }} move
 * @returns {{ x: number, y: number }}
 */
export function clampMove(move) {
    const x = Number(move?.x);
    const y = Number(move?.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
        return { x: 0, y: 0 };
    }

    const length = Math.hypot(x, y);
    if (length === 0 || length <= 1) {
        return { x, y };
    }

    return { x: x / length, y: y / length };
}
