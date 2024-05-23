import jwt from 'jsonwebtoken';
import r from 'rethinkdb';
import DBManager from './DB.js';

class JsonWebTokenAuth {

    constructor() { 
        this.private_key = "une_string_au_pif";
        this.db = new DBManager();
    }

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

    jwtSign(payload, options) {
        return jwt.sign(payload, this.private_key, options);
    }
}

export { JsonWebTokenAuth };