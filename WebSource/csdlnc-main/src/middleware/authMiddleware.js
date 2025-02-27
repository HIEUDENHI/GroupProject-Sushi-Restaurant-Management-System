const isLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        next(); // Đã đăng nhập, tiếp tục
    } else {
        res.redirect('/login'); // Chưa đăng nhập, chuyển hướng về trang đăng nhập
    }
};
const redirectIfLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        res.redirect('/'); // Đã đăng nhập, chuyển về trang chủ
    } else {
        next(); // Chưa đăng nhập, tiếp tục
    }
};
const checkRole = (roles) => {
    return (req, res, next) => {
        const user = req.session.user;
        if (user && roles.includes(user.role)) {
            next(); // Vai trò hợp lệ, tiếp tục
        } else {
            res.status(403).send('Bạn không có quyền truy cập vào chức năng này.');
        }
    };
};

module.exports = { checkRole };

module.exports = {
    isLoggedIn,
    redirectIfLoggedIn,
    checkRole
};