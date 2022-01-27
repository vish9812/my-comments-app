import { Sequelize } from "sequelize";
import mysql from "mysql2";
import dbConfig from "../config/db.config.js";
import Comment from "./comment.model.js";

const { host, username, password, database } = dbConfig;
const connection = mysql.createConnection({ host, user: username, password });
connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

const sequelize = new Sequelize(dbConfig);

try {
  console.log("Checking db connection...");
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const db = {
  Sequelize,
  sequelize,
  comments: Comment(sequelize, Sequelize),
};

export default db;
