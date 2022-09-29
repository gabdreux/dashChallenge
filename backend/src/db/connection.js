const knex = require('knex');

//MYSQL_DATABASE: 'db'
//# So you don't have to use root, but you can if you like
//MYSQL_USER: 'user'
//# You can use whatever password you like
//MYSQL_PASSWORD: 'password'
//# Password for root access
//MYSQL_ROOT_PASSWORD: 'password'

const connection = knex({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    port : 33066,
    user : 'user',
    password : 'password',
    database : 'db'
  }
});

module.exports = {
    dbConnection: () => {
        return connection;
    }
}