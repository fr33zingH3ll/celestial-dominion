/**
 * Generate a random position between two values.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} A random number between min and max.
 */
export function getRandomPosition(min, max) {
    return Math.random() * (max - min) + min;
}