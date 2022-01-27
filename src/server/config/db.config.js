export default {
  host: process.env.DB_HOST, //"localhost",
  username: "root",
  password: "admin",
  database: "my_comments",
  dialect: "mysql",
  retry: {
    max: 20,
  },
};
