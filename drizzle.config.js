/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./db/schema.js",
    out: "./drizzle",
    driver: 'pg', // Assuming PostgreSQL backend for Netlify DB/Connect
    dbCredentials: {
        connectionString: process.env.DATABASE_URL,
    },
};
