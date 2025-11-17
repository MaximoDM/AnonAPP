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
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      passwordHash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      alias: {
        type: Sequelize.STRING(100),
        allowNull: false, 
        unique: true,
        validate: {
          len: [3, 100],
          is: /^[a-zA-Z0-9_]+$/,
        },
      },
      avatar: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      bio: {
        type: Sequelize.STRING(280),
        allowNull: true,
      },
      role: {
        type: Sequelize.ENUM("user", "admin"),
        allowNull: false,
        defaultValue: "user",
      },
      totalMessages: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
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

      scopes: {
        withPassword: { attributes: {} },
      },
    }
  );

      User.associate = (models) => {
      User.hasMany(models.Message, {
        foreignKey: "from",
        as: "sentMessages",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });

      User.hasMany(models.Message, {
        foreignKey: "to",
        as: "receivedMessages",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      User.hasMany(models.Vote, {
        foreignKey: "userId",
        as: "votes",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    };


  return User;
};
