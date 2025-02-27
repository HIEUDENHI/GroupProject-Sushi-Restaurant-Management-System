// src/config/db.js
const sql = require('mssql');
require('dotenv').config(); // Đọc biến môi trường từ file .env

// Cấu hình kết nối database
const config = {
    user: process.env.DB_USER, // Lấy từ file .env
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT), // Đảm bảo port là số
    database: process.env.DB_NAME,
    options: {
        encrypt: false, // Cấu hình này dành cho SQL Server trên Windows
        trustServerCertificate: true, // Xử lý lỗi liên quan đến chứng chỉ
    },
};

// Hàm kết nối tới database
async function connectDB() {
    try {
        const pool = await sql.connect(config);
        console.log('Kết nối thành công đến SQL Server');
        return pool; // Trả về pool kết nối để tái sử dụng
    } catch (error) {
        console.error('Lỗi kết nối đến SQL Server:', error);
        throw error; // Ném lỗi để xử lý ở nơi gọi
    }
}

module.exports = connectDB;
