// server.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const webRoutes = require('./routes/web'); // Đảm bảo import đúng route
const connectDB = require('./config/database'); // Add this line

const app = express();
const port = process.env.PORT || 3000;

// Initialize database connection
connectDB()
    .then(pool => {
        console.log('Database connection pool established');
        global.pool = pool; // Optional: store pool globally
    })
    .catch(err => {
        console.error('Failed to establish database connection:', err);
        process.exit(1); // Exit if database connection fails
    });

// Cấu hình view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Cấu hình session
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình static files
app.use(express.static(path.join(__dirname, 'public')));

// Sử dụng route từ web.js
app.use('/', webRoutes);

// Khởi động server
app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
});
