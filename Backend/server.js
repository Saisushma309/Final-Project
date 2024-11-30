const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { expressjwt: jwtMiddleware } = require('express-jwt');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'final_database',
    database: 'final_database',
};

const connection = mysql.createConnection(dbConfig);

const secretKey = 'SaiSushma';

// Middleware to handle JWT authentication
const authMiddleware = jwtMiddleware({
    secret: secretKey,
    algorithms: ['HS256'],
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Successfully connected to MySQL');
});

// Helper to close MySQL connection
const closeDatabaseConnection = () => {
    connection.end((err) => {
        if (err) {
            console.error('Error during database disconnection:', err);
        } else {
            console.log('Database connection closed');
        }
    });
};

// Utility to format date as YYYY-MM-DD
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Generate a random salt
const createSalt = () => crypto.randomBytes(32).toString('hex');

// Hash password with salt
const hashPassword = (password, salt) => {
    const hash = crypto.createHash('sha256');
    hash.update(password + salt);
    return hash.digest('hex');
};

// Route to handle user signup
app.post('/api/signup', (req, res) => {
    const { first_name, last_name, password, username, phone_number } = req.body;
    const salt = createSalt();
    const hashedPassword = hashPassword(password, salt);
    const currentDate = formatDate(new Date());

    const query = `
        INSERT INTO user (first_name, last_name, password, salt, created_date, username, phone_number)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [first_name, last_name, hashedPassword, salt, currentDate, username, phone_number];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ success: false, error: err.sqlMessage });
        } else {
            res.json({ status: 200, success: true, response: results });
        }
    });
});

// Route to handle user login
app.post('/api/login', (req, res) => {
    const { password, username } = req.body;

    connection.query('SELECT * FROM user WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error retrieving user data' });
        } else if (results.length === 0) {
            res.status(404).json({ success: false, message: 'User not found' });
        } else {
            const user = results[0];
            const hashedInputPassword = hashPassword(password, user.salt);

            if (hashedInputPassword === user.password) {
                const token = jwt.sign(
                    { username: user.username, userId: user.id },
                    secretKey,
                    { expiresIn: '5m' }
                );

                res.json({
                    success: true,
                    message: 'Login successful',
                    user: {
                        username: user.username,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        user_id: user.id,
                    },
                    token,
                });
            } else {
                res.status(401).json({ success: false, message: 'Incorrect password' });
            }
        }
    });
});

// Route to handle user logout
app.post('/api/logout', (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token is missing' });
    }

    try {
        jwt.verify(token, secretKey);
        res.setHeader('Clear-Token', 'true');
        res.json({ success: true, message: 'Logout successful' });
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
});

app.get('/api/electronicvehiclesales', authMiddleware, (req, res) => {
    const userId = req.auth.userId;  // Assuming you have user authentication

    connection.query(
        'SELECT year, SalesinMillions FROM electricvehiclesales',  // Fetch all data from solar_growth table
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to get Electronic Vehicle Sales  data' });
            } else {
                res.json(results);
            }
        }
    );
});

app.get('/api/evusage', authMiddleware, (req, res) => {
    const userId = req.auth.userId; // Assuming user authentication

    connection.query(
        'SELECT categoryName, amount FROM ev_usage',  // Query the ev_usage table
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to retrieve EV usage data' });
            }
            res.json(results);  // Return the data
        }
    );
});

// Root route for server check
app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is operational' });
});

// Start server
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Cleanup connections on exit
process.on('exit', () => {
    server.close();
    closeDatabaseConnection();
    console.log('Server and database connections closed');
});

module.exports = app;
