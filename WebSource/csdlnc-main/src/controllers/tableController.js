const connection = require('../config/database');
const sql = require('mssql');

// Hiển thị danh sách chi nhánh

const showTablesByBranch = async (req, res) => {
    const { branchId } = req.params;

    try {
        const pool = await connection();
        const result = await pool.request()
            .input('MaChiNhanh', sql.Int, branchId)
            .query(`
                SELECT STTBan, TrangThai
                FROM BAN
                WHERE MaChiNhanh = @MaChiNhanh
            `);

        res.render('tables', { tables: result.recordset, branchId });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bàn:', error);
        res.status(500).render('error', { message: 'Đã xảy ra lỗi máy chủ.' });
    }
};
const updateTableStatus = async (req, res) => {
    const { branchId, tableId } = req.params;
    const { TrangThai, MaKH } = req.body;

    try {
        const pool = await connection();

        // Cập nhật trạng thái bàn
        await pool.request()
            .input('MaChiNhanh', sql.Int, branchId)
            .input('STTBan', sql.Int, tableId)
            .input('TrangThai', sql.NVarChar(50), TrangThai)
            .query(`
                UPDATE BAN
                SET TrangThai = @TrangThai
                WHERE MaChiNhanh = @MaChiNhanh AND STTBan = @STTBan
            `);

        // Tạo phiếu đặt món nếu trạng thái là "Đang phục vụ"
        if (TrangThai === 'Đang phục vụ') {
            const request = pool.request()
                .input('NgayLap', sql.DateTime, new Date())
                .input('MaChiNhanh', sql.Int, branchId)
                .input('STTBan', sql.Int, tableId)
                .input('MaNV', sql.Int, req.session.user.id);

            // Nếu MaKH có giá trị, thêm vào câu lệnh INSERT
            if (MaKH) {
                request.input('MaKH', sql.Int, MaKH);
                await request.query(`
                    INSERT INTO THONGTINPHIEUDATMON (NgayLap, MaChiNhanh, STTBan, MaNV, MaKH)
                    VALUES (@NgayLap, @MaChiNhanh, @STTBan, @MaNV, @MaKH)
                `);
            } else {
                // Nếu MaKH không có giá trị, bỏ qua cột MaKH
                await request.query(`
                    INSERT INTO THONGTINPHIEUDATMON (NgayLap, MaChiNhanh, STTBan, MaNV)
                    VALUES (@NgayLap, @MaChiNhanh, @STTBan, @MaNV)
                `);
            }
        }

        res.redirect(`/staff/tables/${branchId}`);
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái bàn:', error);
        res.status(500).send('Đã xảy ra lỗi máy chủ.');
    }
};

const getServingTables = async (req, res) => {
    const { branchId } = req.params;

    try {
        const pool = await connection();

        // Lấy danh sách bàn có trạng thái "Đang phục vụ" và MaPhieu chưa thanh toán
        const tablesResult = await pool.request()
            .input('MaChiNhanh', sql.Int, branchId)
            .query(`
                SELECT DISTINCT tp.STTBan, tp.MaPhieu
                FROM THONGTINPHIEUDATMON tp
                LEFT JOIN HOADON h ON tp.MaPhieu = h.MaPhieu
                WHERE tp.MaChiNhanh = @MaChiNhanh
                AND h.MaHoaDon IS NULL
            `);

        res.render('servingTables', {
            branchId,
            tables: tablesResult.recordset
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bàn đang phục vụ:', error);
        res.status(500).send('Đã xảy ra lỗi máy chủ.');
    }
};
// Lấy danh sách chi nhánh
const renderAddReservationForm = async (req, res) => {
    try {
        res.render('customerAddReservation', {
            successMessage: null,
            errorMessage: null,
        }); // Không truyền `branches` vào đây nữa
    } catch (error) {
        console.error('Lỗi khi render form đặt bàn:', error);
        res.status(500).send('Không thể tải form đặt bàn.');
    }
};
const getBranches = async (req, res) => {
    try {
        const pool = await connection();
        const result = await pool.request().query(`
            SELECT MaChiNhanh, TenChiNhanh FROM CHINHANH
        `);
        res.json(result.recordset); // Trả về danh sách chi nhánh dưới dạng JSON
    } catch (error) {
        console.error('Lỗi khi lấy danh sách chi nhánh:', error);
        res.status(500).json({ error: 'Không thể lấy danh sách chi nhánh.' });
    }
};
// Thêm đặt bàn
const addCustomerReservation = async (req, res) => {
    const { branchId, tableNumber, reservationDate, arrivalTime, guestCount, notes } = req.body;
    const customerId = req.session.user.id; // Lấy ID khách hàng từ session

    try {
        const pool = await connection();
        await pool.request()
            .input('MaKhachHang', sql.Int, customerId)
            .input('MaChiNhanh', sql.Int, branchId)
            .input('STTBan', sql.Int, tableNumber)
            .input('NgayDat', sql.Date, reservationDate)
            .input('GioDen', sql.DateTime, arrivalTime)
            .input('SoLuongKhach', sql.Int, guestCount)
            .input('GhiChu', sql.NVarChar(255), notes || null)
            .execute('sp_AddReservation');

        res.render('customerAddReservation', {
            successMessage: 'Đặt bàn thành công!',
            errorMessage: null,
            branches: [],
        });
    } catch (error) {
        console.error('Lỗi khi đặt bàn:', error);
        res.render('customerAddReservation', {
            errorMessage: 'Bàn đã được đặt. Đặt bàn thất bại. Vui lòng kiểm tra lại thông tin.',
            successMessage: null,
            branches: [],
        });
    }
};

// Lấy danh sách bàn trống theo chi nhánh
const getAvailableTables = async (req, res) => {
    const { branchId } = req.query;

    try {
        const pool = await connection();
        const result = await pool.request()
            .input('MaChiNhanh', sql.Int, branchId)
            .query(`
                SELECT STTBan 
                FROM BAN 
                WHERE MaChiNhanh = @MaChiNhanh
            `);

        res.json(result.recordset); // Trả về danh sách bàn trống dưới dạng JSON
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bàn trống:', error);
        res.status(500).json({ error: 'Không thể lấy danh sách bàn trống.' });
    }
};

module.exports = { showTablesByBranch, updateTableStatus, getServingTables,addCustomerReservation, getAvailableTables,renderAddReservationForm,getBranches };
