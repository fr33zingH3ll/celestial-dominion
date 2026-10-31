import mariadb from 'mariadb';
import 'dotenv/config';

/**
 * Class representing the database manager.
 */
class DBManager {
    constructor() {
        /**
         * The name of the database.
         * @type {string}
         */
        this.dbName = process.env.DB_NAME || 'galactik-seeker';

        /**
         * MariaDB host.
         * @type {string}
         */
        this.host = process.env.DB_HOST || '100.70.202.121';

        /**
         * MariaDB port.
         * @type {number}
         */
        this.port = Number(process.env.DB_PORT || 3306);

        /**
         * The database user.
         * @type {string}
         */
        this.user = process.env.DB_USER;

        /**
         * The database password.
         * @type {string}
         */
        this.password = process.env.DB_PASSWORD;

        /**
         * Connection pool.
         * @type {mariadb.Pool}
         */
        this.pool;

        this.connecting = this.connect();
    }

    /**
     * Connect to the database.
     * @returns {Promise<void>}
     */
    async connect() {
        if (!this.user || !this.password) {
            throw new Error('DB_USER et DB_PASSWORD sont requis dans back-end/.env.');
        }

        console.log(`Connection to the database ${this.host}.`);
        this.pool = mariadb.createPool({
            host: this.host,
            port: this.port,
            user: this.user,
            password: this.password,
            database: this.dbName,
            connectionLimit: 5,
            bigIntAsNumber: true,
        });

        const conn = await this.pool.getConnection();
        try {
            await conn.query('SELECT 1');
        } finally {
            conn.release();
        }
    }

    /**
     * Run a parameterized query.
     * @param {string} sql
     * @param {Array} params
     * @returns {Promise<Array>}
     */
    async query(sql, params = []) {
        await this.connecting;
        return this.pool.query(sql, params);
    }
}

export default DBManager;
