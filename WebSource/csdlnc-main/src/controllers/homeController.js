const path = require('path');

// Hàm lấy trang chủ
const getHomepage = (req, res) => {
    const user = req.session.user; // Lấy thông tin user từ session
    res.render('home', { title: 'Homepage', user }); // Truyền user vào view
};

module.exports = { getHomepage };