/** État OPEN de la spécification WebSocket. */
export const SOCKET_OPEN = 1;

/**
 * Connexion. L'envoi exige un socket ouvert. La plateforme ne décide aucun coup.
 */
export class Channel {
    constructor(createSocket) {
        if (typeof createSocket !== 'function') {
            throw new Error('réseau requis');
        }
        this.createSocket = createSocket;
        this.socket = null;
    }

    connect(url) {
        if (typeof url !== 'string' || url.length === 0) {
            throw new Error('adresse requise');
        }
        if (this.socket) {
            throw new Error('déjà connecté');
        }
        this.socket = this.createSocket(url);
        return this.socket;
    }

    send(data) {
        if (!this.socket || this.socket.readyState !== SOCKET_OPEN) {
            throw new Error('socket fermé');
        }
        this.socket.send(data);
    }

    close() {
        if (!this.socket) {
            return;
        }
        this.socket.close();
        this.socket = null;
    }
}
