import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT),
//     dialect: "mysql",
//     logging: false,
//   },
// );

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    logging: false,

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      connectTimeout: 60000,
    },
  },
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("MySQL Connected!");
  } catch (err) {
    console.error("DB Error:", err.message);
    process.exit(1);
  }
};

export default sequelize;
