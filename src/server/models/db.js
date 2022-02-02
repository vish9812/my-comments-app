import { Sequelize } from "sequelize";
import mysql from "mysql2";
import dbConfig from "../config/db.config.js";
import Comment from "./comment.model.js";
import { delay } from "../utility.js";

let db = {};
let attemptsCount = 0;

const { host, username, password, database } = dbConfig;

const checkDbConnection = async () => {
  try {
    const sequelize = new Sequelize(dbConfig);

    console.log("Checking db connection...");
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    db = {
      Sequelize,
      sequelize,
      comments: Comment(sequelize, Sequelize),
    };
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

const createDb = async () => {
  try {
    console.log(`Attempting(${attemptsCount}) to connect to db>>>>>`, dbConfig);
    const connection = mysql.createConnection({
      host,
      user: username,
      password,
    });
    connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    await checkDbConnection();
  } catch (error) {
    if (attemptsCount++ < 20) {
      const delayTime = attemptsCount * 5000;
      console.log("Delaying for>>>>", delayTime);

      await delay(attemptsCount * 5000);
      console.log("Delay done");
      await createDb();
    } else {
      console.log("Failed to connect - attempts - ", attemptsCount);
      throw error;
    }
  }
};

try {
  await createDb();
} catch (error) {
  console.error("Failed to create connection>>>>>", error);
}

console.log("Exporting db>>>>>", Object.keys(db).length);

export default db;
