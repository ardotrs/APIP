const express = require('express');
const { exportExcel, exportPdf } = require('../controllers/exportController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

router.use(auth, role('Admin', 'Pimpinan'));
router.get('/excel', exportExcel);
router.get('/pdf', exportPdf);

module.exports = router;
