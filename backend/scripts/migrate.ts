import sequelize from "../config/db.js";
import initialMigration from "../migrations/20260523100816-init.js";
import teamColumnsMigration from "../migrations/20260722000000-add-team-rank-status.js";
import missingTablesMigration from "../migrations/20260722000001-create-missing-model-tables.js";
import integrityIndexesMigration from "../migrations/20260728000000-add-integrity-indexes.js";

const migrations = [
  ["20260523100816-init", initialMigration],
  ["20260722000000-add-team-rank-status", teamColumnsMigration],
  ["20260722000001-create-missing-model-tables", missingTablesMigration],
  ["20260728000000-add-integrity-indexes", integrityIndexesMigration],
] as const;

const queryInterface = sequelize.getQueryInterface();

try {
  await sequelize.authenticate();
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
      "name" VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY
    )
  `);

  const [completedRows] = await sequelize.query(
    'SELECT "name" FROM "SequelizeMeta"',
  );
  const completed = new Set(
    (completedRows as Array<{ name: string }>).map((row) => row.name),
  );

  for (const [name, migration] of migrations) {
    if (completed.has(name)) continue;

    await migration.up(queryInterface);
    await sequelize.query(
      'INSERT INTO "SequelizeMeta" ("name") VALUES (:name)',
      { replacements: { name } },
    );
  }
} finally {
  await sequelize.close();
}
