import jwt from 'jsonwebtoken';

class JsonWebTokenAuth {

    constructor() { 
        this.private_key = "une_string_au_pif";
    }

    jwtVerify(token) {
        jwt.verify(token, this.private_key);
    }

    jwtSign(payload, options) {
        return jwt.sign(payload, this.private_key, options);
    }
}

export { JsonWebTokenAuth };