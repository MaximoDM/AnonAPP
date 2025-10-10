const { Sequelize } = require("sequelize");
const dbConfig = require("../config/db.config.js");

// Create Sequelize instance
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
    },
});

const db = {};

// Load models
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.js")(sequelize, Sequelize);
db.Message = require("./message.js")(sequelize, Sequelize);
db.Vote = require("./vote.js")(sequelize, Sequelize);

// Define associations
Object.values(db)
  .filter((model) => model.associate)
  .forEach((model) => model.associate(db));

module.exports = db;
