const connection = require('../config/database');
const sql = require('mssql');
const createOrder = async (req, res) => {
    const { branchId, tableId } = req.params;
    const { MaKH } = req.body;

    try {
        const pool = await connection();

        // Gọi procedure sp_addOrder để tạo phiếu đặt món
        const result = await pool.request()
            .input('NgayLap', sql.DateTime, new Date())
            .input('MaChiNhanh', sql.Int, branchId)
            .input('STTBan', sql.Int, tableId)
            .input('MaNV', sql.Int, req.session.user.id)
            .input('MaKH', sql.Int, MaKH || null)
            .execute('sp_addOrder');

        const MaPhieu = result.recordset[0].MaPhieu;

        // Chuyển hướng đến trang menu
        res.redirect(`/staff/menu/${branchId}/${tableId}/${MaPhieu}`);
    } catch (error) {
        console.error('Lỗi khi tạo phiếu đặt món:', error);
        res.status(500).send('Đã xảy ra lỗi máy chủ.');
    }
};

const checkoutTable = async (req, res) => {
    const { branchId, tableId } = req.params;

    try {
        const pool = await connection();

        // Chuyển trạng thái bàn về "Trống"
        await pool.request()
            .input('MaChiNhanh', sql.Int, branchId)
            .input('STTBan', sql.Int, tableId)
            .query(`
                UPDATE BAN
                SET TrangThai = 'Trống'
                WHERE MaChiNhanh = @MaChiNhanh AND STTBan = @STTBan
            `);

        res.redirect(`/staff/tables/${branchId}`);
    } catch (error) {
        console.error('Lỗi khi thanh toán bàn:', error);
        res.status(500).render('error', { message: 'Đã xảy ra lỗi máy chủ.' });
    }
};
const addDishToExistingOrder = async (req, res) => {
    const { branchId, tableId, MaPhieu } = req.params;
    const { quantity } = req.body;

    try {
        const pool = await connection();

        for (const [MaMon, SoLuong] of Object.entries(quantity)) {
            if (SoLuong > 0) {
                await pool.request()
                    .input('MaPhieu', sql.Int, MaPhieu)
                    .input('MaMon', sql.Int, MaMon)
                    .input('SoLuong', sql.Int, SoLuong)
                    .execute('sp_addDishToOrder');
            }
        }

        res.redirect(`/staff/tables/serving/${branchId}`);
    } catch (error) {
        console.error('Lỗi khi thêm món vào phiếu:', error);
        res.status(500).send('Đã xảy ra lỗi máy chủ.');
    }
};






module.exports = { createOrder, checkoutTable, addDishToExistingOrder };
