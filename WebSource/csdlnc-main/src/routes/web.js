const express = require('express');
const router = express.Router();
const { getHomepage } = require('../controllers/homeController');
const { getLogin, postLogin, logout, postRegister } = require('../controllers/accountController');
const { isLoggedIn, redirectIfLoggedIn, checkRole } = require('../middleware/authMiddleware');
const { getAllDishes, searchDishes,getMenuByBranch } = require('../controllers/dishController');
const { createOrder, addDishToExistingOrder, checkoutTable } = require('../controllers/orderController');
const { callInvoiceProcedure, showInvoice } = require('../controllers/invoiceController');
const { showTablesByBranch, updateTableStatus, getServingTables, addCustomerReservation, getAvailableTables, renderAddReservationForm,getBranches } = require('../controllers/tableController');
const { showBranchesInfo } = require('../controllers/branchController');
const { getSystemRevenueStats, getDishRevenueStats, getBranchRevenueStats, transferEmployee, addEmployee, updateMembershipTiers,showAdminDashboard, getCustomerStats,getTopCustomersByBranch,updateEmployee,deleteEmployee,renderEmployeeManagement,renderEditEmployeeForm } = require('../controllers/adminController');
// Hiển thị danh sách tất cả món ăn
router.get('/dishes', getAllDishes);

// Tìm kiếm món ăn
router.get('/search', searchDishes);



// Middleware để thêm user vào tất cả các view
router.use((req, res, next) => {
    res.locals.user = req.session && req.session.user ? req.session.user : null;
    next();
});


// Trang chủ
router.get('/', getHomepage);
router.get('/branches', showBranchesInfo);


// Đăng nhập và đăng ký
router.get('/login', redirectIfLoggedIn, getLogin);
router.post('/login', postLogin);
router.get('/logout', isLoggedIn, logout);
router.post('/register', postRegister);
router.get('/register', (req, res) => {
    res.render('register'); // Render file register.ejs
});
router.get('/staff/tables/:branchId', checkRole(['NhanVien']), showTablesByBranch);
router.post('/staff/tables/:branchId/:tableId/status', checkRole(['NhanVien']), updateTableStatus);

// Hiển thị menu và đặt món
router.get('/staff/menu/:branchId/:tableId', checkRole(['NhanVien']), getMenuByBranch);
router.post('/staff/tables/:branchId/:tableId/create-order', checkRole(['NhanVien']), createOrder);

// Thêm món vào phiếu đặt món đã có
router.post('/staff/menu/:branchId/:tableId/:MaPhieu/add-dishes', checkRole(['NhanVien']), addDishToExistingOrder);

// Checkout và tạo hóa đơn
router.post('/staff/tables/:branchId/:tableId/checkout', checkRole(['NhanVien']), checkoutTable);
router.post('/staff/invoices/create', checkRole(['NhanVien']), callInvoiceProcedure);

// Hiển thị hóa đơn
router.get('/staff/invoice/:id', checkRole(['NhanVien']), showInvoice);

// Các bàn đang phục vụ
router.get('/staff/tables/serving/:branchId', checkRole(['NhanVien']), getServingTables);


router.get('/admin', checkRole(['QuanLy']), showAdminDashboard);


// Route hiển thị doanh thu hệ thống
router.get('/admin/revenue-stats', checkRole(['QuanLy']), getSystemRevenueStats);

// Route hiển thị doanh thu món ăn
router.get('/admin/dish-revenue-stats', checkRole(['QuanLy']), getDishRevenueStats);

// Route hiển thị doanh thu chi nhánh
router.get('/admin/branch-revenue-stats',checkRole(['QuanLy']), getBranchRevenueStats);



// Route chuyển nhân viên giữa các chi nhánh
router.post('/admin/employees', checkRole(['QuanLy']), transferEmployee);


// Route thêm nhân viên mới



router.get(
    '/customer/add-reservation',
    checkRole(['KhachHang', 'NhanVien']), // Cho phép cả hai role
    (req, res) => {
        const success = req.query.success ? 'Đặt bàn thành công!' : null;
        res.render('customerAddReservation', { errorMessage: null, successMessage: success });
    }
);
router.get('/admin/customer-stats', checkRole(['QuanLy']), getCustomerStats);
// Xử lý đặt bàn
router.get('/customer/available-tables',checkRole(['KhachHang']), getAvailableTables);
router.get('/customer/add-reservation', checkRole(['KhachHang']), renderAddReservationForm);
router.post('/customer/add-reservation', checkRole(['KhachHang']), addCustomerReservation);
router.get('/customer/branches', checkRole(['KhachHang']), getBranches);
// Route: Cập nhật nhân viên

router.get('/admin/top-customers', checkRole(['QuanLy']), getTopCustomersByBranch);
router.get('/admin/update-membership-tiers', checkRole(['QuanLy']), updateMembershipTiers);
router.get('/admin/employees', renderEmployeeManagement);

// Route: Thêm nhân viên
router.post('/admin/employees/add', checkRole(['QuanLy']), addEmployee);

// Route: Xóa nhân viên
router.post('/admin/employees/delete', checkRole(['QuanLy']), deleteEmployee);

// Route: Hiển thị form chỉnh sửa nhân viên
router.get('/admin/employees/edit/:employeeId', checkRole(['QuanLy']), renderEditEmployeeForm);

// Route: Cập nhật nhân viên
router.post('/admin/employees/edit-employee/:employeeId', checkRole(['QuanLy']), updateEmployee);

module.exports = router;
