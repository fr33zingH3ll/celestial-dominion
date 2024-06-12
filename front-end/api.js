import protobuf from 'protobufjs';
import { EventDispatcher } from 'game-engine/src/utils/EventDispatcher';
import { Event } from 'game-engine/src/utils/Event';

/**
 * Class representing a WebSocket connection.
 */
class Socket {
    /**
     * Create a WebSocket connection.
     * @param {string} url - The URL to connect to.
     */
    constructor(url) {
        this.url = url;
        this.emitter = new EventDispatcher();
    }

    /**
     * Initialize the WebSocket connection.
     * @returns {Promise<void>}
     */
    async init() {
        // Load the protobuf schema
        this.proto = await (new protobuf.Root().load("/game.proto"));
        
        // Create a WebSocket connection
        this.socket = new WebSocket(this.url);
        this.socket.binaryType = 'arraybuffer';
        
        // Wait for the connection to open
        await this.awaitOpen();
        
        // Handle incoming messages
        this.socket.addEventListener("message", (event) => {
            try {
                const wrap = this.proto.lookupType('MessageWrapper');
                const msg = wrap.decode(new Uint8Array(event.data));
                const type = Object.keys(msg)[0];
                const message = msg[type];
                this.emitter.dispatchEvent(new Event(type, message));
            } catch (e) {
                console.error(e);
                window.location.replace("/home.html");
                this.socket.close();
            }
        });
        
        // Handle WebSocket close event
        this.socket.addEventListener('close', () => {
            // logout();
        });
    }

    /**
     * Send a client shot message.
     */
    sendClientShot() {
        const shot = this.proto.lookupType("ClientShot");
        this.sendMessage({ clientShot: shot.create({ dummy: true }) });
    }

    /**
     * Send a client shot message.
     */
    sendClientOrbit(value) {
        const shot = this.proto.lookupType("ClientOrbit");
        this.sendMessage({ ClientOrbit: shot.create({ dummy: value }) });
    }

    /**
     * Send a player move message.
     * @param {Object} position - The player's position.
     * @param {number} rotation - The player's rotation.
     * @param {Object} velocity - The player's velocity.
     */
    sendPlayerMove(rotation, velocity) {
        const move = this.proto.lookupType("ClientPlayerMove");
        this.sendMessage({ clientPlayerMove: move.create({ rotation, velocity }) });
    }

    /**
     * Send a handshake message.
     * @param {string} token - The authentication token.
     */
    sendHandshake(token) {
        const hs = this.proto.lookupType("HandshakeRequest");
        this.sendMessage({ handshakeRequest: hs.create({ token }) });
    }

    /**
     * Send a message over the WebSocket connection.
     * @param {protobuf.Message} msg - The message to send.
     */
    sendMessage(msg) {
        const wrap = this.proto.lookupType('MessageWrapper');
        this.socket.send(wrap.encode(wrap.create(msg)).finish());
    }

    /**
     * Wait for the WebSocket connection to open.
     * @returns {Promise<void>}
     */
    awaitOpen() {
        return new Promise((resolve, reject) => {
            if (this.socket.readyState === WebSocket.OPEN) {
                resolve();
                return;
            }
            this.socket.addEventListener("open", () => {
                resolve();
            });
        });
    }
}

export { Socket };

/**
 * Déconnecte l'utilisateur en supprimant le token du stockage local et redirige vers la page d'accueil.
 * @returns {Promise<void>}
 */
export const logout = async () => {
    localStorage.removeItem("token");
    window.location.replace("/");
};

/**
 * Effectue une requête de connexion.
 * @param {string} username - Le nom d'utilisateur.
 * @param {string} password - Le mot de passe.
 * @returns {Promise<void>}
 */
export const login = async (username, password) => {
    const result = await request("/auth/login", {
        body: JSON.stringify({ username, password }),
        method: "POST",
    });

    const storage = localStorage.getItem('messages');
    const messages = storage ? JSON.parse(storage) : [];
    console.log(messages);
    const body = await result.json();

    if (!result.ok) {
        
        throw new Error(body.error);
    }

    if (body.erreur) {
        throw new Error(body.erreur);
    }

    localStorage.setItem("token", body.token);
}

/**
 * Effectue une requête d'enregistrement.
 * @param {string} username - Le nom d'utilisateur.
 * @param {string} password - Le mot de passe.
 * @param {string} confirm_password - La confirmation du mot de passe.
 * @returns {Promise<void>}
 */
export const register = async (username, password, confirm_password) => {

    if (password != confirm_password) {
        throw new Error("Les mots de passe doivent être identiques.");
    }

	const result = await request("/auth/register", {
		body: JSON.stringify({ username, password }),
		method: "POST",
	});

	const body = await result.json();

	if (!result.ok) {
		throw new Error(body.error);
	}

    login(username, password);
};

/**
 * Effectue une requête de connexion.
 * @param {string} username - Le nom d'utilisateur.
 * @param {string} password - Le mot de passe.
 * @returns {Promise<void>}
 */
export const verify = async (token) => {
    const result = await request("/auth/token", {
        body: JSON.stringify({ token }),
        method: "POST",
    });

    const body = await result.json();

    if (!result.ok) {
        if (body.error == "jwt expired") {
            localStorage.removeItem('token');
            return;
        }
        throw new Error(body.error);
    }

    return body.sub;
};

/**
 * Effectue une requête de rapport.
 * @param {string} type - Le type de rapport.
 * @param {string} description - La description du rapport.
 * @returns {Promise<void>}
 */
export const report = async (type, description) => {
    const result = await request("/report", {
        body: JSON.stringify({ type, description }),
        method: "POST"
    });

    const body = await result.json();

    if (!result.ok) {
        throw new Error(body.error);
    }
};

export const message_update = async () => {
    const result = await request("/all_updates", {
        method: "GET"
    });

    const body = await result.json();

    if (!result.ok) {
        throw new Error(body.error);
    }
    return body;
}

/**
 * Effectue une requête HTTP.
 * @param {string} url - L'URL à requêter.
 * @param {Object} parameters - Les paramètres de la requête.
 * @returns {Promise<void>}
 */
const request = async (url, parameters) => {
	return await fetch(import.meta.env.VITE_API_URI + url, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			...(localStorage.getItem("token") ? { Authorization: "Bearer " + localStorage.getItem("token") } : {})
		}, ...(parameters ? parameters : {})
	});
};
