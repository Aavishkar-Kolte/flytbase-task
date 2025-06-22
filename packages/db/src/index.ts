import { AppDataSource } from "./data-source.js";

export * from "typeorm";
export { AppDataSource };

export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (err) {
    console.error("Error during Data Source initialization:", err);
  }
};