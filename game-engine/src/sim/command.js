/**
 * Applique une intention déjà normalisée, une fois par pas serveur.
 * Une intention nulle arrête le vaisseau.
 * @param {{ setVelocity: Function, setAngle: Function }} bodyApi
 * @param {{ body: Object, move: Function, dirty: boolean }} entity
 * @param {{ move: { x: number, y: number }, rotation: number }} command
 */
export function applyPlayerCommand(bodyApi, entity, command) {
    if (!entity?.body || !command?.move) return;

    if (command.move.x === 0 && command.move.y === 0) {
        bodyApi.setVelocity(entity.body, { x: 0, y: 0 });
    } else {
        entity.move(command.move);
    }

    if (Number.isFinite(command.rotation)) {
        bodyApi.setAngle(entity.body, command.rotation);
    }

    entity.dirty = true;
}
