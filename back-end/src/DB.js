import r from 'rethinkdb';

class DBManager {
    constructor() {
        this.dbName = 'galactik-seeker';
        this.tables = ['user', 'report'];
        this.user = 'fr33zingH3ll';
        this.password = 'ziJY2jq6329MBu';
        this.conn;
        this.connect();
    }

    async connect () {
        console.log("Connection to the database.");
        this.conn = await r.connect({ host: 'localhost', port: 28015, db: this.dbName, user: this.user, password: this.password });
    }

    async setupDabatbase() {
        // Créer la base de données
        const dbList = r.dbList().run(this.conn);
        try {
            await r.dbCreate(this.dbName).run(this.conn);
            console.log(`Database '${this.dbName}' created.`);
        } catch (error) {
            console.log(`Database creattion '${this.dbName}' failed : `+error.msg);
        }
        if (!(this.dbName in dbList)) {
            
        } else {
            
        }
    }
}

export default DBManager;