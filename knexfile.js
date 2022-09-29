const connection = require("./backend/src/db/connection");

module.exports = {
    client: "mysql",
    connection: {
        host: "localhost",
        port: "33066",
        database: "db",
        user: "user",
        password: "password",
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: 'base_migrations',
        // directory: `${__dirname}/src/database/migrations`
    }
};