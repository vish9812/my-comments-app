import dotenv from "dotenv";
dotenv.config();

console.log("port>>>", process.env.port);
console.log("db_host>>>", process.env.db_host);
console.log("password>>>", process.env.db_password);

export default {
  port: process.env.port,
  db: {
    host: process.env.db_host,
    password: process.env.db_password,
  },
};
