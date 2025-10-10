module.exports = (sequelize, Sequelize) => {
  const Vote = sequelize.define(
    "Vote",
    {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      messageId: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM("like", "dislike"),
        defaultValue: "like",
      },
    },
    {
      tableName: "votes",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      indexes: [{ unique: true, fields: ["userId", "messageId"] }],
    }
  );

  Vote.associate = (models) => {
    Vote.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Vote.belongsTo(models.Message, { foreignKey: "messageId", as: "message" });
  };

  return Vote;
};
