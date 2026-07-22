import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { requireEnv } from "./env.js";

dotenv.config();

const sequelize = new Sequelize(requireEnv("DATABASE_URL"), {
  dialect: "postgres",
  protocol: "postgres",

  logging: false,

  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    connectTimeout: 60000,
  },

  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
});

export const connectDB = async () => {
  try {
    console.log("Trying to connect DB...");

    await sequelize.authenticate();
    console.log("PostgreSQL Connected Successfully");
  } catch (err) {
    console.error("DB Error:", err);
    process.exit(1);
  }
};

export default sequelize;
