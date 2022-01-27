import dotenv from "dotenv";
dotenv.config();

export default {
  host: process.env.host,
  port: process.env.port,
  db: {
    host: process.env.db_host,
    password: process.env.db_password,
  },
};
