import test from 'node:test';
import assert from 'node:assert/strict';
import { Channel, SOCKET_OPEN } from './Channel.js';
import { browserPlatform } from './browserPlatform.js';
import { Store } from './Store.js';
import { Clock, Frames } from './Time.js';
import { WindowView } from './WindowView.js';

function memoryStorage() {
    const values = new Map();
    return {
        getItem: (key) => (values.has(key) ? values.get(key) : null),
        setItem: (key, value) => values.set(key, value),
        removeItem: (key) => values.delete(key),
    };
}

function fakeWindow() {
    const listeners = new Map();
    return {
        innerWidth: 800,
        innerHeight: 600,
        location: { replace(url) { this.url = url; } },
        addEventListener(type, listener) {
            const list = listeners.get(type) ?? [];
            list.push(listener);
            listeners.set(type, list);
        },
        removeEventListener(type, listener) {
            const list = (listeners.get(type) ?? []).filter((item) => item !== listener);
            listeners.set(type, list);
        },
        listeners,
    };
}

test('la fenêtre donne sa taille, navigue et retire un écouteur', () => {
    const target = fakeWindow();
    const view = new WindowView(target);
    assert.equal(view.width, 800);
    assert.equal(view.height, 600);
    view.go('/home.html');
    assert.equal(target.location.url, '/home.html');
    let seen = 0;
    const onKey = () => { seen += 1; };
    view.on('keydown', onKey);
    target.listeners.get('keydown')[0]();
    view.off('keydown', onKey);
    assert.equal(target.listeners.get('keydown').length, 0);
    assert.equal(seen, 1);
    assert.throws(() => view.go(''), /adresse requise/);
});

test('le stockage garde une chaîne et l’efface', () => {
    const store = new Store(memoryStorage());
    assert.equal(store.get('token'), null);
    store.set('token', 12);
    assert.equal(store.get('token'), '12');
    store.remove('token');
    assert.equal(store.get('token'), null);
    assert.throws(() => store.set('', 'x'), /clé requise/);
});

test('les frames mesurent le delta puis s’arrêtent', () => {
    const pending = [];
    let cancelled = null;
    const frames = new Frames(
        (callback) => { pending.push(callback); return pending.length; },
        (handle) => { cancelled = handle; },
    );
    const clock = new Clock(() => 50);
    const deltas = [];
    frames.start((delta) => deltas.push(delta));
    assert.throws(() => frames.start(() => {}), /boucle déjà lancée/);
    pending[0](clock.now());
    pending[1](66);
    frames.stop();
    assert.deepEqual(deltas, [0, 16]);
    assert.equal(cancelled, 3);
});

test('le socket envoie seulement quand il est ouvert', () => {
    const sent = [];
    let closed = false;
    const channel = new Channel((url) => ({
        url,
        readyState: SOCKET_OPEN,
        send: (data) => sent.push(data),
        close: () => { closed = true; },
    }));
    assert.throws(() => channel.send('bonjour'), /socket fermé/);
    const socket = channel.connect('ws://jeu');
    assert.equal(socket.url, 'ws://jeu');
    channel.send('bonjour');
    assert.deepEqual(sent, ['bonjour']);
    channel.close();
    assert.equal(closed, true);
    assert.throws(() => channel.send('encore'), /socket fermé/);
    assert.throws(() => new Channel('non'), /réseau requis/);
});

test('browserPlatform assemble les quatre accès ou refuse un contexte vide', () => {
    const target = fakeWindow();
    target.requestAnimationFrame = () => 1;
    target.cancelAnimationFrame = () => {};
    const globals = {
        window: target,
        localStorage: memoryStorage(),
        WebSocket: function Socket(url) { this.url = url; this.readyState = SOCKET_OPEN; },
        performance: { now: () => 10 },
    };
    const platform = browserPlatform(globals);
    platform.store.set('token', 'abc');
    assert.equal(platform.store.get('token'), 'abc');
    assert.equal(platform.clock.now(), 10);
    assert.equal(platform.window.width, 800);
    const socket = platform.channel().connect('ws://jeu');
    assert.equal(socket.url, 'ws://jeu');
    assert.throws(() => browserPlatform({}), /réseau requis/);
});
