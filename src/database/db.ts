import { Sequelize } from 'sequelize';
import * as pg from 'pg';

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
  define: {
    timestamps: false,
    freezeTableName: true,
  },
});

export default sequelize;
