const InitializeDatabase = require('./build.db');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

InitializeDatabase(process.env.DB_PATH);
