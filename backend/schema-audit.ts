import sequelize from "./config/db.js";
import "./models/index.js";

const queryInterface = sequelize.getQueryInterface();
const tables = new Set(
  (await queryInterface.showAllTables()).map((table) =>
    typeof table === "string" ? table : String(table),
  ),
);
const report: Array<{
  model: string;
  table: string;
  missingTable: boolean;
  missingColumns: string[];
  extraColumns: string[];
}> = [];

for (const model of Object.values(sequelize.models)) {
  const tableDefinition = model.getTableName();
  const table =
    typeof tableDefinition === "string"
      ? tableDefinition
      : tableDefinition.tableName;
  const missingTable = !tables.has(table);

  if (missingTable) {
    report.push({
      model: model.name,
      table,
      missingTable,
      missingColumns: Object.keys(model.getAttributes()),
      extraColumns: [],
    });
    continue;
  }

  const columns = await queryInterface.describeTable(table);
  const modelColumns = new Set(Object.keys(model.getAttributes()));
  const databaseColumns = new Set(Object.keys(columns));
  report.push({
    model: model.name,
    table,
    missingTable: false,
    missingColumns: [...modelColumns].filter(
      (column) => !databaseColumns.has(column),
    ),
    extraColumns: [...databaseColumns].filter(
      (column) => !modelColumns.has(column),
    ),
  });
}

console.log(JSON.stringify(report));
await sequelize.close();
