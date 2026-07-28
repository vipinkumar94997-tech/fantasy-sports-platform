import { DataTypes } from "sequelize";
import type { QueryInterface } from "sequelize";

const migration = {
  async up(queryInterface: QueryInterface) {
    const tables = (await queryInterface.showAllTables()).map(String);

    if (!tables.includes("AdminLogs")) {
      await queryInterface.createTable("AdminLogs", {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        adminId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: "Users", key: "id" },
          onDelete: "CASCADE",
        },
        action: { type: DataTypes.STRING, allowNull: false },
        targetType: { type: DataTypes.STRING, allowNull: true },
        targetId: { type: DataTypes.STRING, allowNull: true },
        details: { type: DataTypes.TEXT, allowNull: true },
        ip: { type: DataTypes.STRING, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: false },
      });
    }

    if (!tables.includes("TeamPlayers")) {
      await queryInterface.createTable("TeamPlayers", {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        teamId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: "Teams", key: "id" },
          onDelete: "CASCADE",
        },
        playerId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: "Players", key: "id" },
          onDelete: "CASCADE",
        },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: false },
      });
      await queryInterface.addIndex("TeamPlayers", ["teamId", "playerId"], {
        unique: true,
        name: "team_players_team_player_unique",
      });
    }
  },

  async down(queryInterface: QueryInterface) {
    const tables = (await queryInterface.showAllTables()).map(String);
    if (tables.includes("TeamPlayers")) {
      await queryInterface.dropTable("TeamPlayers");
    }
    if (tables.includes("AdminLogs")) {
      await queryInterface.dropTable("AdminLogs");
    }
  },
};

export default migration;
