const express = require('express');
const { listAssignments, createAssignment } = require('../controllers/assignmentController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const validate = require('../middleware/validate');
const { assignmentSchema } = require('../utils/schemas');
const upload = require('../utils/upload');

const router = express.Router();

router.use(auth);
router.get('/', listAssignments);
router.post('/', role('Admin', 'Pimpinan'), upload.single('document'), validate(assignmentSchema), createAssignment);

module.exports = router;
