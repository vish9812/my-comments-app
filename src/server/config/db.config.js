import appConfig from "./environment.js";

export default {
  host: appConfig.db.host,
  username: "root",
  password: appConfig.db.password,
  database: "my_comments",
  dialect: "mysql",
  retry: {
    max: 20,
  },
};
