import appConfig from "./environment.js";
import { ConnectionError } from "sequelize";

export default {
  host: appConfig.db.host,
  username: "root",
  password: appConfig.db.password,
  database: "my_comments",
  dialect: "mysql",
  retry: {
    match: [ConnectionError],
    max: 10,
  },
};
