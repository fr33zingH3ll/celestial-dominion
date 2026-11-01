import jwt from 'jsonwebtoken';

/**
 * Vérifie et signe les jetons. La clé vient de JWT_SECRET.
 * La base est celle du serveur, pas une deuxième connexion.
 */
class JsonWebTokenAuth {
    /**
     * @param {import('./DB.js').default} db
     */
    constructor(db) {
        this.private_key = process.env.JWT_SECRET || '';
        this.db = db;
        if (!this.private_key) {
            console.error('JWT_SECRET manquant dans back-end/.env. L\'authentification répondra une erreur.');
        }
    }

    /**
     * @param {string} token
     * @returns {Promise<{ sub?: { id: string, username: string }, error?: string }>}
     */
    async jwtVerify(token) {
        if (!this.private_key) {
            return { error: 'JWT_SECRET manquant' };
        }

        let decrypt_token;
        const res = {};

        try {
            decrypt_token = await jwt.verify(token, this.private_key, { algorithms: ['HS256'] });
        } catch (error) {
            res.error = error.message;
            return res;
        }

        try {
            const users = await this.db.query(
                'SELECT id, username FROM `user` WHERE id = ? LIMIT 1',
                [decrypt_token.sub]
            );
            const user = users[0];
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
     * @param {Object} payload
     * @param {Object} options
     * @returns {string}
     */
    jwtSign(payload, options) {
        if (!this.private_key) {
            throw new Error('JWT_SECRET manquant');
        }
        return jwt.sign(payload, this.private_key, { ...options, algorithm: 'HS256' });
    }
}

export { JsonWebTokenAuth };
