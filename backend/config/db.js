// import { Sequelize } from "sequelize";
// import dotenv from "dotenv";
// dotenv.config();

// // const sequelize = new Sequelize(
// //   process.env.DB_NAME,
// //   process.env.DB_USER,
// //   process.env.DB_PASSWORD,
// //   {
// //     host: process.env.DB_HOST,
// //     port: Number(process.env.DB_PORT),
// //     dialect: "mysql",
// //     logging: false,
// //   },
// // );

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT || 3306,
//     dialect: "mysql",
//     logging: false,

//     dialectOptions: {
//       ssl:
//         process.env.NODE_ENV === "production"
//           ? {
//               require: true,
//               rejectUnauthorized: false,
//             }
//           : false,
//       connectTimeout: 60000,
//     },
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 60000,
//       idle: 10000,
//     },
//   },
// );

// export const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Database connected successfully");

//     await sequelize.sync({ alter: true });
//     console.log("MySQL Connected!");
//   } catch (err) {
//     console.error("DB Error:", err.message);
//     process.exit(1);
//   }
// };

// export default sequelize;

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
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

    await sequelize.sync({ alter: true });
    console.log("Tables Synced Successfully");
  } catch (err) {
    console.error("DB Error:", err);
    process.exit(1);
  }
};

export default sequelize;
