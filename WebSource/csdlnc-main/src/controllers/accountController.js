const connection = require('../config/database');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const getLogin = (req, res) => {
    res.render('login', { errorMessage: req.session.errorMessage });
    delete req.session.errorMessage; // Xóa thông báo sau khi hiển thị
};

// Hàm đăng nhập người dùng
const postLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const pool = await connection();

        // Gọi stored procedure để xác thực tài khoản
        const result = await pool.request()
            .input('Username', sql.NVarChar(50), username)
            .execute('sp_AuthenticateUser');

        if (result.recordset.length === 0) {
            req.session.errorMessage = "Tên đăng nhập hoặc mật khẩu không đúng.";
            return res.redirect('/login');
        }

        const user = result.recordset[0];
        const isPasswordValid = await bcrypt.compare(password, user.Password);

        if (isPasswordValid) {
            // Lưu thông tin tài khoản và chi nhánh vào session
            req.session.user = {
                id: user.MaTaiKhoan,
                name: user.Username,
                role: user.VaiTro,
                branchId: user.MaChiNhanh || null // Không phải nhân viên sẽ không có branchId
            };

            // Điều hướng tùy vào vai trò
            if (user.VaiTro === 'NhanVien') {
                return res.redirect(`/staff/tables/${user.MaChiNhanh}`);
            } else if (user.VaiTro === 'QuanLy') {
                return res.redirect('/admin');
            } else if (user.VaiTro === 'KhachHang') {
                return res.redirect('/'); // Điều hướng đến homepage
            }

            return res.redirect('/login'); // Fallback
        } else {
            req.session.errorMessage = "Mật khẩu không chính xác.";
            return res.redirect('/login');
        }
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        res.status(500).send('Đã xảy ra lỗi máy chủ.');
    }
};



// Hàm đăng xuất
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Lỗi khi đăng xuất.");
        }
        res.redirect('/');
    });
};

const postRegister = async (req, res) => {
    const { username, password, vaitro, makhachhang, manhanvien } = req.body;

    try {
        // Kết nối tới SQL Server
        const hashedPassword = await bcrypt.hash(password, 10);
        const pool = await connection();

        // Kiểm tra username đã tồn tại chưa
        const checkUser = await pool.request()
            .input('Username', sql.NVarChar(50), username)
            .query(`SELECT Username FROM TAIKHOAN WHERE Username = @Username`);

        if (checkUser.recordset.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Thêm tài khoản mới
        const result = await pool.request()
            .input('Username', sql.NVarChar(50), username)
            .input('Password', sql.NVarChar(256), hashedPassword)
            .input('VaiTro', sql.NVarChar(20), vaitro)
            .input('MaKhachHang', sql.Int, makhachhang || null)
            .input('MaNhanVien', sql.Int, manhanvien || null)
            .query(
                `INSERT INTO TAIKHOAN (Username, Password, VaiTro, MaKhachHang, MaNhanVien)
                 VALUES (@Username, @Password, @VaiTro, @MaKhachHang, @MaNhanVien)`
            );

        if (result.rowsAffected[0] > 0) {
            res.status(201).json({ message: 'Registration successful!' });
        } else {
            res.status(500).json({ message: 'Registration failed, please try again' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};
module.exports = { 
    postLogin, 
    logout, 
    getLogin,
    postRegister
};
