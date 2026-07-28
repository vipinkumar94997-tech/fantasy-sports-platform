import { Op, type QueryInterface } from "sequelize";

const migration = {
  async up(queryInterface: QueryInterface) {
    const indexes = await queryInterface.showIndex("ContestEntries");
    if (
      !indexes.some(
        (index) => index.name === "contest_entries_user_contest_team_unique",
      )
    ) {
      await queryInterface.addIndex(
        "ContestEntries",
        ["userId", "contestId", "teamId"],
        {
          unique: true,
          name: "contest_entries_user_contest_team_unique",
        },
      );
    }

    const transactionIndexes = await queryInterface.showIndex("Transactions");
    if (
      !transactionIndexes.some(
        (index) => index.name === "transactions_order_id_unique",
      )
    ) {
      await queryInterface.addIndex("Transactions", ["orderId"], {
        unique: true,
        name: "transactions_order_id_unique",
        where: { orderId: { [Op.ne]: null } },
      });
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeIndex(
      "Transactions",
      "transactions_order_id_unique",
    );
    await queryInterface.removeIndex(
      "ContestEntries",
      "contest_entries_user_contest_team_unique",
    );
  },
};

export default migration;
