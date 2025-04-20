import { Sequelize } from 'sequelize';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: process.env.DATABASE_DIALECT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
  dialectOptions: {
    ssl: true,
  },
});

try {
  await sequelize.authenticate();
  console.log(chalk.green('Successfully connected to database'));
} catch (error) {
  console.log(chalk.red(`Connection failed! Reason: ${error.message}`));
  process.exit(1);
}

export default sequelize;
