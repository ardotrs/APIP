const express = require('express');
const { getDashboard } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

router.get('/', auth, role('Admin', 'Pimpinan'), getDashboard);

module.exports = router;
