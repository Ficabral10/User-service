const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;

require('dotenv').config();
const userRoutes = require('./src/routes/users/userRoutes');

app.use(express.json());

app.get('/health', (req, res) => {
    res.send('Working!')
})

app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
