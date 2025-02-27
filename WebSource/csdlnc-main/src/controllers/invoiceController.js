const connection = require('../config/database');
const sql = require('mssql');
const callInvoiceProcedure = async (req, res) => {
    const { branchId, tableId } = req.body; // Dữ liệu từ form
    const discount = parseFloat(req.body.discount) || 0; // Lấy giảm giá từ form

    try {
        const pool = await connection();

        // Gọi Stored Procedure để tạo hóa đơn và nhận MaHoaDon
        const result = await pool.request()
            .input('MaChiNhanh', sql.Int, branchId)
            .input('STTBan', sql.Int, tableId)
            .input('TienGiamGia', sql.Decimal(15, 2), discount)
            .output('MaHoaDon', sql.Int) // Nhận giá trị OUTPUT
            .execute('sp_CreateInvoice');

        const MaHoaDon = result.output.MaHoaDon; // Lấy MaHoaDon từ OUTPUT

        // Chuyển hướng đến route hiển thị hóa đơn
        res.redirect(`/staff/invoice/${MaHoaDon}`);
    } catch (error) {
        console.error('Lỗi khi gọi Stored Procedure:', error);
        res.status(500).send('Đã xảy ra lỗi máy chủ.');
    }
};


const showInvoice = async (req, res) => {
    const { id } = req.params; // MaHoaDon

    try {
        const pool = await connection();

        // 1. Lấy thông tin hóa đơn kèm MaChiNhanh và các thông tin khác
        const invoiceResult = await pool.request()
            .input('MaHoaDon', sql.Int, id)
            .query(`
                SELECT h.MaHoaDon, h.NgayLap, h.TongTien, h.TienGiamGia, t.MaPhieu, t.MaChiNhanh, nv.HoTen AS NhanVien, kh.HoTen AS KhachHang
                FROM HOADON h
                JOIN THONGTINPHIEUDATMON t ON h.MaPhieu = t.MaPhieu
                LEFT JOIN NHANVIEN nv ON t.MaNV = nv.MaNhanVien
                LEFT JOIN KHACHHANG kh ON t.MaKH = kh.MaKhachHang
                WHERE h.MaHoaDon = @MaHoaDon
            `);

        if (invoiceResult.recordset.length === 0) {
            return res.status(404).send('Không tìm thấy hóa đơn.');
        }

        const invoiceDetails = invoiceResult.recordset[0];

        // 2. Lấy danh sách món ăn chi tiết
        const dishesResult = await pool.request()
            .input('MaPhieu', sql.Int, invoiceDetails.MaPhieu)
            .query(`
                SELECT m.TenMon, ct.SoLuong, m.GiaTien, (ct.SoLuong * m.GiaTien) AS ThanhTien
                FROM CHITIETPHIEUDATMON ct
                JOIN MONAN m ON ct.MaMon = m.MaMon
                WHERE ct.MaPhieu = @MaPhieu
            `);

        // 3. Render giao diện hóa đơn
        res.render('invoice_details', { 
            invoice: invoiceDetails, 
            dishes: dishesResult.recordset 
        });
    } catch (error) {
        console.error('Lỗi khi hiển thị hóa đơn:', error.message);
        res.status(500).send('Đã xảy ra lỗi khi hiển thị hóa đơn.');
    }
};

module.exports = { callInvoiceProcedure, showInvoice };