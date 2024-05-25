import r from 'rethinkdb';

/**
 * Class representing the database manager.
 */
class DBManager {
    constructor() {
        /**
         * The name of the database.
         * @type {string}
         */
        this.dbName = 'galactik-seeker';

        /**
         * The tables in the database.
         * @type {Array<string>}
         */
        this.tables = ['user', 'report'];

        /**
         * The database user.
         * @type {string}
         */
        this.user = 'fr33zingH3ll';

        /**
         * The database password.
         * @type {string}
         */
        this.password = 'ziJY2jq6329MBu';

        /**
         * The database connection.
         * @type {r.Connection}
         */
        this.conn;

        this.connect();
    }

    /**
     * Connect to the database.
     * @returns {Promise<void>}
     */
    async connect() {
        console.log("Connection to the database.");
        this.conn = await r.connect({
            host: 'localhost',
            port: 28015,
            db: this.dbName,
            // user: this.user, password: this.password
        });
    }

    // /**
    //  * Setup the database.
    //  * @returns {Promise<void>}
    //  */
    // async setupDabatbase() {
    //     // Créer la base de données
    //     const dbList = r.dbList().run(this.conn);
    //     try {
    //         await r.dbCreate(this.dbName).run(this.conn);
    //         console.log(`Database '${this.dbName}' created.`);
    //     } catch (error) {
    //         console.log(`Database creattion '${this.dbName}' failed : `+error.msg);
    //     }
    // }
}

export default DBManager;