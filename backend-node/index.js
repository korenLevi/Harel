const express = require('express');
const app = express();
const port = Number(process.env.PORT) || 3020;
const cors = require('cors');
const sql = require('mssql');
require('dotenv').config();


const config = {
    server: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

app.use(express.json());
app.use(cors());

const db = new sql.ConnectionPool(config);

db.connect().then(() => {
    console.log('Connected to the database');
}).catch((err) => {
    console.error('Error connecting to the database', err);
});

app.get('/', (req, res) => {
    res.json({ ok: true, service: 'backend-node' });
});

app.get('/tickets-insights', async (req, res) => {
    try {
        const byStatus = await db.request().query(`
            SELECT status, COUNT(*) as total 
            FROM tickets 
            GROUP BY status
        `);

        const byPriority = await db.request().query(`
            SELECT priority, COUNT(*) as total 
            FROM tickets 
            GROUP BY priority
        `);

        res.json({
            byStatus: byStatus.recordset,
            byPriority: byPriority.recordset,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});