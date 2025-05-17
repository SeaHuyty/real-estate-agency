import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

// const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

// Create a SQL connection using our env variables
export const sql = neon (
    `postgresql://neondb_owner:npg_F81UJjHdvEAl@ep-mute-sky-a4vmsy9x-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`,
)

// this sql function we export is used as a tagged template literal, which allows us to write SQL queries in a more readable way