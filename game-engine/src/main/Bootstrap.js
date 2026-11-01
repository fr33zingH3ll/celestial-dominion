import { Loop } from './Loop.js';

/**
 * Point d'entrée unique. Les pièces viennent de l'appelant : scène, règles, affichage, temps, réseau.
 */
export function bootstrap(parts) {
    const required = ['scene', 'rules', 'state', 'renderer', 'frames', 'channel'];
    if (!parts || required.some((key) => !parts[key])) {
        throw new Error('bootstrap incomplet');
    }
    const outgoing = [];
    const loop = new Loop({
        frames: parts.frames,
        renderer: parts.renderer,
        scene: parts.scene,
        channel: parts.channel,
        outgoing,
    });
    return {
        scene: parts.scene,
        rules: parts.rules,
        state: parts.state,
        loop,
        play(move) {
            if (!parts.rules.isLegal(parts.state, move)) {
                throw new Error('coup illégal');
            }
            parts.rules.apply(parts.state, move);
            outgoing.push(move);
        },
    };
}
