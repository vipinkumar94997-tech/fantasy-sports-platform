import type { QueryInterface, Sequelize } from "sequelize";

const migration = {
  async up(_queryInterface: QueryInterface, _Sequelize: typeof Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(_queryInterface: QueryInterface, _Sequelize: typeof Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};

export default migration;
