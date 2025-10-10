module.exports = (sequelize, Sequelize) => {
  const Message = sequelize.define(
    "Message",
    {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      to: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      from: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
      },
      body: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      reply: Sequelize.STRING(2000),
      status: {
        type: Sequelize.ENUM("pending", "replied", "rejected"),
        defaultValue: "pending",
      },
      visible: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      votes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      meta_ipHash: Sequelize.STRING,
      meta_uaHash: Sequelize.STRING,
      meta_ref: Sequelize.STRING,
      deletedAt: Sequelize.DATE,
    },
    {
      tableName: "messages",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  );

  Message.associate = (models) => {
    Message.belongsTo(models.User, { foreignKey: "from", as: "fromUser" });
    Message.belongsTo(models.User, { foreignKey: "to", as: "toUser" });
    Message.hasMany(models.Vote, { foreignKey: "messageId", as: "votesList" });
  };

  return Message;
};
