import jwt from 'jsonwebtoken';
import r from 'rethinkdb';
import DBManager from './DB.js';

/**
 * Class for handling JSON Web Token (JWT) authentication.
 */
class JsonWebTokenAuth {
    constructor(db) {
        /**
         * Private key for signing JWTs.
         * @type {string}
         */
        this.private_key = "une_string_au_pif";

        /**
         * Database manager instance.
         * @type {DBManager}
         */
        this.db = db;
    }

    /**
     * Verify a JWT token.
     * @param {string} token - The JWT token to verify.
     * @returns {Promise<Object>} The result of the verification, containing either the user data or an error message.
     */
    async jwtVerify(token) {
        let decrypt_token;
        const res = {};

        try {
            decrypt_token = await jwt.verify(token, this.private_key);
        } catch (error) {
            res.error = error.message;
            return res;
        }

        try {
            const user = await r.table('user').get(decrypt_token.sub).without('password').run(this.db.conn);
            if (!user) {
                res.error = "L'utilisateur n'existe pas.";
                return res;
            }

            res.sub = user;
            return res;
        } catch (error) {
            res.error = "Erreur de connexion à la base de données";
            return res;
        }
    }

    /**
     * Sign a payload to create a JWT token.
     * @param {Object} payload - The payload to sign.
     * @param {Object} options - The options for signing the token.
     * @returns {string} The signed JWT token.
     */
    jwtSign(payload, options) {
        return jwt.sign(payload, this.private_key, options);
    }
}

export { JsonWebTokenAuth };
