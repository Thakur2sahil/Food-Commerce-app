const { Client } = require('pg');

const db = new Client({
    host: '192.168.1.6',
    user: 'postgres',
    port: 5432,
    password: 'mawai123',
    database: 'php_training',
});

db.connect()
    .then(() => {
        console.log('Connected to database');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

module.exports = db;