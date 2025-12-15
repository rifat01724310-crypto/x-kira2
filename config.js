const { existsSync } = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");
if (existsSync(path.join(__dirname, "config.env"))) {
  require("dotenv").config({ path: path.join(__dirname, "config.env") });
}
const isTrue = (x) => x === "true" || x === true;
const DB_URL = process.env.DATABASE_URL || "";
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "", //add your session id here


  MENU_INFO: process.env.MENU_INFO || "𓆩〭᪳〬Ꮓ͢Ꭺɼ֟፝ιន͜𝙷̐𝙰𓆪᪳,https://files.catbox.moe/e1xo1b.mp4,video",
  THEME: process.env.THEME || "t", //Garfield
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024,
  WORK_TYPE: process.env.WORK_TYPE || "public",
  prefix: process.env.PREFIX || ".",
  STATUS_REACT: isTrue(process.env.STATUS_REACT) || false, // true
  AUTOREAD: isTrue(process.env.AUTOREAD) || false,
  AUTOTYPING: isTrue(process.env.AUTOTYPING) || false,
  AUTOREACT: isTrue(process.env.AUTOREACT) || false,
  STATUS_SEEN: isTrue(process.env.STATUS_SEEN) || false,

  autoread: isTrue(process.env.AUTOREAD) || false,
  autotyping: isTrue(process.env.AUTOTYPING) || false,
  autoreact: isTrue(process.env.AUTOREACT) || false,
  autostatus_seen: isTrue(process.env.STATUS_SEEN) || false,
  autostatus_react: isTrue(process.env.STATUS_REACT) || false,

  DATABASE: DB_URL
    ? new Sequelize(DB_URL, {
      dialect: "postgres",
      ssl: true,
      protocol: "postgres",
      dialectOptions: {
        native: true,
        ssl: { require: true, rejectUnauthorized: false },
      },
      logging: false,
    })
    : new Sequelize({
      dialect: "sqlite",
      storage: "./database.db",
      logging: false,
    }),
};
