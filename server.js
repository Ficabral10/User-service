require('dotenv').config();

const express = require('express');
const userRoutes = require('./src/routes/users/userRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/users', userRoutes);

if (require.main === module) {
    app.listen(PORT, () => console.log(`User service running on port ${PORT}`));
}

module.exports = app;
