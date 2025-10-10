module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      alias: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      avatar: Sequelize.STRING(255),
      bio: Sequelize.STRING(280),
      role: {
        type: Sequelize.ENUM("user", "admin"),
        defaultValue: "user",
      },
      totalMessages: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      defaultScope: {
        attributes: { exclude: ["passwordHash"] },
      },
    }
  );

  return User;
};
