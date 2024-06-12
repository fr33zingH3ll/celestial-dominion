import r from 'rethinkdb';
import * as argon2 from "argon2";

import { JsonWebTokenAuth } from './src/jwt.js';
import DBManager from './src/DB.js';

const BDDmanager = new DBManager();
const jwtService = new JsonWebTokenAuth(BDDmanager);

/** ALL ABOUT AUTH */

const login = async (req, res) => {
    const body = req.body;

    if (!body.username || !body.password) {
        return res.status(400).json({ error: "Un des champs est vide" }); // Bad Request
    }

    const users = await r.table('user').filter({ username: body.username }).run(BDDmanager.conn);
    let result;
    try {
        result = await users.next();
    } catch (error) {
        return res.status(500).json({ error: error.msg }); // Internal Server Error
    }

    if (!await argon2.verify(result.password, body.password)) {
        return res.status(401).json({ error: "Mauvais mot de passe" }); // Unauthorized
    }

    const options = {
        expiresIn: "1h"
    };

    return res.status(200).json({ token: jwtService.jwtSign({ sub: result.id }, options) });
};

const register = async (req, res) => {
    const body = req.body;

    if (!body.username || !body.password) {
        return res.status(400).json({ error: "Un des champs est vide" }); // Bad Request
    }

    const users = await r.table('user').filter({ username: body.username }).run(BDDmanager.conn);
    let result;
    try {
        result = await users.next();
        return res.status(409).json({ error: "Utilisateur déjà existant" }); // 409 Conflict
    } catch (error) { }

    const password = await argon2.hash(body.password);
    await r.table('user').insert({ username: body.username, password: password }).run(BDDmanager.conn);
    return res.status(201).json({ res: "Enregistrement terminé" }); // 201 Created
};

const token = async (req, res) => {
    const body = req.body;
    if (!body.token) {
        return res.status(400).json({ error: "le token n'as pas été fourni." }); // Bad Request
    }

    const token = body.token;
    let validation;
    try {
        validation = await jwtService.jwtVerify(token);
    } catch(error) {
        return res.status(500).json({ error: error.msg }); // Internal Server Error
    }
    console.log(validation)
    if (validation.error) return res.status(401).json({ error: validation.error });
    console.log(validation);
    return res.status(200).json({ sub: validation.sub.username });
};


/** ALL ABOUT MESSAGES */

const get_all_messages = async (req, res) => {
    let messages;
    let array;
    try {
        messages = await r.table('message').run(BDDmanager.conn);
        array = await messages.toArray();
    } catch(error) {
        return res.status(500).json(error.msg);
    }
    return res.status(200).json(array);
};

const get_message_by_id = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "An id is required." });
    }

    let message;

    try {
        message = await r.table('message').get(id).run(BDDmanager.conn);
    } catch(error) {
        return res.status(500).json(error.msg);
    }
    return res.status(200).json(message);
}

const new_message = async (req, res) => {
    const body = req.body;
    try {
        await r.table('message').insert({ description: body.description }).run(BDDmanager.conn);
    } catch(error) {
        return res.status(500).json(error.msg);
    }
    return res.status(200).json({ success: "Enregsitrement effectué." });
};

const modify_message = async (req, res) => {};

const delete_message = async (req, res) => {
    const { id } = req.params;
    console.log(id)

    if (!id) {
        return res.status(400).json({ error: "An id is required." });
    }

    let messageDeleted;

    try {
        messageDeleted = await r.table('message').get(id).delete().run(BDDmanager.conn);
    } catch(error) {
        return res.status(500).json(error.msg);
    }
    return res.status(200).json(messageDeleted);
};

/** ALL ABOUT POST */

const get_all_posts = async (req, res) => {
    let posts;
    let array;
    try {
        posts = await r.table('post').run(BDDmanager.conn);
        array = await posts.toArray();
    } catch(error) {
        return res.status(500).json(error.msg);
    }
    return res.status(200).json(array);
};

const get_post_by_id = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "An id is required." });
    }

    let post;

    try {
        post = await r.table('post').get(id).run(BDDmanager.conn);
    } catch(error) {
        return res.status(500).json(error.msg);
    }
    return res.status(200).json(post);
};

const new_post = async (req, res) => {
    const body = req.body;
    try {
        await r.table('post').insert({ description: body.description }).run(BDDmanagerconn);
    } catch(error) {
        return res.status(500).json(error.msg);
    }
    return res.status(200).json({ success: "Enregsitrement effectué." });
};

const modify_post = async (req, res) => {};

const delete_post = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "An id is required." });
    }

    try {
        await r.table('post').delete(id).run(BDDmanager.conn);
    } catch(error) {
        return res.status(500).json(error.msg);
    }
    return res.status(200).json({ success: "Suppression effectué." });
};

/** ALL ABOUT USERS */

const get_all_users = async (req, res) => {
    let users;
    let array;
    try {
        users = await r.table('user').run(BDDmanager.conn);
        array = await users.toArray();
    } catch(error) {
        return res.status(500).json(error.msg);
    }
    return res.status(200).json(array);
};

const get_user_by_id = async (req, res) => {
    const { id } = req.params;
 
    if (!id) {
        return res.status(400).json({ error: "An id is required." });
    }

    let user;

    try {
        user = await r.table('user').get(id).without('password').run(BDDmanager.conn);
    } catch(error) {
        return res.status(500).json(error.msg);
    }
    return res.status(200).json(user);
};

/** ALL ABOUT REPORT */

const get_all_reports = async (req, res) => {
    let reports;
    let array;
    try {
        reports = await r.table('report').run(BDDmanager.conn);
        array = await reports.toArray();
    } catch(error) {
        return res.status(500).json(error.msg);
    }
    return res.status(200).json(array);
};

const get_report_by_id = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "An id is required." });
    }

    let report;

    try {
        report = await r.table('report').get(id).run(BDDmanager.conn);

    } catch(error) {
        return res.status(500).json(error.msg);
    }
    return res.status(200).json(report);
};

const new_report = async (req, res) => {
    const body = req.body;

    if (!body.type || !body.description) {
        return res.status(400).json({ error: "Le report n'est pas complet. Erreur dans l'enregistrement de votre report." }); // Bad Request
    }

    const type = body.type;
    const description = body.description;
    try {
        await r.table('report').insert({ type: type, description: description }).run(BDDmanager.conn);
    } catch (error) {
        return res.status(500).json({ error: "Une erreur est survenue lors de l'enregistrement de votre votre report." })
    }

    return res.status(201).json({ succes: "L'enregistrement de votre report a bien été effectué." }); // 201 Created
};

const modify_report = async (req, res) => {};

const delete_report = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "An id is required." });
    }

    try {
        await r.table('report').delete(id).run(BDDmanager.conn);
    } catch(error) {
        return res.status(500).json(error.msg);
    }
    return res.status(200).json({ success: "Suppression effectué." });
};

export const post_request = {
    get_all_posts,
    get_post_by_id,
    new_post,
    modify_post,
    delete_post
};

export const message_request = {
    get_all_messages,
    get_message_by_id,
    new_message,
    modify_message,
    delete_message
};

export const report_request = {
    get_all_reports,
    get_report_by_id,
    new_report,
    modify_report,
    delete_report
};

export const user_request = {
    get_all_users,
    get_user_by_id
};

export const api_request = {
    login,
    register, 
    token,
};
