const API_PATH = "http://localhost:3000/api/v1";
const API_MESSAGE = "/message";
const API_USER = "/user";
const API_REPORT = "/report";
const API_AUTH = "/auth";

/**
 * Effectue une requête de connexion.
 * @param {string} username - Le nom d'utilisateur.
 * @param {string} password - Le mot de passe.
 * @returns {Promise<void>}
 */
export const login = async (username, password) => {
    const result = await request(API_AUTH+"/login", {
        body: JSON.stringify({ username, password }),
        method: "POST",
    });

    const body = await result.json();

    if (!result.ok) {
        throw new Error(body.error);
    }

    localStorage.setItem("token", body.token);
    return true;
};

/**
 * Effectue une requête de connexion.
 * @param {string} username - Le nom d'utilisateur.
 * @param {string} password - Le mot de passe.
 * @returns {Promise<void>}
 */
export const verify = async (token) => {
    const result = await request(API_AUTH+"/token", {
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

/** ALL ABOUT MESSAGES */

export const get_all_of = async (table) => {
    const result = await request("/"+table, {
        method: "GET"
    });

    const body = await result.json();

    if (!result.ok) {
        throw new Error(body.error);
    }
    return body;
};

export const get_of = async (table, id) => {
    const result = await request("/"+table+"/"+id, {
        method: "GET"
    });

    const body = await result.json();

    if (!result.ok) {
        throw new Error(body.error);
    }
    return body;
};

export const new_of = async (table, options) => {
    const result = await request("/"+table+"/new_"+table, {
        body: JSON.stringify({ options }),
        method: "POST"
    });

    const body = await result.json();

    if (!result.ok) {
        throw new Error(body.error);
    }
    return body;
};

export const modify_of = async (table, options) => {
    const result = await request("/"+table+"/modify_"+table, {
        body: JSON.stringify({ options }),
        method: "PUT"
    });

    const body = await result.json();

    if (!result.ok) {
        throw new Error(body.error);
    }
    return body;
};

export const delete_of = async (table, id) => {
    const result = await request("/"+table+"/delete_"+table, {
        body: JSON.stringify({ id }),
        method: "DELETE"
    });

    const body = await result.json();

    if (!result.ok) {
        throw new Error(body.error);
    }
    return body;
};

/** ALL ABOUT USERS */

/**
 * Effectue une requête HTTP.
 * @param {string} url - L'URL à requêter.
 * @param {Object} parameters - Les paramètres de la requête.
 * @returns {Promise<void>}
 */
const request = async (url, parameters) => {
	return await fetch(API_PATH + url, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			...(localStorage.getItem("token") ? { Authorization: "Bearer " + localStorage.getItem("token") } : {})
		}, ...(parameters ? parameters : {})
	});
};
