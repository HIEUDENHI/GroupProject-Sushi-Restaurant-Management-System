const connection = require('../config/database');
const sql = require('mssql');

const showBranchesInfo = async (req, res) => {
    try {
        const pool = await connection();
        const result = await pool.request().query(`
            SELECT c.TenChiNhanh, c.DiaChi, 
                   FORMAT(c.ThoiGianMoCua, 'hh\\:mm') AS GioMoCua, 
                   FORMAT(c.ThoiGianDongCua, 'hh\\:mm') AS GioDongCua, 
                   c.CoBaiDoXeMay, c.CoBaiDoOto, k.TenKhuVuc
            FROM CHINHANH c
            INNER JOIN KHUVUC k ON c.MaKhuVuc = k.MaKhuVuc
        `);

        res.render('branches', { branches: result.recordset });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin chi nhánh:", error);
        res.status(500).send("Đã xảy ra lỗi máy chủ.");
    }
};

module.exports = { showBranchesInfo };
