import jwt from 'jsonwebtoken';
import r from 'rethinkdb';

class JsonWebTokenAuth {

    constructor() { 
        this.private_key = "une_string_au_pif";
        this.connect();
    }

    async jwtVerify(token) {
        let decrypt_token;
        const res = {};
        try {
            decrypt_token = await jwt.verify(token, this.private_key);
        } catch (error) {
            res.erreur = "Token invalide.";
            return res;
        }

        const user = await r.table('user').get(decrypt_token.sub).run(this.conn);
        if (!user) {
            res.erreur = "L'utilisateur n'existe pas.";
            return res;
        }
    
        res.sub = user;
        return res;
    }

    jwtSign(payload, options) {
        return jwt.sign(payload, this.private_key, options);
    }

    async connect () {
        this.conn = await r.connect({ host: 'localhost', port: 28015, db: 'galactik-seeker', user: 'fr33zingH3ll', password: 'ziJY2jq6329MBu' });
    }
}

export { JsonWebTokenAuth };