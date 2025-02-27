const connection = require('../config/database');
const sql = require('mssql');

// Hiển thị tất cả các món ăn
const getAllDishes = async (req, res) => {
    const { branchId, menuId, regionId } = req.query; // Lấy các tham số lọc từ query string

    try {
        const pool = await connection();

        // Gọi stored procedure `sp_FindFoodInformationFromRegionOrBranch`
        const request = pool.request();
        request.input('MaKhuVuc', sql.Int, regionId || null); // Nếu không có regionId, truyền NULL
        request.input('MaChiNhanh', sql.Int, branchId || null); // Nếu không có branchId, truyền NULL

        const result = await request.execute('sp_FindFoodInformationFromRegionOrBranch');

        // Lấy danh sách món ăn từ kết quả của stored procedure
        const dishesMap = new Map();
        result.recordset.forEach(row => {
            if (!dishesMap.has(row.MaMon)) {
                dishesMap.set(row.MaMon, {
                    TenMon: row.TenMon,
                    GiaTien: row.GiaTien || 0,
                    TenMucThucDon: row.TenMucThucDon || 'Không xác định',
                    TenKhuVuc: row.TenKhuVuc || 'Không xác định',
                    ChiNhanh: []
                });
            }
            if (row.TenChiNhanh) {
                dishesMap.get(row.MaMon).ChiNhanh.push(row.TenChiNhanh);
            }
        });

        const dishes = Array.from(dishesMap.values());

        // Lấy danh sách chi nhánh, mục thực đơn và khu vực để render filter
        const branches = await pool.request().query(`SELECT MaChiNhanh, TenChiNhanh FROM CHINHANH`);
        const menus = await pool.request().query(`SELECT MaMucThucDon, TenMucThucDon FROM MUCTHUCDON`);
        const regions = await pool.request().query(`SELECT MaKhuVuc, TenKhuVuc FROM KHUVUC`);

        res.render('dishes', {
            dishes,
            branches: branches.recordset,
            menus: menus.recordset,
            regions: regions.recordset, // Truyền danh sách khu vực vào view
            selectedBranch: branchId || '',
            selectedMenu: menuId || '',
            selectedRegion: regionId || '' // Truyền giá trị khu vực được chọn vào view
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách món ăn:', error);
        res.status(500).send('Đã xảy ra lỗi máy chủ.');
    }
};


// Chức năng tìm kiếm món ăn (kèm search suggestions)
const searchDishes = async (req, res) => {
    const query = req.query.q; // Lấy từ khóa tìm kiếm từ query string

    try {
        const pool = await connection();

        // Tìm các món ăn có tên chứa từ khóa (không phân biệt chữ hoa/thường)
        const result = await pool.request()
            .input('query', sql.NVarChar(100), `%${query}%`)
            .query(`
                SELECT MaMon, TenMon, GiaTien
                FROM MONAN
                WHERE TenMon LIKE @query
            `);

        // Kiểm tra nếu là yêu cầu gợi ý (AJAX) hoặc render kết quả tìm kiếm
        if (req.xhr) {
            // Trả về JSON cho search suggestions
            res.json(result.recordset);
        } else {
            // Render trang kết quả tìm kiếm
            res.render('searchResults', { dishes: result.recordset, query });
        }
    } catch (error) {
        console.error('Lỗi khi tìm kiếm món ăn:', error);
        res.status(500).send('Đã xảy ra lỗi máy chủ.');
    }
};
const getMenuByBranch = async (req, res) => {
    const { branchId, tableId } = req.params;

    try {
        const pool = await connection();

        // Lấy danh sách món ăn và nhóm theo TenMucThucDon
        const result = await pool.request()
            .input('MaChiNhanh', sql.Int, branchId)
            .query(`
                SELECT DISTINCT m.MaMon, m.TenMon, m.GiaTien, mt.TenMucThucDon
                FROM MONAN m
                INNER JOIN CHINHANH_MON cm ON m.MaMon = cm.MaMon
                INNER JOIN MUCTHUCDON mt ON m.MaMucThucDon = mt.MaMucThucDon
                WHERE cm.MaChiNhanh = @MaChiNhanh
            `);

        const dishes = result.recordset;

        // Nhóm món ăn theo TenMucThucDon
        const groupedDishes = dishes.reduce((acc, dish) => {
            if (!acc[dish.TenMucThucDon]) acc[dish.TenMucThucDon] = [];
            acc[dish.TenMucThucDon].push(dish);
            return acc;
        }, {});

        // Lấy MaPhieu hiện tại của bàn (nếu có)
        const orderResult = await pool.request()
            .input('MaChiNhanh', sql.Int, branchId)
            .input('STTBan', sql.Int, tableId)
            .query(`
                SELECT TOP 1 MaPhieu
                FROM THONGTINPHIEUDATMON
                WHERE MaChiNhanh = @MaChiNhanh AND STTBan = @STTBan
                ORDER BY NgayLap DESC
            `);

        const MaPhieu = orderResult.recordset.length > 0 ? orderResult.recordset[0].MaPhieu : null;

        // Render trang menu và truyền dữ liệu
        res.render('menu_staff', { 
            branchId, 
            tableId, 
            groupedDishes, // Truyền dữ liệu đã nhóm
            MaPhieu 
        });
    } catch (error) {
        console.error('Lỗi khi lấy menu chi nhánh:', error);
        res.status(500).send('Đã xảy ra lỗi máy chủ.');
    }
};



module.exports = { getAllDishes, searchDishes, getMenuByBranch};
