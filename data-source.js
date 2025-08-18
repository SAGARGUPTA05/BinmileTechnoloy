const { DataSource } = require("typeorm");

module.exports = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "root",
  database: "mydb",
  synchronize: false, 
  entities: [__dirname + "/entities/*.js"],
  migrations: [__dirname + "/migrations/*.js"],
});
