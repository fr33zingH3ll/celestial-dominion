import { Channel } from './Channel.js';
import { Store } from './Store.js';
import { Clock, Frames } from './Time.js';
import { WindowView } from './WindowView.js';

/**
 * Branche les abstractions sur un navigateur. Hors navigateur, l'appel échoue.
 */
export function browserPlatform(globals = globalThis) {
    const view = globals.window ?? globals;
    if (typeof globals.WebSocket !== 'function') {
        throw new Error('réseau requis');
    }
    if (!globals.localStorage) {
        throw new Error('stockage requis');
    }
    const request = view.requestAnimationFrame?.bind(view);
    if (typeof request !== 'function') {
        throw new Error('temps requis');
    }
    const cancel = view.cancelAnimationFrame?.bind(view) ?? (() => {});
    const now = globals.performance?.now?.bind(globals.performance) ?? (() => Date.now());
    return {
        window: new WindowView(view),
        store: new Store(globals.localStorage),
        clock: new Clock(now),
        frames: new Frames(request, cancel),
        channel: () => new Channel((url) => new globals.WebSocket(url)),
    };
}
