const sql = require('mssql');
const  connection  = require('../config/database');




// Thống kê doanh thu hệ thống
const getSystemRevenueStats = async (req, res) => {
    const { startDate, endDate, groupBy } = req.query;

    try {
        const pool = await connection();

        // Gọi stored procedure để lấy doanh thu hệ thống
        const result = await pool.request()
            .input('StartDate', sql.DateTime, startDate)
            .input('EndDate', sql.DateTime, endDate)
            .input('GroupBy', sql.NVarChar(10), groupBy)
            .execute('sp_GetSystemRevenueStats');

        // Trả về kết quả doanh thu và render file EJS
        res.render('adminRevenueStats', { revenueStats: result.recordset });
    } catch (error) {
        console.error('Lỗi khi lấy doanh thu hệ thống:', error);
        res.status(500).send('Đã xảy ra lỗi máy chủ.');
    }
};

// Thống kê doanh thu món ăn
const getDishRevenueStats = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const pool = await connection();

        const result = await pool.request()
            .input('StartDate', sql.DateTime, startDate)
            .input('EndDate', sql.DateTime, endDate)
            .execute('sp_GetDishRevenueStats');

        res.render('adminDishRevenueStats', { 
            dishStats: result.recordset,
            startDate,
            endDate
        });
    } catch (error) {
        console.error('Lỗi khi lấy doanh thu món ăn:', error);
        res.status(500).send('Đã xảy ra lỗi máy chủ.');
    }
};

// Thống kê doanh thu chi nhánh
const getBranchRevenueStats = async (req, res) => {
    const { branchId, startDate, endDate, groupBy } = req.query;

    try {
        const pool = await connection();

        // Gọi stored procedure để lấy doanh thu chi nhánh
        const result = await pool.request()
            .input('MaChiNhanh', sql.Int, branchId)
            .input('StartDate', sql.DateTime, startDate)
            .input('EndDate', sql.DateTime, endDate)
            .input('GroupBy', sql.NVarChar(10), groupBy)
            .execute('sp_GetBranchRevenueStats');

        // Trả về kết quả doanh thu và render file EJS
        res.render('adminBranchRevenueStats', { 
            revenueStats: result.recordset,
            branchId, // Truyền branchId vào view
            startDate,
            endDate,
            groupBy
        });
    } catch (error) {
        console.error('Lỗi khi lấy doanh thu chi nhánh:', error);
        res.status(500).send('Đã xảy ra lỗi máy chủ.');
    }
};



// Chuyển nhân viên giữa các chi nhánh


// Thêm nhân viên mới





const updateMembershipTiers = async (req, res) => {
    try {
        const pool = await connection();

        // Gọi stored procedure để cập nhật hạng thành viên
        await pool.request().execute('sp_UpdateMembershipTiers');

        // Chuyển hướng về admin dashboard
        res.redirect('/admin?success=Hạng thành viên đã được cập nhật thành công.');
    } catch (error) {
        console.error('Lỗi khi cập nhật hạng thành viên:', error);
        res.status(500).send('Đã xảy ra lỗi máy chủ.');
    }
};

const showAdminDashboard = async (req, res) => {
    try {
        res.render('adminDashboard', { success: req.query.success || null });
    } catch (error) {
        console.error('Lỗi khi hiển thị admin dashboard:', error);
        res.status(500).send('Đã xảy ra lỗi máy chủ.');
    }
};
const getCustomerStats = async (req, res) => {
    const { startDate, endDate, groupBy } = req.query;

    try {
        // Kiểm tra nếu chưa có dữ liệu đầu vào, render form nhập
        if (!startDate || !endDate || !groupBy) {
            return res.render('adminCustomerStats', {
                stats: null, // Không có dữ liệu để hiển thị
                startDate: null,
                endDate: null,
                groupBy: null,
            });
        }

        const pool = await connection();

        // Gọi stored procedure với các tham số
        const result = await pool.request()
            .input('StartDate', sql.DateTime, startDate)
            .input('EndDate', sql.DateTime, endDate)
            .input('GroupBy', sql.NVarChar(10), groupBy)
            .execute('sp_GetCustomerStatsFromInvoice');

        // Trả kết quả và render ra view
        res.render('adminCustomerStats', { 
            stats: result.recordset, 
            startDate, 
            endDate, 
            groupBy 
        });
    } catch (error) {
        console.error('Lỗi khi lấy thống kê khách hàng:', error);
        res.status(500).send('Đã xảy ra lỗi máy chủ.');
    }
};
const getTopCustomersByBranch = async (req, res) => {
    const { branchId, year, month } = req.query;

    try {
        // Kiểm tra nếu chưa có dữ liệu đầu vào, render form nhập
        if (!branchId || !year || !month) {
            return res.render('adminTopCustomers', {
                customers: null, // Không có dữ liệu
                branchId: null,
                year: null,
                month: null,
            });
        }

        const pool = await connection();

        // Gọi stored procedure với các tham số
        const result = await pool.request()
            .input('MaChiNhanh', sql.Int, branchId)
            .input('Year', sql.Int, year)
            .input('Month', sql.Int, month)
            .execute('sp_GetTop5CustomersByBranch');

        // Render view với kết quả trả về
        res.render('adminTopCustomers', {
            customers: result.recordset,
            branchId,
            year,
            month,
        });
    } catch (error) {
        console.error('Lỗi khi lấy Top 5 khách hàng:', error);
        res.status(500).send('Đã xảy ra lỗi máy chủ.');
    }
};

const transferEmployee = async (req, res) => {
    const { employeeId, newBranchId, transferDate } = req.body;

    try {
        const pool = await connection();
        await pool.request()
            .input('MaNhanVien', sql.Int, employeeId)
            .input('NewBranchID', sql.Int, newBranchId)
            .input('TransferDate', sql.Date, transferDate)
            .execute('sp_TransferEmployee');

        res.redirect('/admin/employees');
    } catch (error) {
        console.error('Lỗi khi chuyển nhân viên:', error);
        res.status(500).send('Đã xảy ra lỗi khi chuyển nhân viên.');
    }
};
// Thêm nhân viên
const addEmployee = async (req, res) => {
    const { HoTen, NgaySinh, GioiTinh, MaBoPhan, MaChiNhanh } = req.body;

    try {
        const pool = await connection();
        await pool.request()
            .input('HoTen', sql.NVarChar(100), HoTen)
            .input('NgaySinh', sql.Date, NgaySinh)
            .input('GioiTinh', sql.NVarChar(10), GioiTinh)
            .input('MaBoPhan', sql.Int, MaBoPhan)
            .input('MaChiNhanh', sql.Int, MaChiNhanh)
            .execute('sp_AddEmployee');

        res.redirect('/admin/employees?success=add');
    } catch (error) {
        console.error('Lỗi khi thêm nhân viên:', error);
        res.redirect('/admin/employees?error=Lỗi khi thêm nhân viên');
    }
};

// Xóa nhân viên
const deleteEmployee = async (req, res) => {
    const { MaNhanVien } = req.body;

    try {
        const pool = await connection();
        await pool.request()
            .input('MaNhanVien', sql.Int, MaNhanVien)
            .execute('sp_DeleteEmployee');

        res.redirect('/admin/employees?success=delete');
    } catch (error) {
        console.error('Lỗi khi xóa nhân viên:', error);
        res.redirect('/admin/employees?error=Lỗi khi xóa nhân viên');
    }
};

// Hiển thị form chỉnh sửa nhân viên
const renderEditEmployeeForm = async (req, res) => {
    const { employeeId } = req.params;

    try {
        const pool = await connection();
        const result = await pool.request()
            .input('MaNhanVien', sql.Int, employeeId)
            .query('SELECT * FROM NHANVIEN WHERE MaNhanVien = @MaNhanVien');

        if (result.recordset.length === 0) {
            return res.status(404).send('Không tìm thấy nhân viên.');
        }

        res.render('adminEditEmployee', {
            employee: result.recordset[0],
            errorMessage: null,
            successMessage: null,
        });
    } catch (error) {
        console.error('Lỗi khi tải thông tin nhân viên:', error);
        res.status(500).send('Đã xảy ra lỗi máy chủ.');
    }
};

// Cập nhật nhân viên
const updateEmployee = async (req, res) => {
    const { employeeId } = req.params;
    const { HoTen, NgaySinh, GioiTinh, MaBoPhan } = req.body;

    try {
        const pool = await connection();

        // Gọi stored procedure
        await pool.request()
            .input('MaNhanVien', sql.Int, employeeId)
            .input('HoTen', sql.NVarChar(100), HoTen)
            .input('NgaySinh', sql.Date, NgaySinh)
            .input('GioiTinh', sql.NVarChar(10), GioiTinh)
            .input('MaBoPhan', sql.Int, MaBoPhan)
            .execute('sp_UpdateEmployee');

        res.redirect('/admin/employees?success=update');
    } catch (error) {
        console.error('Lỗi khi cập nhật nhân viên:', error);
        res.status(500).send('Đã xảy ra lỗi khi cập nhật nhân viên.');
    }
};


const renderEmployeeManagement = async (req, res) => {
    try {
        const pool = await connection();
        const employeesResult = await pool.request().query(`
            SELECT NHANVIEN.MaNhanVien, NHANVIEN.HoTen, NHANVIEN.NgaySinh, NHANVIEN.GioiTinh, NHANVIEN.MaBoPhan, NHANVIEN.MaChiNhanh
            FROM NHANVIEN
            JOIN LICHSULAMVIEC ON NHANVIEN.MaNhanVien = LICHSULAMVIEC.MaNhanVien
            WHERE NgayKetThuc IS NULL
        `);

        const branchesResult = await pool.request().query(`
            SELECT MaChiNhanh, TenChiNhanh FROM CHINHANH
        `);

        const successMessage = req.query.success === 'add'
            ? 'Đã thêm nhân viên thành công.'
            : req.query.success === 'update'
            ? 'Đã cập nhật thông tin nhân viên thành công.'
            : null;

        const errorMessage = req.query.error || null;

        res.render('adminEmployees', {
            employees: employeesResult.recordset,
            branches: branchesResult.recordset, // Thêm danh sách chi nhánh
            successMessage,
            errorMessage,
        });
    } catch (error) {
        console.error('Lỗi khi tải danh sách nhân viên:', error);
        res.status(500).send('Không thể tải danh sách nhân viên.');
    }
};

module.exports = {
    getSystemRevenueStats,
    getDishRevenueStats,
    getBranchRevenueStats,
    transferEmployee,
    addEmployee,
    updateMembershipTiers,
    showAdminDashboard,
    getCustomerStats,
    getTopCustomersByBranch,
    updateEmployee,
    deleteEmployee,
    renderEmployeeManagement,
    renderEditEmployeeForm
};
