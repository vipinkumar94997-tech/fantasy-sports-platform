import { DataTypes } from "sequelize";
import type { QueryInterface } from "sequelize";

const migration = {
  async up(queryInterface: QueryInterface) {
    const columns = await queryInterface.describeTable("Teams");

    if (!columns.rank) {
      await queryInterface.addColumn("Teams", "rank", {
        type: DataTypes.INTEGER,
        allowNull: true,
      });
    }

    if (!columns.status) {
      await queryInterface.addColumn("Teams", "status", {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "PENDING",
      });
    }
  },

  async down(queryInterface: QueryInterface) {
    const columns = await queryInterface.describeTable("Teams");

    if (columns.status) await queryInterface.removeColumn("Teams", "status");
    if (columns.rank) await queryInterface.removeColumn("Teams", "rank");
  },
};

export default migration;
