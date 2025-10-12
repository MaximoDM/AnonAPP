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
      reply: {
        type: Sequelize.STRING(2000),
        allowNull: true,
      },
      isAnonymous: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "replied", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
      visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      votes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      repliedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "messages",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
    
  );

  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: "from",
      as: "fromUser",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    Message.belongsTo(models.User, {
      foreignKey: "to",
      as: "toUser",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    Message.hasMany(models.Vote, {
      foreignKey: "messageId",
      as: "votesList",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return Message;
};
