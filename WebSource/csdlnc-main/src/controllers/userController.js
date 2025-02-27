// src/controllers/userController.js
const connectDB = require('../config/database');

// Lấy danh sách tất cả Users
async function getAllUsers(req, res) {
    try {
        const pool = await connectDB(); // Kết nối đến database
        const result = await pool.request().query('SELECT * FROM TAIKHOAN'); // Truy vấn SQL
        res.status(200).json(result.recordset); // Trả về kết quả dưới dạng JSON
    } catch (error) {
        console.error('Lỗi khi lấy danh sách Users:', error);
        res.status(500).send('Đã xảy ra lỗi khi lấy danh sách Users');
    }
}


// Cập nhật thông tin User


module.exports = {
    getAllUsers
};
