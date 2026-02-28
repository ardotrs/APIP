const express = require('express');
const { listEmployees, createEmployee } = require('../controllers/employeeController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const validate = require('../middleware/validate');
const { employeeSchema } = require('../utils/schemas');

const router = express.Router();

router.use(auth);
router.get('/', listEmployees);
router.post('/', role('Admin'), validate(employeeSchema), createEmployee);

module.exports = router;
